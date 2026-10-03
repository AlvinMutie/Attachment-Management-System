import 'package:flutter/foundation.dart';
import '../core/errors/app_exceptions.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

enum AuthStatus {
  initial,
  authenticating,
  authenticated,
  unauthenticated,
}

/// Central state provider for student authentication and session lifecycle
class AuthProvider extends ChangeNotifier {
  final AuthService _authService;

  AuthStatus _status = AuthStatus.initial;
  UserModel? _user;
  String? _errorMessage;

  bool _isDemo = false;

  AuthProvider({AuthService? authService})
      : _authService = authService ?? AuthService() {
    checkAuthStatus();
  }

  AuthStatus get status => _status;
  UserModel? get user => _user;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _status == AuthStatus.authenticated && _user != null;
  bool get isLoading => _status == AuthStatus.authenticating || _status == AuthStatus.initial;
  bool get isDemo => _isDemo;

  /// Sets a mock/demo student session for offline exploration and direct 1-click preview
  void setDemoSession() {
    _isDemo = true;
    _user = const UserModel(
      id: 'demo-student-id',
      name: 'Alvin Mutie',
      email: 'student_a@ams.com',
      role: 'student',
      schoolId: 'demo-school-id',
      status: 'active',
      admissionNumber: 'CT201/0042/22',
      department: 'Computing & Informatics',
      institution: 'Kirinyaga University',
      schoolName: 'Kirinyaga University (School A)',
    );
    _status = AuthStatus.authenticated;
    _errorMessage = null;
    notifyListeners();
  }

  /// Restores session on app startup by validating stored JWT against /api/auth/me
  Future<void> checkAuthStatus() async {
    _status = AuthStatus.initial;
    _errorMessage = null;
    notifyListeners();

    try {
      final restoredUser = await _authService.restoreSession();
      if (restoredUser != null) {
        _user = restoredUser;
        _status = AuthStatus.authenticated;
      } else {
        _user = null;
        _status = AuthStatus.unauthenticated;
      }
    } on ForbiddenException catch (e) {
      _user = null;
      _status = AuthStatus.unauthenticated;
      _errorMessage = e.message;
    } catch (_) {
      _user = null;
      _status = AuthStatus.unauthenticated;
    } finally {
      notifyListeners();
    }
  }

  /// Authenticates a student using Email or Registration Number
  Future<bool> login({
    required String identifier,
    required String password,
  }) async {
    _status = AuthStatus.authenticating;
    _errorMessage = null;
    notifyListeners();

    try {
      final user = await _authService.login(
        identifier: identifier,
        password: password,
      );

      _user = user;
      _status = AuthStatus.authenticated;
      _errorMessage = null;
      notifyListeners();
      return true;
    } on UnauthorizedException {
      _user = null;
      _status = AuthStatus.unauthenticated;
      _errorMessage = 'Invalid email/admission number or password. Please try again.';
      notifyListeners();
      return false;
    } on ForbiddenException catch (e) {
      _user = null;
      _status = AuthStatus.unauthenticated;
      _errorMessage = e.message;
      notifyListeners();
      return false;
    } on NetworkException catch (e) {
      _user = null;
      _status = AuthStatus.unauthenticated;
      _errorMessage = e.message;
      notifyListeners();
      return false;
    } on ValidationException catch (e) {
      _user = null;
      _status = AuthStatus.unauthenticated;
      _errorMessage = e.message;
      notifyListeners();
      return false;
    } catch (e) {
      _user = null;
      _status = AuthStatus.unauthenticated;
      _errorMessage = 'Unable to sign in. Please verify your connection or try again later.';
      notifyListeners();
      return false;
    }
  }

  /// Clears any active error message
  void clearError() {
    if (_errorMessage != null) {
      _errorMessage = null;
      notifyListeners();
    }
  }

  /// Terminates the current session and clears secure JWT storage
  Future<void> logout() async {
    try {
      if (!_isDemo) {
        await _authService.logout();
      }
    } finally {
      _user = null;
      _isDemo = false;
      _status = AuthStatus.unauthenticated;
      _errorMessage = null;
      notifyListeners();
    }
  }
}
