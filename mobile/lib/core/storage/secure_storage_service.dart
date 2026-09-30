import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Secure token and session storage using Android Keystore / iOS Keychain via FlutterSecureStorage.
/// Strictly avoids SharedPreferences for sensitive authentication credentials.
class SecureStorageService {
  final FlutterSecureStorage _storage;

  static const String _keyJwtToken = 'attachpro_jwt_token';
  static const String _keyUserId = 'attachpro_user_id';
  static const String _keyUserRole = 'attachpro_user_role';

  SecureStorageService({FlutterSecureStorage? storage})
      : _storage = storage ??
            const FlutterSecureStorage(
              aOptions: AndroidOptions(
                encryptedSharedPreferences: true,
              ),
              iOptions: IOSOptions(
                accessibility: KeychainAccessibility.first_unlock,
              ),
            );

  /// Securely stores the JWT token
  Future<void> saveToken(String token) async {
    await _storage.write(key: _keyJwtToken, value: token);
  }

  /// Retrieves the persisted JWT token, or null if absent
  Future<String?> getToken() async {
    try {
      return await _storage.read(key: _keyJwtToken);
    } catch (_) {
      return null;
    }
  }

  /// Checks if a non-empty token exists
  Future<bool> hasToken() async {
    final token = await getToken();
    return token != null && token.trim().isNotEmpty;
  }

  /// Securely removes the JWT token
  Future<void> clearToken() async {
    try {
      await _storage.delete(key: _keyJwtToken);
    } catch (_) {}
  }

  /// Saves basic session metadata (non-sensitive identifiers only)
  Future<void> saveSessionMeta({required String userId, required String role}) async {
    await _storage.write(key: _keyUserId, value: userId);
    await _storage.write(key: _keyUserRole, value: role);
  }

  /// Clears all stored authentication and session state on logout
  Future<void> clearAll() async {
    try {
      await _storage.deleteAll();
    } catch (_) {}
  }
}
