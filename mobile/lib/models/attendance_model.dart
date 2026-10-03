import 'package:intl/intl.dart';

/// Single Attendance record matching backend model `Attendance.js`
class AttendanceRecord {
  final String id;
  final String studentId;
  final String schoolId;
  final String date; // YYYY-MM-DD
  final DateTime timestamp;
  final String status; // 'present', 'absent', 'late', 'excused'
  final String? scannedBy;
  final String verificationMethod; // 'qr_scanner', 'manual', etc.
  final String? notes;

  const AttendanceRecord({
    required this.id,
    required this.studentId,
    required this.schoolId,
    required this.date,
    required this.timestamp,
    required this.status,
    this.scannedBy,
    this.verificationMethod = 'qr_scanner',
    this.notes,
  });

  factory AttendanceRecord.fromJson(Map<String, dynamic> json) {
    DateTime parsedTime;
    try {
      parsedTime = json['timestamp'] != null
          ? DateTime.parse(json['timestamp'].toString())
          : (json['createdAt'] != null
              ? DateTime.parse(json['createdAt'].toString())
              : DateTime.now());
    } catch (_) {
      parsedTime = DateTime.now();
    }

    return AttendanceRecord(
      id: json['id']?.toString() ?? '',
      studentId: json['studentId']?.toString() ?? '',
      schoolId: json['schoolId']?.toString() ?? '',
      date: json['date']?.toString() ??
          DateFormat('yyyy-MM-dd').format(parsedTime),
      timestamp: parsedTime,
      status: (json['status']?.toString() ?? 'present').toLowerCase(),
      scannedBy: json['scannedBy']?.toString(),
      verificationMethod:
          json['verificationMethod']?.toString() ?? 'qr_scanner',
      notes: json['notes']?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'studentId': studentId,
        'schoolId': schoolId,
        'date': date,
        'timestamp': timestamp.toIso8601String(),
        'status': status,
        'scannedBy': scannedBy,
        'verificationMethod': verificationMethod,
        'notes': notes,
      };

  bool get isPresent => status == 'present';
  bool get isLate => status == 'late';
  bool get isExcused => status == 'excused';
  bool get isAbsent => status == 'absent';
  bool get isVerified => isPresent || isLate;

  String get formattedDate {
    try {
      final dt = DateTime.parse(date);
      return DateFormat('EEE, dd MMM yyyy').format(dt);
    } catch (_) {
      return DateFormat('EEE, dd MMM yyyy').format(timestamp);
    }
  }

  String get formattedShortDate {
    try {
      final dt = DateTime.parse(date);
      return DateFormat('EEE, dd MMM').format(dt);
    } catch (_) {
      return DateFormat('EEE, dd MMM').format(timestamp);
    }
  }

  String get formattedCheckInTime {
    return DateFormat('hh:mm a').format(timestamp);
  }
}

/// Server-signed QR token response payload from `GET /api/student/attendance/qr-token`
class AttendanceQrTokenData {
  final String token;
  final String securityHash;
  final int expiresInSeconds;
  final DateTime expiresAt;
  final String date;
  final bool alreadyVerified;
  final AttendanceRecord? existingAttendance;
  final QrStudentInfo? student;

  const AttendanceQrTokenData({
    required this.token,
    required this.securityHash,
    required this.expiresInSeconds,
    required this.expiresAt,
    required this.date,
    required this.alreadyVerified,
    this.existingAttendance,
    this.student,
  });

  factory AttendanceQrTokenData.fromJson(Map<String, dynamic> json) {
    DateTime parsedExpiresAt;
    try {
      parsedExpiresAt = json['expiresAt'] != null
          ? DateTime.parse(json['expiresAt'].toString())
          : DateTime.now().add(Duration(
              seconds: (json['expiresInSeconds'] as num?)?.toInt() ?? 300));
    } catch (_) {
      parsedExpiresAt = DateTime.now().add(const Duration(minutes: 5));
    }

    return AttendanceQrTokenData(
      token: json['token']?.toString() ?? '',
      securityHash: json['securityHash']?.toString() ?? 'AP-8842-SEC-2026',
      expiresInSeconds: (json['expiresInSeconds'] as num?)?.toInt() ?? 300,
      expiresAt: parsedExpiresAt,
      date: json['date']?.toString() ??
          DateFormat('yyyy-MM-dd').format(DateTime.now()),
      alreadyVerified: json['alreadyVerified'] == true,
      existingAttendance: json['existingAttendance'] != null
          ? AttendanceRecord.fromJson(
              json['existingAttendance'] as Map<String, dynamic>)
          : null,
      student: json['student'] != null
          ? QrStudentInfo.fromJson(
              json['student'] as Map<String, dynamic>)
          : null,
    );
  }

  bool get isExpired => DateTime.now().isAfter(expiresAt);

  int get remainingSeconds {
    final diff = expiresAt.difference(DateTime.now()).inSeconds;
    return diff > 0 ? diff : 0;
  }
}

class QrStudentInfo {
  final dynamic id;
  final String? name;
  final String? admissionNumber;
  final String? organizationName;
  final bool hasSupervisorAssigned;
  final String? supervisorName;

  const QrStudentInfo({
    this.id,
    this.name,
    this.admissionNumber,
    this.organizationName,
    this.hasSupervisorAssigned = false,
    this.supervisorName,
  });

  factory QrStudentInfo.fromJson(Map<String, dynamic> json) {
    return QrStudentInfo(
      id: json['id'],
      name: json['name']?.toString(),
      admissionNumber: json['admissionNumber']?.toString(),
      organizationName: json['organizationName']?.toString(),
      hasSupervisorAssigned: json['hasSupervisorAssigned'] == true,
      supervisorName: json['supervisorName']?.toString(),
    );
  }
}
