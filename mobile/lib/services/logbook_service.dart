import '../core/api/api_client.dart';
import '../core/constants/api_constants.dart';
import '../core/errors/app_exceptions.dart';
import '../models/logbook_model.dart';

/// Service responsible for Student Logbook API interactions
class LogbookService {
  final ApiClient _apiClient;

  LogbookService({ApiClient? apiClient}) : _apiClient = apiClient ?? ApiClient();

  /// Fetches all weekly logbooks for the current authenticated student
  Future<List<LogbookModel>> getLogbooks() async {
    final response = await _apiClient.get(
      ApiConstants.logbooks,
      requiresAuth: true,
    );

    if (response is Map<String, dynamic> && response['data'] is List) {
      final list = response['data'] as List;
      return list
          .whereType<Map<String, dynamic>>()
          .map((item) => LogbookModel.fromJson(item))
          .toList();
    }

    if (response is List) {
      return response
          .whereType<Map<String, dynamic>>()
          .map((item) => LogbookModel.fromJson(item))
          .toList();
    }

    return [];
  }

  /// Creates and submits a new weekly logbook
  Future<LogbookModel> submitLogbook({
    required int weekNumber,
    required String startDate,
    required String endDate,
    required String summary,
    required Map<String, dynamic> dailyEntries,
  }) async {
    final payload = {
      'weekNumber': weekNumber,
      'startDate': startDate,
      'endDate': endDate,
      'summary': summary,
      'dailyEntries': dailyEntries,
    };

    final response = await _apiClient.post(
      ApiConstants.logbooks,
      body: payload,
      requiresAuth: true,
    );

    if (response is Map<String, dynamic> && response['data'] is Map<String, dynamic>) {
      return LogbookModel.fromJson(response['data'] as Map<String, dynamic>);
    }

    if (response is Map<String, dynamic>) {
      return LogbookModel.fromJson(response);
    }

    throw const ApiException('Invalid response format received from logbook creation');
  }

  /// Updates/revises an existing logbook (e.g. after supervisor rejection)
  /// Resets status to 'pending' on the backend for supervisor re-review
  Future<LogbookModel> updateLogbook(
    String id, {
    required String summary,
    required Map<String, dynamic> dailyEntries,
  }) async {
    final payload = {
      'summary': summary,
      'dailyEntries': dailyEntries,
    };

    final response = await _apiClient.put(
      '${ApiConstants.logbooks}/$id',
      body: payload,
      requiresAuth: true,
    );

    if (response is Map<String, dynamic> && response['data'] is Map<String, dynamic>) {
      return LogbookModel.fromJson(response['data'] as Map<String, dynamic>);
    }

    if (response is Map<String, dynamic>) {
      return LogbookModel.fromJson(response);
    }

    throw const ApiException('Invalid response format received from logbook update');
  }
}
