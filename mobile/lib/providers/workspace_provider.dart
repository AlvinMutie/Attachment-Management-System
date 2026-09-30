import 'package:flutter/foundation.dart';
import '../core/errors/app_exceptions.dart';
import '../models/workspace_model.dart';
import '../services/workspace_service.dart';

enum WorkspaceStatus { initial, loading, loaded, error }

/// Provider for student dashboard workspace data.
/// Uses cached data and prevents duplicate concurrent fetches.
class WorkspaceProvider extends ChangeNotifier {
  final WorkspaceService _service;

  WorkspaceStatus _status = WorkspaceStatus.initial;
  WorkspaceModel? _workspace;
  String? _errorMessage;
  bool _isFetching = false;

  WorkspaceProvider({WorkspaceService? service})
      : _service = service ?? WorkspaceService();

  WorkspaceStatus get status => _status;
  WorkspaceModel? get workspace => _workspace;
  String? get errorMessage => _errorMessage;
  bool get isLoading => _status == WorkspaceStatus.loading;
  bool get hasData => _status == WorkspaceStatus.loaded && _workspace != null;
  bool get hasError => _status == WorkspaceStatus.error;

  /// Fetches the workspace. No-ops if a fetch is already in flight.
  Future<void> fetchWorkspace({bool forceRefresh = false}) async {
    if (_isFetching) return;
    if (!forceRefresh && _status == WorkspaceStatus.loaded) return;

    _isFetching = true;
    _status = WorkspaceStatus.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      final workspace = await _service.getWorkspace();
      _workspace = workspace;
      _status = WorkspaceStatus.loaded;
      _errorMessage = null;
    } on NetworkException catch (e) {
      _status = WorkspaceStatus.error;
      _errorMessage = e.message;
    } on UnauthorizedException {
      _status = WorkspaceStatus.error;
      _errorMessage = 'Your session has expired. Please sign in again.';
    } on AppException catch (e) {
      _status = WorkspaceStatus.error;
      _errorMessage = e.message;
    } catch (e) {
      _status = WorkspaceStatus.error;
      _errorMessage =
          'Failed to load your dashboard. Please check your connection and try again.';
    } finally {
      _isFetching = false;
      notifyListeners();
    }
  }

  /// Retries fetching after an error
  Future<void> retry() => fetchWorkspace(forceRefresh: true);

  /// Clears cached data (e.g., on logout)
  void clear() {
    _workspace = null;
    _status = WorkspaceStatus.initial;
    _errorMessage = null;
    _isFetching = false;
    notifyListeners();
  }
}
