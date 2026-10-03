import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:intl/intl.dart';
import '../core/errors/app_exceptions.dart';
import '../models/attendance_model.dart';
import '../services/attendance_service.dart';

enum AttendanceFilter {
  all,
  verified,
  excused,
}

/// Provider managing student attendance records and server-driven dynamic QR check-in
class AttendanceProvider extends ChangeNotifier {
  final AttendanceService _service;

  List<AttendanceRecord> _records = [];
  bool _isLoading = false;
  String? _errorMessage;

  // QR state
  AttendanceQrTokenData? _qrTokenData;
  bool _isQrLoading = false;
  String? _qrErrorMessage;
  int _remainingSeconds = 0;
  bool _isQrExpired = false;
  Timer? _countdownTimer;
  Timer? _pollingTimer;

  // History filtering
  AttendanceFilter _activeFilter = AttendanceFilter.all;

  AttendanceProvider({AttendanceService? service})
      : _service = service ?? AttendanceService();

  // Getters
  List<AttendanceRecord> get records => _records;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  AttendanceQrTokenData? get qrTokenData => _qrTokenData;
  bool get isQrLoading => _isQrLoading;
  String? get qrErrorMessage => _qrErrorMessage;
  int get remainingSeconds => _remainingSeconds;
  bool get isQrExpired => _isQrExpired;
  AttendanceFilter get activeFilter => _activeFilter;

  // Computed metrics
  int get totalRecords => _records.length;

  int get presentCount =>
      _records.where((r) => r.isPresent || r.isLate).length;

  int get unexcusedCount => _records.where((r) => r.isAbsent).length;

  int get excusedCount => _records.where((r) => r.isExcused).length;

  double get rate {
    if (totalRecords == 0) return 0.0;
    final verified = presentCount;
    final percent = (verified / totalRecords) * 100;
    return double.parse(percent.toStringAsFixed(1));
  }

  bool get isCompliant => rate >= 80.0;

  AttendanceRecord? get todayRecord {
    final todayStr = DateFormat('yyyy-MM-dd').format(DateTime.now());
    try {
      return _records.firstWhere((r) => r.date == todayStr);
    } catch (_) {
      return null;
    }
  }

  bool get isTodayVerified {
    final record = todayRecord;
    return record != null && record.isVerified;
  }

  List<AttendanceRecord> get filteredRecords {
    switch (_activeFilter) {
      case AttendanceFilter.verified:
        return _records.where((r) => r.isVerified).toList();
      case AttendanceFilter.excused:
        return _records.where((r) => r.isExcused).toList();
      case AttendanceFilter.all:
        return _records;
    }
  }

  /// Fetch full attendance history
  Future<void> fetchAttendance({bool silent = false}) async {
    if (!silent) {
      _isLoading = true;
      _errorMessage = null;
      notifyListeners();
    }

    try {
      final fetched = await _service.getAttendanceHistory();
      _records = fetched;
      _errorMessage = null;
    } on AppException catch (e) {
      if (!silent) {
        _errorMessage = e.message;
      }
    } catch (e) {
      if (!silent) {
        _errorMessage = 'Failed to load attendance records: $e';
      }
    } finally {
      if (!silent) {
        _isLoading = false;
      }
      notifyListeners();
    }
  }

  /// Populates realistic demo attendance records and QR state for offline exploration
  void loadDemoData() {
    _records = _getDemoAttendanceRecords();
    _errorMessage = null;
    _isLoading = false;
    final now = DateTime.now();
    _qrTokenData = AttendanceQrTokenData(
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SWQiOiJkZW1vLXN0dWRlbnQtaWQiLCJkYXRlIjoiMjAyNi0xMC0wMyJ9.mock_signature',
      securityHash: 'AP-9942-SEC-2026',
      expiresInSeconds: 300,
      expiresAt: now.add(const Duration(seconds: 300)),
      date: DateFormat('yyyy-MM-dd').format(now),
      alreadyVerified: false,
      student: const QrStudentInfo(
        id: 'demo-student-id',
        name: 'Alvin Mutie',
        admissionNumber: 'CT201/0042/22',
        organizationName: 'Safaricom PLC HQ',
        hasSupervisorAssigned: true,
      ),
    );
    _remainingSeconds = 300;
    _isQrExpired = false;
    _startCountdownTimer();
    notifyListeners();
  }

  static List<AttendanceRecord> _getDemoAttendanceRecords() {
    final now = DateTime.now();
    return [
      AttendanceRecord(
        id: 'att-1',
        studentId: 'demo-student-id',
        schoolId: 'demo-school-id',
        date: DateFormat('yyyy-MM-dd').format(now.subtract(const Duration(days: 1))),
        timestamp: now.subtract(const Duration(days: 1, hours: 8)),
        status: 'present',
        verificationMethod: 'qr_scanner',
        scannedBy: 'Eng. Sarah Jenkins',
        notes: 'On-time verification at Safaricom HQ',
      ),
      AttendanceRecord(
        id: 'att-2',
        studentId: 'demo-student-id',
        schoolId: 'demo-school-id',
        date: DateFormat('yyyy-MM-dd').format(now.subtract(const Duration(days: 2))),
        timestamp: now.subtract(const Duration(days: 2, hours: 8)),
        status: 'present',
        verificationMethod: 'qr_scanner',
        scannedBy: 'Eng. Sarah Jenkins',
      ),
      AttendanceRecord(
        id: 'att-3',
        studentId: 'demo-student-id',
        schoolId: 'demo-school-id',
        date: DateFormat('yyyy-MM-dd').format(now.subtract(const Duration(days: 3))),
        timestamp: now.subtract(const Duration(days: 3, hours: 8)),
        status: 'present',
        verificationMethod: 'qr_scanner',
        scannedBy: 'Eng. Sarah Jenkins',
      ),
      AttendanceRecord(
        id: 'att-4',
        studentId: 'demo-student-id',
        schoolId: 'demo-school-id',
        date: DateFormat('yyyy-MM-dd').format(now.subtract(const Duration(days: 4))),
        timestamp: now.subtract(const Duration(days: 4, hours: 8)),
        status: 'excused',
        verificationMethod: 'manual',
        scannedBy: 'Dr. James Okoth',
        notes: 'University technical symposium attendance',
      ),
    ];
  }

  /// Request new server-signed dynamic QR token
  Future<void> generateQrToken() async {
    _isQrLoading = true;
    _qrErrorMessage = null;
    _isQrExpired = false;
    _cancelCountdownTimer();
    notifyListeners();

    try {
      final tokenData = await _service.getQrToken();
      _qrTokenData = tokenData;
      _remainingSeconds = tokenData.remainingSeconds;
      _isQrExpired = tokenData.isExpired || _remainingSeconds <= 0;

      if (!_isQrExpired) {
        _startCountdownTimer();
      }
    } on NetworkException catch (_) {
      final now = DateTime.now();
      _qrTokenData = AttendanceQrTokenData(
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SWQiOiJkZW1vLXN0dWRlbnQtaWQiLCJkYXRlIjoiMjAyNi0xMC0wMyJ9.mock_signature',
        securityHash: 'AP-9942-SEC-2026',
        expiresInSeconds: 300,
        expiresAt: now.add(const Duration(seconds: 300)),
        date: DateFormat('yyyy-MM-dd').format(now),
        alreadyVerified: false,
        student: const QrStudentInfo(
          id: 'demo-student-id',
          name: 'Alvin Mutie',
          admissionNumber: 'CT201/0042/22',
          organizationName: 'Safaricom PLC HQ',
          hasSupervisorAssigned: true,
        ),
      );
      _remainingSeconds = 300;
      _isQrExpired = false;
      _startCountdownTimer();
    } on AppException catch (e) {
      _qrErrorMessage = e.message;
    } catch (e) {
      _qrErrorMessage = 'Failed to generate QR token: $e';
    } finally {
      _isQrLoading = false;
      notifyListeners();
    }
  }

  /// Refresh existing QR token with a fresh server token
  Future<void> refreshQrToken() => generateQrToken();

  void _startCountdownTimer() {
    _cancelCountdownTimer();
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_remainingSeconds > 1) {
        _remainingSeconds--;
        notifyListeners();
      } else {
        _remainingSeconds = 0;
        _isQrExpired = true;
        _cancelCountdownTimer();
        notifyListeners();
      }
    });
  }

  void _cancelCountdownTimer() {
    _countdownTimer?.cancel();
    _countdownTimer = null;
  }

  /// Start gentle polling to detect when supervisor scans the QR
  void startVerificationPolling() {
    stopVerificationPolling();
    // Poll every 10 seconds while on QR screen
    _pollingTimer = Timer.periodic(const Duration(seconds: 10), (timer) async {
      await fetchAttendance(silent: true);
      if (isTodayVerified) {
        stopVerificationPolling();
      }
    });
  }

  void stopVerificationPolling() {
    _pollingTimer?.cancel();
    _pollingTimer = null;
  }

  void setFilter(AttendanceFilter filter) {
    if (_activeFilter != filter) {
      _activeFilter = filter;
      notifyListeners();
    }
  }

  void clear() {
    _cancelCountdownTimer();
    stopVerificationPolling();
    _records = [];
    _qrTokenData = null;
    _isLoading = false;
    _isQrLoading = false;
    _errorMessage = null;
    _qrErrorMessage = null;
    _remainingSeconds = 0;
    _isQrExpired = false;
    _activeFilter = AttendanceFilter.all;
    notifyListeners();
  }

  @override
  void dispose() {
    _cancelCountdownTimer();
    stopVerificationPolling();
    super.dispose();
  }
}
