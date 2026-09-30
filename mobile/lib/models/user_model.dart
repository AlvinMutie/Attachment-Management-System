/// Student user identity model
class UserModel {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? schoolId;
  final String? status;
  final String? admissionNumber;
  final String? department;
  final String? institution;
  final String? schoolName;
  final String? schoolLogo;
  final String? schoolPrimaryColor;

  const UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.schoolId,
    this.status,
    this.admissionNumber,
    this.department,
    this.institution,
    this.schoolName,
    this.schoolLogo,
    this.schoolPrimaryColor,
  });

  /// True if the authenticated user has the 'student' role
  bool get isStudent => role.trim().toLowerCase() == 'student';

  /// Parses user data from either /api/auth/login or /api/auth/me response
  factory UserModel.fromJson(Map<String, dynamic> json) {
    // Unnest if nested inside data property
    final Map<String, dynamic> data =
        (json['data'] is Map<String, dynamic>) ? json['data'] as Map<String, dynamic> : json;

    final profile = data['profile'] is Map<String, dynamic>
        ? data['profile'] as Map<String, dynamic>
        : null;

    final school = data['school'] is Map<String, dynamic>
        ? data['school'] as Map<String, dynamic>
        : null;

    return UserModel(
      id: (data['id'] ?? '').toString(),
      name: (data['name'] ?? '').toString(),
      email: (data['email'] ?? '').toString(),
      role: (data['role'] ?? '').toString(),
      schoolId: data['schoolId']?.toString(),
      status: data['status']?.toString(),
      admissionNumber: profile?['admissionNumber']?.toString() ??
          data['admissionNumber']?.toString(),
      department: profile?['department']?.toString() ??
          data['department']?.toString(),
      institution: profile?['institution']?.toString() ??
          school?['name']?.toString() ??
          data['schoolName']?.toString(),
      schoolName: school?['name']?.toString() ?? data['schoolName']?.toString(),
      schoolLogo: school?['logo']?.toString() ?? data['schoolLogo']?.toString(),
      schoolPrimaryColor: school?['primaryColor']?.toString() ??
          data['schoolPrimaryColor']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      'schoolId': schoolId,
      'status': status,
      'admissionNumber': admissionNumber,
      'department': department,
      'institution': institution,
      'schoolName': schoolName,
      'schoolLogo': schoolLogo,
      'schoolPrimaryColor': schoolPrimaryColor,
    };
  }

  UserModel copyWith({
    String? id,
    String? name,
    String? email,
    String? role,
    String? schoolId,
    String? status,
    String? admissionNumber,
    String? department,
    String? institution,
    String? schoolName,
    String? schoolLogo,
    String? schoolPrimaryColor,
  }) {
    return UserModel(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      role: role ?? this.role,
      schoolId: schoolId ?? this.schoolId,
      status: status ?? this.status,
      admissionNumber: admissionNumber ?? this.admissionNumber,
      department: department ?? this.department,
      institution: institution ?? this.institution,
      schoolName: schoolName ?? this.schoolName,
      schoolLogo: schoolLogo ?? this.schoolLogo,
      schoolPrimaryColor: schoolPrimaryColor ?? this.schoolPrimaryColor,
    );
  }
}
