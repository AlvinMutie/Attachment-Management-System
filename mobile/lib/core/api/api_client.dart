import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../constants/api_constants.dart';
import '../errors/app_exceptions.dart';
import '../storage/secure_storage_service.dart';

/// Centralized, production-grade HTTP API Client
class ApiClient {
  final String baseUrl;
  final http.Client _httpClient;
  final SecureStorageService _storageService;
  final void Function()? onUnauthorized;

  ApiClient({
    String? baseUrl,
    http.Client? httpClient,
    SecureStorageService? storageService,
    this.onUnauthorized,
  })  : baseUrl = (baseUrl ?? ApiConstants.defaultBaseUrl).replaceAll(RegExp(r'/+$'), ''),
        _httpClient = httpClient ?? http.Client(),
        _storageService = storageService ?? SecureStorageService();

  /// Builds standard request headers with optional JWT Authorization Bearer
  Future<Map<String, String>> _buildHeaders({
    Map<String, String>? extraHeaders,
    bool requiresAuth = true,
  }) async {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (requiresAuth) {
      final token = await _storageService.getToken();
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    if (extraHeaders != null) {
      headers.addAll(extraHeaders);
    }

    return headers;
  }

  /// Sends a GET request
  Future<dynamic> get(
    String endpoint, {
    Map<String, String>? headers,
    Map<String, dynamic>? queryParameters,
    bool requiresAuth = true,
  }) async {
    final uri = _buildUri(endpoint, queryParameters);
    final requestHeaders = await _buildHeaders(extraHeaders: headers, requiresAuth: requiresAuth);

    return _executeRequest(
      () => _httpClient.get(uri, headers: requestHeaders),
    );
  }

  /// Sends a POST request
  Future<dynamic> post(
    String endpoint, {
    dynamic body,
    Map<String, String>? headers,
    Map<String, dynamic>? queryParameters,
    bool requiresAuth = true,
  }) async {
    final uri = _buildUri(endpoint, queryParameters);
    final requestHeaders = await _buildHeaders(extraHeaders: headers, requiresAuth: requiresAuth);
    final encodedBody = body != null ? jsonEncode(body) : null;

    return _executeRequest(
      () => _httpClient.post(uri, headers: requestHeaders, body: encodedBody),
    );
  }

  /// Sends a PUT request
  Future<dynamic> put(
    String endpoint, {
    dynamic body,
    Map<String, String>? headers,
    Map<String, dynamic>? queryParameters,
    bool requiresAuth = true,
  }) async {
    final uri = _buildUri(endpoint, queryParameters);
    final requestHeaders = await _buildHeaders(extraHeaders: headers, requiresAuth: requiresAuth);
    final encodedBody = body != null ? jsonEncode(body) : null;

    return _executeRequest(
      () => _httpClient.put(uri, headers: requestHeaders, body: encodedBody),
    );
  }

  /// Sends a DELETE request
  Future<dynamic> delete(
    String endpoint, {
    Map<String, String>? headers,
    Map<String, dynamic>? queryParameters,
    bool requiresAuth = true,
  }) async {
    final uri = _buildUri(endpoint, queryParameters);
    final requestHeaders = await _buildHeaders(extraHeaders: headers, requiresAuth: requiresAuth);

    return _executeRequest(
      () => _httpClient.delete(uri, headers: requestHeaders),
    );
  }

  /// Helper to construct valid Uri
  Uri _buildUri(String endpoint, Map<String, dynamic>? queryParameters) {
    final cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/$endpoint';
    final fullUrl = '$baseUrl$cleanEndpoint';
    final baseUri = Uri.parse(fullUrl);

    if (queryParameters != null && queryParameters.isNotEmpty) {
      final stringParams = queryParameters.map((k, v) => MapEntry(k, v.toString()));
      return baseUri.replace(queryParameters: stringParams);
    }

    return baseUri;
  }

  /// Wraps HTTP calls with timeout and unified error handling
  Future<dynamic> _executeRequest(Future<http.Response> Function() call) async {
    try {
      final response = await call().timeout(ApiConstants.connectTimeout);
      return _handleResponse(response);
    } on SocketException {
      throw const NetworkException('Unable to reach the server. Please check your internet connection.');
    } on TimeoutException {
      throw const NetworkException('Connection timed out. The server took too long to respond.');
    } on http.ClientException catch (e) {
      throw NetworkException('Network error: ${e.message}');
    } on AppException {
      rethrow;
    } catch (e) {
      throw ApiException('An unexpected network error occurred: $e');
    }
  }

  /// Parses JSON response and validates HTTP status code
  dynamic _handleResponse(http.Response response) {
    dynamic responseData;
    try {
      if (response.body.isNotEmpty) {
        responseData = jsonDecode(response.body);
      }
    } catch (_) {
      // Non-JSON response body
    }

    final message = _extractErrorMessage(responseData) ??
        'Request failed with status code ${response.statusCode}';

    switch (response.statusCode) {
      case 200:
      case 201:
      case 204:
        return responseData ?? true;

      case 400:
        throw ValidationException(message);

      case 401:
        onUnauthorized?.call();
        throw UnauthorizedException(message);

      case 403:
        throw ForbiddenException(message);

      case 404:
        throw ApiException(message, 404);

      case 500:
      case 502:
      case 503:
        throw ServerException(message);

      default:
        throw ApiException(message, response.statusCode);
    }
  }

  String? _extractErrorMessage(dynamic data) {
    if (data is Map<String, dynamic>) {
      if (data['message'] is String) return data['message'] as String;
      if (data['error'] is String) return data['error'] as String;
      if (data['errors'] is List && (data['errors'] as List).isNotEmpty) {
        return (data['errors'] as List).first.toString();
      }
    }
    return null;
  }
}
