import 'package:intl/intl.dart';

/// Evaluator associated with an assessment
class AssessmentEvaluator {
  final String id;
  final String name;
  final String email;
  final String role;

  const AssessmentEvaluator({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
  });

  factory AssessmentEvaluator.fromJson(Map<String, dynamic> json) {
    return AssessmentEvaluator(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      email: json['email'] as String? ?? '',
      role: json['role'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'role': role,
      };
}

/// Official academic or industry assessment record
class AssessmentRecord {
  final String id;
  final String studentId;
  final String evaluatorId;
  final String schoolId;
  final String type; // 'mid-term' | 'end-of-attachment'
  final String evaluatorType; // 'industry' | 'university'
  final int? score; // 0 - 100
  final Map<String, dynamic>? criteria;
  final String? feedback;
  final String status; // 'draft' | 'submitted' | 'finalized'
  final DateTime createdAt;
  final DateTime updatedAt;
  final AssessmentEvaluator? evaluator;

  const AssessmentRecord({
    required this.id,
    required this.studentId,
    required this.evaluatorId,
    required this.schoolId,
    required this.type,
    required this.evaluatorType,
    this.score,
    this.criteria,
    this.feedback,
    this.status = 'submitted',
    required this.createdAt,
    required this.updatedAt,
    this.evaluator,
  });

  factory AssessmentRecord.fromJson(Map<String, dynamic> json) {
    DateTime parseDate(dynamic value) {
      if (value == null) return DateTime.now();
      if (value is DateTime) return value;
      return DateTime.tryParse(value.toString()) ?? DateTime.now();
    }

    int? parseScore(dynamic val) {
      if (val == null) return null;
      if (val is int) return val;
      if (val is double) return val.toInt();
      return int.tryParse(val.toString());
    }

    Map<String, dynamic>? parseCriteria(dynamic val) {
      if (val == null) return null;
      if (val is Map<String, dynamic>) return val;
      if (val is Map) {
        return val.map((k, v) => MapEntry(k.toString(), v));
      }
      return null;
    }

    return AssessmentRecord(
      id: json['id'] as String? ?? '',
      studentId: json['studentId'] as String? ?? '',
      evaluatorId: json['evaluatorId'] as String? ?? '',
      schoolId: json['schoolId'] as String? ?? '',
      type: json['type'] as String? ?? 'mid-term',
      evaluatorType: json['evaluatorType'] as String? ?? 'industry',
      score: parseScore(json['score']),
      criteria: parseCriteria(json['criteria']),
      feedback: json['feedback'] as String?,
      status: json['status'] as String? ?? 'submitted',
      createdAt: parseDate(json['createdAt']),
      updatedAt: parseDate(json['updatedAt']),
      evaluator: json['evaluator'] != null && json['evaluator'] is Map<String, dynamic>
          ? AssessmentEvaluator.fromJson(json['evaluator'] as Map<String, dynamic>)
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'studentId': studentId,
        'evaluatorId': evaluatorId,
        'schoolId': schoolId,
        'type': type,
        'evaluatorType': evaluatorType,
        'score': score,
        'criteria': criteria,
        'feedback': feedback,
        'status': status,
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
        'evaluator': evaluator?.toJson(),
      };

  // Helper getters
  bool get isIndustry => evaluatorType.toLowerCase() == 'industry';
  bool get isUniversity => evaluatorType.toLowerCase() == 'university';
  bool get isMidterm => type.toLowerCase().contains('mid');
  bool get isFinal => type.toLowerCase().contains('end') || type.toLowerCase().contains('final');
  bool get isGraded => score != null;

  String get displayType {
    if (isMidterm) return 'Mid-Term Assessment';
    if (isFinal) return 'Final Evaluation';
    return 'Competency Assessment';
  }

  String get displayEvaluatorType {
    if (isIndustry) return 'Industry Supervisor';
    if (isUniversity) return 'Faculty Academic Advisor';
    return 'Evaluator';
  }

  String get formattedDate {
    return DateFormat('dd MMM yyyy').format(createdAt);
  }

  String get formattedDateTime {
    return DateFormat('dd MMM yyyy • hh:mm a').format(createdAt);
  }

  String get gradeClassification {
    if (score == null) return 'Pending Grade';
    final s = score!;
    if (s >= 80) return 'Distinction (A)';
    if (s >= 70) return 'Credit (B)';
    if (s >= 60) return 'Pass (C)';
    if (s >= 50) return 'Satisfactory (D)';
    return 'Needs Improvement (E)';
  }

  String get gradeLetter {
    if (score == null) return '--';
    final s = score!;
    if (s >= 80) return 'A';
    if (s >= 70) return 'B';
    if (s >= 60) return 'C';
    if (s >= 50) return 'D';
    return 'E';
  }
}
