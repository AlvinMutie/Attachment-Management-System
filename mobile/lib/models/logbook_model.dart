import 'package:intl/intl.dart';

/// Represents a weekly logbook submission returned by GET /api/student/logbooks
class LogbookModel {
  final String id;
  final String studentId;
  final String? schoolId;
  final int weekNumber;
  final String startDate;
  final String endDate;
  final String summary;
  final Map<String, dynamic> dailyEntries;
  final List<LogbookAttachment> attachments;
  final String status; // 'pending' | 'approved' | 'rejected' | 'draft'
  final String? supervisorComment;
  final String? universityComment;
  final bool aiRefined;
  final String? aiDraft;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const LogbookModel({
    required this.id,
    required this.studentId,
    this.schoolId,
    required this.weekNumber,
    required this.startDate,
    required this.endDate,
    required this.summary,
    required this.dailyEntries,
    this.attachments = const [],
    this.status = 'pending',
    this.supervisorComment,
    this.universityComment,
    this.aiRefined = false,
    this.aiDraft,
    this.createdAt,
    this.updatedAt,
  });

  bool get isApproved => status.toLowerCase() == 'approved';
  bool get isPending => status.toLowerCase() == 'pending';
  bool get isRejected => status.toLowerCase() == 'rejected';
  bool get isDraft => status.toLowerCase() == 'draft';

  /// Stitch visual status badge text
  String get displayStatus {
    if (isApproved) return 'Reviewed & Approved';
    if (isPending) return 'Under Review';
    if (isRejected) return 'Needs Revision';
    return 'Draft';
  }

  /// Whether supervisor feedback is present
  bool get hasSupervisorFeedback =>
      supervisorComment != null && supervisorComment!.trim().isNotEmpty;

  /// Whether university feedback is present
  bool get hasUniversityFeedback =>
      universityComment != null && universityComment!.trim().isNotEmpty;

  /// Days of the week in standard Monday-Friday sequence
  static const List<String> weekdays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
  ];

  /// Counts how many Monday-Friday entries have logged content
  int get loggedDaysCount {
    var count = 0;
    for (final day in weekdays) {
      final entry = getDailyEntry(day);
      if (entry != null && entry.hasContent) {
        count++;
      }
    }
    return count;
  }

  int get totalDaysCount => 5;

  double get progressFraction =>
      (loggedDaysCount / totalDaysCount).clamp(0.0, 1.0);

  int get progressPercent => (progressFraction * 100).round();

  /// Calculates total hours logged for the week (defaults to 8.0 hrs per logged day if not set)
  double get totalLoggedHours {
    var total = 0.0;
    for (final day in weekdays) {
      final entry = getDailyEntry(day);
      if (entry != null && entry.hasContent) {
        total += entry.hours;
      }
    }
    return total;
  }

  /// Target hours per work week
  static const double targetWeeklyHours = 40.0;

  double get hoursPercent =>
      ((totalLoggedHours / targetWeeklyHours) * 100).clamp(0, 100).toDouble();

  /// Retrieves structured daily entry for a specific weekday
  DailyLogEntry? getDailyEntry(String dayKey) {
    final raw = dailyEntries[dayKey.toLowerCase()];
    if (raw == null) return null;
    return DailyLogEntry.fromDynamic(raw);
  }

  /// Formatted date range: "11 Aug 2026 – 15 Aug 2026"
  String get formattedDateRange {
    try {
      final start = DateTime.parse(startDate);
      final end = DateTime.parse(endDate);
      final formatter = DateFormat('dd MMM yyyy');
      return '${formatter.format(start)} – ${formatter.format(end)}';
    } catch (_) {
      return '$startDate – $endDate';
    }
  }

  /// Returns date string for a specific weekday offset (0=Monday, 1=Tuesday, ...)
  DateTime? dateForWeekday(int dayIndex) {
    try {
      final start = DateTime.parse(startDate);
      return start.add(Duration(days: dayIndex));
    } catch (_) {
      return null;
    }
  }

  factory LogbookModel.fromJson(Map<String, dynamic> json) {
    var entriesMap = <String, dynamic>{};
    if (json['dailyEntries'] is Map) {
      entriesMap = Map<String, dynamic>.from(json['dailyEntries'] as Map);
    }

    var attachmentsList = <LogbookAttachment>[];
    if (json['attachments'] is List) {
      attachmentsList = (json['attachments'] as List)
          .whereType<Map<String, dynamic>>()
          .map((a) => LogbookAttachment.fromJson(a))
          .toList();
    }

    DateTime? parseDate(dynamic v) {
      if (v == null) return null;
      try {
        return DateTime.parse(v.toString());
      } catch (_) {
        return null;
      }
    }

    return LogbookModel(
      id: json['id']?.toString() ?? '',
      studentId: json['studentId']?.toString() ?? '',
      schoolId: json['schoolId']?.toString(),
      weekNumber: json['weekNumber'] is int
          ? json['weekNumber'] as int
          : int.tryParse(json['weekNumber']?.toString() ?? '1') ?? 1,
      startDate: json['startDate']?.toString() ?? '',
      endDate: json['endDate']?.toString() ?? '',
      summary: json['summary']?.toString() ?? '',
      dailyEntries: entriesMap,
      attachments: attachmentsList,
      status: json['status']?.toString() ?? 'pending',
      supervisorComment: json['supervisorComment']?.toString(),
      universityComment: json['universityComment']?.toString(),
      aiRefined: json['aiRefined'] == true,
      aiDraft: json['aiDraft']?.toString(),
      createdAt: parseDate(json['createdAt']),
      updatedAt: parseDate(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'studentId': studentId,
      if (schoolId != null) 'schoolId': schoolId,
      'weekNumber': weekNumber,
      'startDate': startDate,
      'endDate': endDate,
      'summary': summary,
      'dailyEntries': dailyEntries,
      'attachments': attachments.map((a) => a.toJson()).toList(),
      'status': status,
      if (supervisorComment != null) 'supervisorComment': supervisorComment,
      if (universityComment != null) 'universityComment': universityComment,
      'aiRefined': aiRefined,
      if (aiDraft != null) 'aiDraft': aiDraft,
      if (createdAt != null) 'createdAt': createdAt!.toIso8601String(),
      if (updatedAt != null) 'updatedAt': updatedAt!.toIso8601String(),
    };
  }

  LogbookModel copyWith({
    String? id,
    String? studentId,
    String? schoolId,
    int? weekNumber,
    String? startDate,
    String? endDate,
    String? summary,
    Map<String, dynamic>? dailyEntries,
    List<LogbookAttachment>? attachments,
    String? status,
    String? supervisorComment,
    String? universityComment,
    bool? aiRefined,
    String? aiDraft,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return LogbookModel(
      id: id ?? this.id,
      studentId: studentId ?? this.studentId,
      schoolId: schoolId ?? this.schoolId,
      weekNumber: weekNumber ?? this.weekNumber,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      summary: summary ?? this.summary,
      dailyEntries: dailyEntries ?? this.dailyEntries,
      attachments: attachments ?? this.attachments,
      status: status ?? this.status,
      supervisorComment: supervisorComment ?? this.supervisorComment,
      universityComment: universityComment ?? this.universityComment,
      aiRefined: aiRefined ?? this.aiRefined,
      aiDraft: aiDraft ?? this.aiDraft,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

/// Represents an individual weekday log entry inside `dailyEntries`
class DailyLogEntry {
  final String title;
  final String description;
  final double hours;
  final String category;
  final String? statusOverride;

  const DailyLogEntry({
    required this.title,
    this.description = '',
    this.hours = 8.0,
    this.category = 'Industrial Attachment',
    this.statusOverride,
  });

  bool get hasContent => title.trim().isNotEmpty || description.trim().isNotEmpty;

  factory DailyLogEntry.fromDynamic(dynamic raw) {
    if (raw == null) {
      return const DailyLogEntry(title: '');
    }
    if (raw is String) {
      final text = raw.trim();
      return DailyLogEntry(
        title: text,
        description: text,
        hours: text.isNotEmpty ? 8.0 : 0.0,
        category: _inferCategory(text),
      );
    }
    if (raw is Map) {
      final title = raw['title']?.toString() ??
          raw['task']?.toString() ??
          raw['activity']?.toString() ??
          raw['description']?.toString() ??
          '';
      final desc = raw['description']?.toString() ?? title;
      final hrs = (raw['hours'] is num)
          ? (raw['hours'] as num).toDouble()
          : double.tryParse(raw['hours']?.toString() ?? '8.0') ?? 8.0;
      final cat = raw['category']?.toString() ??
          raw['department']?.toString() ??
          _inferCategory(title);
      final status = raw['status']?.toString();

      return DailyLogEntry(
        title: title,
        description: desc,
        hours: hrs,
        category: cat,
        statusOverride: status,
      );
    }
    return DailyLogEntry(title: raw.toString());
  }

  dynamic toDynamic() {
    return {
      'title': title,
      'description': description,
      'hours': hours,
      'category': category,
      if (statusOverride != null) 'status': statusOverride,
    };
  }

  static String _inferCategory(String text) {
    final lower = text.toLowerCase();
    if (lower.contains('api') || lower.contains('endpoint') || lower.contains('backend')) {
      return 'API Development';
    }
    if (lower.contains('database') || lower.contains('sql') || lower.contains('schema')) {
      return 'Backend Engineering';
    }
    if (lower.contains('test') || lower.contains('security') || lower.contains('auth')) {
      return 'QA & Security';
    }
    if (lower.contains('ui') || lower.contains('flutter') || lower.contains('state')) {
      return 'Frontend Engineering';
    }
    if (lower.contains('safety') || lower.contains('induction') || lower.contains('hardware')) {
      return 'Engineering Operations';
    }
    return 'Industrial Practice';
  }
}

/// Represents an attachment metadata item
class LogbookAttachment {
  final String url;
  final String name;
  final String? type;

  const LogbookAttachment({
    required this.url,
    required this.name,
    this.type,
  });

  factory LogbookAttachment.fromJson(Map<String, dynamic> json) {
    return LogbookAttachment(
      url: json['url']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Attachment',
      type: json['type']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'url': url,
      'name': name,
      if (type != null) 'type': type,
    };
  }
}
