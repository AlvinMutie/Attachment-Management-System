import '../core/api/api_client.dart';
import '../core/constants/api_constants.dart';
import '../models/attendance_model.dart';

/// Service for student attendance data and dynamic QR tokens
class AttendanceService {
  final ApiClient _client;

  AttendanceService({ApiClient? client}) : _client = client ?? ApiClient();

  /// Fetch student attendance history records
  Future<List<AttendanceRecord>> getAttendanceHistory() async {
    final response = await _client.get(
      ApiConstants.attendance,
      requiresAuth: true,
    );
    if (response is Map<String, dynamic> && response['data'] is List) {
      final data = response['data'] as List;
      return data
          .map((item) =>
              AttendanceRecord.fromJson(item as Map<String, dynamic>))
          .toList();
    }
    return [];
  }

  /// Request short-lived server-signed dynamic QR token
  Future<AttendanceQrTokenData> getQrToken() async {
    final response = await _client.get(
      ApiConstants.qrToken,
      requiresAuth: true,
    );
    final data = (response is Map<String, dynamic>
        ? response['data'] as Map<String, dynamic>?
        : null) ?? {};
    return AttendanceQrTokenData.fromJson(data);
  }
}
