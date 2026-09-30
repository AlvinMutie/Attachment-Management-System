import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

/// Centralized API endpoint constants and network configuration
class ApiConstants {
  ApiConstants._();

  /// Default API base URL with environment variable override and smart platform detection.
  /// Android Emulator uses 10.0.2.2 to reach host machine; Desktop/Web/Physical devices use 127.0.0.1 or LAN IP.
  static String get defaultBaseUrl {
    const fromEnv = String.fromEnvironment('API_BASE_URL');
    if (fromEnv.isNotEmpty) {
      return fromEnv;
    }
    if (kIsWeb) {
      return 'http://127.0.0.1:5000';
    }
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:5000';
    }
    return 'http://127.0.0.1:5000';
  }

  // Network time-out duration
  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 15);

  // Authentication endpoints
  static const String login = '/api/auth/login';
  static const String me = '/api/auth/me';

  // Student endpoints (ready for subsequent phases)
  static const String profile = '/api/student/profile';
  static const String workspace = '/api/student/workspace';
  static const String logbooks = '/api/student/logbooks';
  static const String attendance = '/api/student/attendance';
  static const String qrToken = '/api/student/attendance/qr-token';
  static const String notifications = '/api/notifications';
}
