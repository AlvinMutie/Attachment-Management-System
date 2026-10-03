import 'package:flutter/foundation.dart';
import '../core/errors/app_exceptions.dart';
import '../models/logbook_model.dart';
import '../services/logbook_service.dart';

enum LogbookStatusFilter {
  all,
  reviewed,
  underReview,
  drafts,
  rejected,
}

/// Provider managing logbook state, week selection, filtering, and submissions
class LogbookProvider extends ChangeNotifier {
  final LogbookService _service;

  LogbookProvider({LogbookService? service})
      : _service = service ?? LogbookService();

  List<LogbookModel> _logbooks = [];
  bool _isLoading = false;
  bool _isFetching = false;
  String? _errorMessage;

  int _selectedWeek = 1;
  LogbookStatusFilter _activeFilter = LogbookStatusFilter.all;

  bool _isSubmitting = false;
  String? _submissionError;

  // Local draft storage for unsubmitted weeks
  final Map<int, LogbookModel> _localDrafts = {};

  // Getters
  List<LogbookModel> get logbooks => List.unmodifiable(_logbooks);
  bool get isLoading => _isLoading;
  bool get isSubmitting => _isSubmitting;
  String? get errorMessage => _errorMessage;
  String? get submissionError => _submissionError;
  int get selectedWeek => _selectedWeek;
  LogbookStatusFilter get activeFilter => _activeFilter;

  /// Returns the logbook model for the currently selected week (either from API or draft)
  LogbookModel? get selectedLogbook {
    final serverLog = _logbooks.where((l) => l.weekNumber == _selectedWeek).firstOrNull;
    if (serverLog != null) return serverLog;
    return _localDrafts[_selectedWeek];
  }

  /// Returns list of all available weeks to navigate
  List<int> get availableWeeks {
    final weeks = <int>{};
    for (final l in _logbooks) {
      weeks.add(l.weekNumber);
    }
    for (final w in _localDrafts.keys) {
      weeks.add(w);
    }
    weeks.add(_selectedWeek);

    // Show window around selected week (e.g. Week 5, 6, 7, 8, 9 matching Stitch)
    final startWindow = (_selectedWeek - 2).clamp(1, 999);
    final endWindow = _selectedWeek + 2;
    for (var i = startWindow; i <= endWindow; i++) {
      weeks.add(i);
    }

    final sorted = weeks.toList()..sort();
    return sorted;
  }

  static const List<String> _filterWeekdays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
  ];

  /// Number of approved daily entries in the active week
  int get approvedCount {
    final log = selectedLogbook;
    if (log == null) return 0;
    var count = 0;
    for (final d in _filterWeekdays) {
      final entry = log.getDailyEntry(d);
      final status = (entry?.statusOverride ?? log.status).toLowerCase();
      if (entry != null && entry.hasContent && status == 'approved') {
        count++;
      }
    }
    return count;
  }

  /// Number of pending / under-review daily entries in the active week
  int get pendingCount {
    final log = selectedLogbook;
    if (log == null) return 0;
    var count = 0;
    for (final d in _filterWeekdays) {
      final entry = log.getDailyEntry(d);
      final status = (entry?.statusOverride ?? log.status).toLowerCase();
      if (entry != null && entry.hasContent && status == 'pending') {
        count++;
      }
    }
    return count;
  }

  /// Number of rejected daily entries in the active week
  int get rejectedCount {
    final log = selectedLogbook;
    if (log == null) return 0;
    var count = 0;
    for (final d in _filterWeekdays) {
      final entry = log.getDailyEntry(d);
      final status = (entry?.statusOverride ?? log.status).toLowerCase();
      if (entry != null && entry.hasContent && status == 'rejected') {
        count++;
      }
    }
    return count;
  }

  /// Number of draft or scheduled daily entries in the active week
  int get draftCount {
    final log = selectedLogbook;
    if (log == null) return 5;
    var count = 0;
    for (final d in _filterWeekdays) {
      final entry = log.getDailyEntry(d);
      final status = (entry?.statusOverride ?? log.status).toLowerCase();
      if (entry == null || !entry.hasContent || status == 'draft') {
        count++;
      }
    }
    return count;
  }

  /// Total count across all days in the week
  int get allCount => 5;

  /// Fetches logbooks from backend
  Future<void> fetchLogbooks({bool forceRefresh = false}) async {
    if (_isFetching && !forceRefresh) return;

    _isFetching = true;
    if (_logbooks.isEmpty || forceRefresh) {
      _isLoading = true;
      _errorMessage = null;
      notifyListeners();
    }

    try {
      final list = await _service.getLogbooks();
      _logbooks = list;
      _errorMessage = null;

      // Automatically select latest or rejected week if not set
      if (_logbooks.isNotEmpty) {
        // Prioritize rejected logbooks needing student action
        final rejected = _logbooks.where((l) => l.isRejected).firstOrNull;
        if (rejected != null) {
          _selectedWeek = rejected.weekNumber;
        } else if (_logbooks.any((l) => l.weekNumber == _selectedWeek)) {
          // Keep current selected week
        } else {
          _selectedWeek = _logbooks.map((l) => l.weekNumber).reduce((a, b) => a > b ? a : b);
        }
      }
    } on AppException catch (e) {
      _errorMessage = e.message;
    } catch (e) {
      _errorMessage = 'An unexpected error occurred while fetching logbooks.';
    } finally {
      _isLoading = false;
      _isFetching = false;
      notifyListeners();
    }
  }

  /// Selects a specific week
  void selectWeek(int week) {
    if (_selectedWeek != week) {
      _selectedWeek = week;
      notifyListeners();
    }
  }

  /// Updates status filter
  void setFilter(LogbookStatusFilter filter) {
    if (_activeFilter != filter) {
      _activeFilter = filter;
      notifyListeners();
    }
  }

  /// Creates and submits a new logbook
  Future<bool> createLogbook({
    required int weekNumber,
    required String startDate,
    required String endDate,
    required String summary,
    required Map<String, dynamic> dailyEntries,
  }) async {
    if (_isSubmitting) return false;

    _isSubmitting = true;
    _submissionError = null;
    notifyListeners();

    try {
      final created = await _service.submitLogbook(
        weekNumber: weekNumber,
        startDate: startDate,
        endDate: endDate,
        summary: summary,
        dailyEntries: dailyEntries,
      );

      // Remove local draft if any
      _localDrafts.remove(weekNumber);

      // Add to list and sort
      _logbooks.removeWhere((l) => l.id == created.id || l.weekNumber == created.weekNumber);
      _logbooks.add(created);
      _logbooks.sort((a, b) => b.weekNumber.compareTo(a.weekNumber));
      _selectedWeek = created.weekNumber;
      _submissionError = null;
      return true;
    } on AppException catch (e) {
      _submissionError = e.message;
      return false;
    } catch (e) {
      _submissionError = 'Failed to submit logbook: $e';
      return false;
    } finally {
      _isSubmitting = false;
      notifyListeners();
    }
  }

  /// Updates/resubmits an existing logbook
  Future<bool> updateLogbook({
    required String id,
    required String summary,
    required Map<String, dynamic> dailyEntries,
  }) async {
    if (_isSubmitting) return false;

    _isSubmitting = true;
    _submissionError = null;
    notifyListeners();

    try {
      final updated = await _service.updateLogbook(
        id,
        summary: summary,
        dailyEntries: dailyEntries,
      );

      final index = _logbooks.indexWhere((l) => l.id == id);
      if (index != -1) {
        _logbooks[index] = updated;
      } else {
        _logbooks.add(updated);
      }
      _logbooks.sort((a, b) => b.weekNumber.compareTo(a.weekNumber));
      _submissionError = null;
      return true;
    } on AppException catch (e) {
      _submissionError = e.message;
      return false;
    } catch (e) {
      _submissionError = 'Failed to update logbook: $e';
      return false;
    } finally {
      _isSubmitting = false;
      notifyListeners();
    }
  }

  /// Saves a local draft entry without submitting to backend
  void saveLocalDraft({
    required int weekNumber,
    required String startDate,
    required String endDate,
    required String summary,
    required Map<String, dynamic> dailyEntries,
  }) {
    _localDrafts[weekNumber] = LogbookModel(
      id: 'draft_$weekNumber',
      studentId: '',
      weekNumber: weekNumber,
      startDate: startDate,
      endDate: endDate,
      summary: summary,
      dailyEntries: dailyEntries,
      status: 'draft',
    );
    notifyListeners();
  }

  /// Retries fetching after error
  Future<void> retry() => fetchLogbooks(forceRefresh: true);

  /// Clears state on logout
  void clear() {
    _logbooks = [];
    _localDrafts.clear();
    _isLoading = false;
    _isFetching = false;
    _errorMessage = null;
    _isSubmitting = false;
    _submissionError = null;
    _selectedWeek = 1;
    _activeFilter = LogbookStatusFilter.all;
    notifyListeners();
  }
}
