class ApiConstants {
  // Change this to your server's network IP when testing on a physical device
  // e.g., 'http://192.168.1.100:5000/api'
  // For Android emulator, use 'http://10.0.2.2:5000/api'
  static const String baseUrl = 'http://10.0.2.2:5000/api';

  // Auth
  static const String login = '$baseUrl/auth/login';
  static const String me = '$baseUrl/auth/me';

  // Supervisor
  static const String presence = '$baseUrl/supervisor/presence';

  // Messages
  static const String contacts = '$baseUrl/messages/contacts';
  static const String messages = '$baseUrl/messages';
  static String messagesWithUser(int userId) => '$baseUrl/messages/$userId';
  static const String markRead = '$baseUrl/messages/read';
}
