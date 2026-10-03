import '../core/api/api_client.dart';
import '../core/constants/api_constants.dart';
import '../models/assessment_model.dart';

/// Service for student academic reports and formal assessments
class ReportService {
  final ApiClient _client;

  ReportService({ApiClient? client}) : _client = client ?? ApiClient();

  /// Fetch all assessments and evaluations submitted for the student
  Future<List<AssessmentRecord>> getAssessments() async {
    final response = await _client.get(
      ApiConstants.assessments,
      requiresAuth: true,
    );

    if (response is Map<String, dynamic> && response['data'] is List) {
      final list = response['data'] as List;
      return list
          .map((item) => AssessmentRecord.fromJson(item as Map<String, dynamic>))
          .toList();
    }
    return [];
  }
}
