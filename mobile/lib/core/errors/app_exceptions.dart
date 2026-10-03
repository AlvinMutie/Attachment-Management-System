/// Base exception class for the AttachPro application
abstract class AppException implements Exception {
  final String message;
  final int? statusCode;

  const AppException(this.message, [this.statusCode]);

  @override
  String toString() => message;
}

/// Thrown when an API request fails with a standard error response
class ApiException extends AppException {
  const ApiException(super.message, [super.statusCode]);
}

/// Thrown when network connectivity fails or request times out
class NetworkException extends AppException {
  const NetworkException([super.message = 'Unable to connect to the server. Please check your internet connection.']);
}

/// Thrown when authentication fails or session has expired (401)
class UnauthorizedException extends AppException {
  const UnauthorizedException([String message = 'Invalid email/admission number or password.'])
      : super(message, 401);
}

/// Thrown when user lacks permission or has an unsupported role (403)
class ForbiddenException extends AppException {
  const ForbiddenException([String message = 'Access denied. You do not have permission to access this resource.'])
      : super(message, 403);
}

/// Thrown when validation fails (400)
class ValidationException extends AppException {
  const ValidationException([String message = 'Invalid request. Please verify your inputs.'])
      : super(message, 400);
}

/// Thrown when server encounters an internal error (500)
class ServerException extends AppException {
  const ServerException([String message = 'A server error occurred. Please try again later.'])
      : super(message, 500);
}
