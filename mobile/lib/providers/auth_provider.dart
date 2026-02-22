import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../constants/api_constants.dart';

class AuthProvider with ChangeNotifier {
  Map<String, dynamic>? _user;
  bool _isLoading = true;
  String? _error;

  Map<String, dynamic>? get user => _user;
  bool get isLoading => _isLoading;
  bool get isLoggedIn => _user != null;
  String? get error => _error;

  AuthProvider() {
    // Inject mock user for debugging without login
    _user = {
      'id': 'mock-id',
      'name': 'Test Supervisor',
      'email': 'supervisor@example.com',
      'role': 'industry_supervisor',
      'schoolName': 'Mock University',
    };
    _isLoading = false;
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    _isLoading = true;
    notifyListeners();

    final token = await ApiService.getToken();
    if (token != null) {
      final result = await ApiService.get(ApiConstants.me);
      // Backend returns { success: true, data: user }
      final userData = result['data'];
      if (userData != null && userData['id'] != null) {
        _user = userData;
      } else {
        await ApiService.clearToken();
      }
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    final result = await ApiService.post(ApiConstants.login, {
      'email': email,
      'password': password,
    });

    if (result['token'] != null) {
      final userData = result['user'];
      // Verify role is industry_supervisor
      if (userData == null || userData['role'] != 'industry_supervisor') {
        _error = 'This app is for Industry Supervisors only';
        _isLoading = false;
        notifyListeners();
        return false;
      }

      await ApiService.saveToken(result['token']);
      _user = userData;
      _isLoading = false;
      notifyListeners();
      return true;
    }

    _error = result['message'] ?? 'Login failed';
    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> logout() async {
    await ApiService.clearToken();
    _user = null;
    _error = null;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
