/// Unified workspace data model matching /api/student/workspace response
class WorkspaceModel {
  final StudentProfile student;
  final DateMetrics dates;
  final AttendanceStats attendance;
  final LogbooksSummary logbooksSummary;
  final AssessmentsSummary assessmentsSummary;
  final List<ActionItem> actionQueue;
  final List<DeadlineItem> deadlines;
  final ReadinessResult readiness;

  const WorkspaceModel({
    required this.student,
    required this.dates,
    required this.attendance,
    required this.logbooksSummary,
    required this.assessmentsSummary,
    required this.actionQueue,
    required this.deadlines,
    required this.readiness,
  });

  factory WorkspaceModel.fromJson(Map<String, dynamic> json) {
    final data = json['data'] is Map<String, dynamic>
        ? json['data'] as Map<String, dynamic>
        : json;

    return WorkspaceModel(
      student: StudentProfile.fromJson(
          (data['student'] as Map<String, dynamic>?) ?? {}),
      dates: DateMetrics.fromJson(
          (data['dates'] as Map<String, dynamic>?) ?? {}),
      attendance: AttendanceStats.fromJson(
          (data['attendance'] as Map<String, dynamic>?) ?? {}),
      logbooksSummary: LogbooksSummary.fromJson(
          (data['logbooksSummary'] as Map<String, dynamic>?) ?? {}),
      assessmentsSummary: AssessmentsSummary.fromJson(
          (data['assessmentsSummary'] as Map<String, dynamic>?) ?? {}),
      actionQueue: ((data['actionQueue'] as List?) ?? [])
          .map((e) => ActionItem.fromJson(e as Map<String, dynamic>))
          .toList(),
      deadlines: ((data['deadlines'] as List?) ?? [])
          .map((e) => DeadlineItem.fromJson(e as Map<String, dynamic>))
          .toList(),
      readiness: ReadinessResult.fromJson(
          (data['readiness'] as Map<String, dynamic>?) ?? {}),
    );
  }
}

class StudentProfile {
  final String id;
  final String admissionNumber;
  final String? course;
  final String? department;
  final String? placementStatus;
  final String? rejectionReason;
  final String? organizationName;
  final String? organizationAddress;
  final String? contactPerson;
  final String? startDate;
  final String? endDate;
  final UserRef? user;
  final UserRef? industrySupervisor;
  final UserRef? universitySupervisor;

  const StudentProfile({
    required this.id,
    required this.admissionNumber,
    this.course,
    this.department,
    this.placementStatus,
    this.rejectionReason,
    this.organizationName,
    this.organizationAddress,
    this.contactPerson,
    this.startDate,
    this.endDate,
    this.user,
    this.industrySupervisor,
    this.universitySupervisor,
  });

  bool get hasOrganization =>
      organizationName != null && organizationName!.trim().isNotEmpty;

  bool get hasIndustrySupervisor => industrySupervisor != null;
  bool get hasUniversitySupervisor => universitySupervisor != null;

  bool get isActive =>
      placementStatus == 'ACTIVE' || placementStatus == 'APPROVED';

  factory StudentProfile.fromJson(Map<String, dynamic> json) {
    return StudentProfile(
      id: json['id']?.toString() ?? '',
      admissionNumber: json['admissionNumber']?.toString() ?? '',
      course: json['course']?.toString(),
      department: json['department']?.toString(),
      placementStatus: json['placementStatus']?.toString(),
      rejectionReason: json['rejectionReason']?.toString(),
      organizationName: json['organizationName']?.toString(),
      organizationAddress: json['organizationAddress']?.toString(),
      contactPerson: json['contactPerson']?.toString(),
      startDate: json['startDate']?.toString(),
      endDate: json['endDate']?.toString(),
      user: json['user'] is Map<String, dynamic>
          ? UserRef.fromJson(json['user'] as Map<String, dynamic>)
          : null,
      industrySupervisor: json['industrySupervisor'] is Map<String, dynamic>
          ? UserRef.fromJson(json['industrySupervisor'] as Map<String, dynamic>)
          : null,
      universitySupervisor:
          json['universitySupervisor'] is Map<String, dynamic>
              ? UserRef.fromJson(
                  json['universitySupervisor'] as Map<String, dynamic>)
              : null,
    );
  }
}

class UserRef {
  final String id;
  final String name;
  final String? email;

  const UserRef({required this.id, required this.name, this.email});

  String get initials {
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.length >= 2) {
      return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }

  factory UserRef.fromJson(Map<String, dynamic> json) {
    return UserRef(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      email: json['email']?.toString(),
    );
  }
}

class DateMetrics {
  final String? startDate;
  final String? endDate;
  final int totalDays;
  final int daysCompleted;
  final int daysRemaining;
  final int percentElapsed;

  const DateMetrics({
    this.startDate,
    this.endDate,
    required this.totalDays,
    required this.daysCompleted,
    required this.daysRemaining,
    required this.percentElapsed,
  });

  bool get hasDateRange => startDate != null && endDate != null;

  int get currentWeek =>
      totalDays > 0 ? ((daysCompleted / 5).floor() + 1).clamp(1, (totalDays / 5).ceil()) : 0;

  int get totalWeeks => totalDays > 0 ? (totalDays / 5).ceil() : 0;

  factory DateMetrics.fromJson(Map<String, dynamic> json) {
    return DateMetrics(
      startDate: json['startDate']?.toString(),
      endDate: json['endDate']?.toString(),
      totalDays: (json['totalDays'] as num?)?.toInt() ?? 0,
      daysCompleted: (json['daysCompleted'] as num?)?.toInt() ?? 0,
      daysRemaining: (json['daysRemaining'] as num?)?.toInt() ?? 0,
      percentElapsed: (json['percentElapsed'] as num?)?.toInt() ?? 0,
    );
  }
}

class AttendanceStats {
  final int totalRecords;
  final int presentCount;
  final int lateCount;
  final int absentCount;
  final int excusedCount;
  final int rate;
  final String status; // COMPLIANT | AT_RISK | CRITICAL | NO_RECORDS

  const AttendanceStats({
    required this.totalRecords,
    required this.presentCount,
    required this.lateCount,
    required this.absentCount,
    required this.excusedCount,
    required this.rate,
    required this.status,
  });

  bool get isCompliant => status == 'COMPLIANT';
  bool get isAtRisk => status == 'AT_RISK';
  bool get isCritical => status == 'CRITICAL';
  bool get hasNoRecords => status == 'NO_RECORDS' || totalRecords == 0;

  factory AttendanceStats.fromJson(Map<String, dynamic> json) {
    return AttendanceStats(
      totalRecords: (json['totalRecords'] as num?)?.toInt() ?? 0,
      presentCount: (json['presentCount'] as num?)?.toInt() ?? 0,
      lateCount: (json['lateCount'] as num?)?.toInt() ?? 0,
      absentCount: (json['absentCount'] as num?)?.toInt() ?? 0,
      excusedCount: (json['excusedCount'] as num?)?.toInt() ?? 0,
      rate: (json['rate'] as num?)?.toInt() ?? 0,
      status: json['status']?.toString() ?? 'NO_RECORDS',
    );
  }
}

class LogbooksSummary {
  final int total;
  final int approved;
  final int pending;
  final int rejected;

  const LogbooksSummary({
    required this.total,
    required this.approved,
    required this.pending,
    required this.rejected,
  });

  factory LogbooksSummary.fromJson(Map<String, dynamic> json) {
    return LogbooksSummary(
      total: (json['total'] as num?)?.toInt() ?? 0,
      approved: (json['approved'] as num?)?.toInt() ?? 0,
      pending: (json['pending'] as num?)?.toInt() ?? 0,
      rejected: (json['rejected'] as num?)?.toInt() ?? 0,
    );
  }
}

class AssessmentsSummary {
  final int total;
  final bool industrySubmitted;
  final bool universitySubmitted;

  const AssessmentsSummary({
    required this.total,
    required this.industrySubmitted,
    required this.universitySubmitted,
  });

  factory AssessmentsSummary.fromJson(Map<String, dynamic> json) {
    return AssessmentsSummary(
      total: (json['total'] as num?)?.toInt() ?? 0,
      industrySubmitted: json['industrySubmitted'] == true,
      universitySubmitted: json['universitySubmitted'] == true,
    );
  }
}

class ActionItem {
  final String id;
  final String priority; // HIGH | MEDIUM | CRITICAL
  final String title;
  final String description;
  final String? link;
  final String? actionText;

  const ActionItem({
    required this.id,
    required this.priority,
    required this.title,
    required this.description,
    this.link,
    this.actionText,
  });

  bool get isCritical => priority == 'CRITICAL';
  bool get isHigh => priority == 'HIGH';

  factory ActionItem.fromJson(Map<String, dynamic> json) {
    return ActionItem(
      id: json['id']?.toString() ?? '',
      priority: json['priority']?.toString() ?? 'MEDIUM',
      title: json['title']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      link: json['link']?.toString(),
      actionText: json['actionText']?.toString(),
    );
  }
}

class DeadlineItem {
  final String id;
  final String title;
  final String? dueDate;
  final String? status;

  const DeadlineItem({
    required this.id,
    required this.title,
    this.dueDate,
    this.status,
  });

  factory DeadlineItem.fromJson(Map<String, dynamic> json) {
    return DeadlineItem(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      dueDate: json['dueDate']?.toString(),
      status: json['status']?.toString(),
    );
  }
}

class ReadinessResult {
  final bool ready;
  final int score;
  final List<String> blockers;

  const ReadinessResult({
    required this.ready,
    required this.score,
    required this.blockers,
  });

  factory ReadinessResult.fromJson(Map<String, dynamic> json) {
    return ReadinessResult(
      ready: json['ready'] == true,
      score: (json['score'] as num?)?.toInt() ?? 0,
      blockers: ((json['blockers'] as List?) ?? [])
          .map((e) => e.toString())
          .toList(),
    );
  }
}
