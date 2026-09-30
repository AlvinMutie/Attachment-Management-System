import '../core/api/api_client.dart';
import '../core/constants/api_constants.dart';
import '../models/workspace_model.dart';

/// Service responsible for fetching and caching student workspace data
class WorkspaceService {
  final ApiClient _apiClient;

  WorkspaceService({ApiClient? apiClient})
      : _apiClient = apiClient ?? ApiClient();

  /// Fetches the unified student workspace from the backend.
  /// Throws AppException subclasses on failure.
  Future<WorkspaceModel> getWorkspace() async {
    final response = await _apiClient.get(
      ApiConstants.workspace,
      requiresAuth: true,
    );

    if (response is! Map<String, dynamic>) {
      throw Exception('Unexpected workspace response format.');
    }

    return WorkspaceModel.fromJson(response);
  }
}
