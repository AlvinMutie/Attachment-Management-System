import '../core/api/api_client.dart';
import '../core/constants/api_constants.dart';
import '../core/errors/app_exceptions.dart';
import '../core/storage/secure_storage_service.dart';
import '../models/user_model.dart';

/// Service managing authentication API operations, session validation, and student-only gating
class AuthService {
  final ApiClient _apiClient;
  final SecureStorageService _storageService;

  AuthService({
    ApiClient? apiClient,
    SecureStorageService? storageService,
  })  : _apiClient = apiClient ?? ApiClient(),
        _storageService = storageService ?? SecureStorageService();

  /// Logs in a student using email or admission number and password.
  /// Enforces student-only role gating.
  Future<UserModel> login({
    required String identifier,
    required String password,
  }) async {
    final trimmedIdentifier = identifier.trim();
    if (trimmedIdentifier.isEmpty || password.isEmpty) {
      throw const ValidationException('Email or admission number and password are required.');
    }

    final response = await _apiClient.post(
      ApiConstants.login,
      body: {
        'identifier': trimmedIdentifier,
        'password': password,
      },
      requiresAuth: false,
    );

    if (response is! Map<String, dynamic>) {
      throw const ApiException('Invalid authentication response received from server.');
    }

    final token = response['token']?.toString();
    if (token == null || token.isEmpty) {
      throw const ApiException('No authentication token returned by the server.');
    }

    final basicUser = UserModel.fromJson(response);

    // Student-only role verification
    if (!basicUser.isStudent) {
      throw ForbiddenException(
        'Access denied. The AttachPro mobile application is strictly for students. '
        'Account role "${basicUser.role}" is not permitted.',
      );
    }

    // Securely persist token
    await _storageService.saveToken(token);
    await _storageService.saveSessionMeta(
      userId: basicUser.id,
      role: basicUser.role,
    );

    // Fetch full profile to get student admission number, department, etc.
    try {
      final meUser = await getCurrentUser();
      return meUser;
    } catch (_) {
      // Fallback to basic user if profile enrichment fails
      return basicUser;
    }
  }

  /// Retrieves the current authenticated user's profile from /api/auth/me
  Future<UserModel> getCurrentUser() async {
    final response = await _apiClient.get(
      ApiConstants.me,
      requiresAuth: true,
    );

    if (response is! Map<String, dynamic>) {
      throw const ApiException('Invalid user profile response received from server.');
    }

    final user = UserModel.fromJson(response);

    // Enforce student-only gate
    if (!user.isStudent) {
      await logout();
      throw ForbiddenException(
        'Access denied. Role "${user.role}" is not authorized for the student application.',
      );
    }

    return user;
  }

  /// Restores session on app startup if a valid token is present
  Future<UserModel?> restoreSession() async {
    final hasToken = await _storageService.hasToken();
    if (!hasToken) {
      return null;
    }

    try {
      final user = await getCurrentUser();
      return user;
    } on UnauthorizedException {
      await logout();
      return null;
    } on ForbiddenException {
      await logout();
      rethrow;
    } catch (e) {
      // Network issues or temporary server failure on launch
      await logout();
      return null;
    }
  }

  /// Clears persisted JWT and session data securely
  Future<void> logout() async {
    await _storageService.clearAll();
  }
}
