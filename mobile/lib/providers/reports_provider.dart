import 'package:flutter/foundation.dart';
import '../core/errors/app_exceptions.dart';
import '../models/assessment_model.dart';
import '../services/report_service.dart';

/// Provider for managing student assessment reports, evaluations, and clearance state
class ReportsProvider extends ChangeNotifier {
  final ReportService _service;

  List<AssessmentRecord> _assessments = [];
  bool _isLoading = false;
  String? _errorMessage;
  String _selectedTab = 'all'; // 'all', 'rubric', 'documents'

  ReportsProvider({ReportService? service})
      : _service = service ?? ReportService();

  // Getters
  List<AssessmentRecord> get assessments => _assessments;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  String get selectedTab => _selectedTab;

  int get totalAssessments => _assessments.length;

  List<AssessmentRecord> get gradedAssessments =>
      _assessments.where((a) => a.isGraded).toList();

  int get gradedCount => gradedAssessments.length;

  double? get averageScore {
    final graded = gradedAssessments;
    if (graded.isEmpty) return null;
    final total = graded.fold<int>(0, (sum, a) => sum + (a.score ?? 0));
    return total / graded.length;
  }

  AssessmentRecord? get industryAssessment {
    try {
      return _assessments.firstWhere((a) => a.isIndustry && a.isGraded);
    } catch (_) {
      try {
        return _assessments.firstWhere((a) => a.isIndustry);
      } catch (_) {
        return null;
      }
    }
  }

  AssessmentRecord? get universityAssessment {
    try {
      return _assessments.firstWhere((a) => a.isUniversity && a.isGraded);
    } catch (_) {
      try {
        return _assessments.firstWhere((a) => a.isUniversity);
      } catch (_) {
        return null;
      }
    }
  }

  bool get isIndustryGraded =>
      _assessments.any((a) => a.isIndustry && a.isGraded);

  bool get isUniversityGraded =>
      _assessments.any((a) => a.isUniversity && a.isGraded);

  bool get hasBothEvaluations => isIndustryGraded && isUniversityGraded;

  double? get compositeGradeScore {
    final ind = industryAssessment?.score;
    final uni = universityAssessment?.score;
    if (ind != null && uni != null) {
      return (ind + uni) / 2.0;
    }
    if (ind != null) return ind.toDouble();
    if (uni != null) return uni.toDouble();
    return null;
  }

  String get compositeGradeClassification {
    final s = compositeGradeScore;
    if (s == null) return 'Pending Evaluations';
    if (s >= 80) return 'Distinction (A)';
    if (s >= 70) return 'Credit (B)';
    if (s >= 60) return 'Pass (C)';
    if (s >= 50) return 'Satisfactory (D)';
    return 'Needs Improvement (E)';
  }

  void setTab(String tab) {
    if (_selectedTab != tab) {
      _selectedTab = tab;
      notifyListeners();
    }
  }

  /// Fetches assessment list from backend API
  Future<void> fetchAssessments({bool forceRefresh = false}) async {
    if (_isLoading) return;
    if (!forceRefresh && _assessments.isNotEmpty) return;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final records = await _service.getAssessments();
      _assessments = records;
      _errorMessage = null;
    } on AppException catch (e) {
      _errorMessage = e.message;
    } catch (e) {
      _errorMessage = 'An unexpected error occurred while loading reports.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Populates realistic demo assessments for offline exploration
  void loadDemoData() {
    _assessments = _getDemoAssessments();
    _errorMessage = null;
    _isLoading = false;
    _selectedTab = 'all';
    notifyListeners();
  }

  static List<AssessmentRecord> _getDemoAssessments() {
    final now = DateTime.now();
    return [
      AssessmentRecord(
        id: 'ass-1',
        studentId: 'demo-student-id',
        evaluatorId: 'eval-ind-1',
        schoolId: 'demo-school-id',
        score: 88,
        status: 'submitted',
        evaluatorType: 'industry',
        type: 'midterm',
        feedback: 'Demonstrates strong initiative, high code quality, and active engagement during daily standups. Successfully delivered critical mobile module integration.',
        criteria: {
          'Technical Competence': 90,
          'Work Ethic & Punctuality': 95,
          'Teamwork & Collaboration': 85,
          'Problem Solving': 82,
        },
        createdAt: now.subtract(const Duration(days: 14)),
        updatedAt: now.subtract(const Duration(days: 14)),
        evaluator: const AssessmentEvaluator(
          id: 'eval-ind-1',
          name: 'Eng. Sarah Jenkins',
          email: 'sarah.j@safaricom.co.ke',
          role: 'industry_supervisor',
        ),
      ),
      AssessmentRecord(
        id: 'ass-2',
        studentId: 'demo-student-id',
        evaluatorId: 'eval-uni-1',
        schoolId: 'demo-school-id',
        score: 92,
        status: 'submitted',
        evaluatorType: 'university',
        type: 'academic_visit',
        feedback: 'Logbook records are thorough and up to date. Demonstrated comprehensive understanding of software lifecycle and institutional safety standards.',
        criteria: {
          'Academic Rigor': 94,
          'Logbook Documentation': 90,
          'Institutional Compliance': 92,
        },
        createdAt: now.subtract(const Duration(days: 7)),
        updatedAt: now.subtract(const Duration(days: 7)),
        evaluator: const AssessmentEvaluator(
          id: 'eval-uni-1',
          name: 'Dr. James Okoth',
          email: 'unisup_a@ams.com',
          role: 'university_supervisor',
        ),
      ),
    ];
  }

  /// Clears state on user logout
  void clear() {
    _assessments = [];
    _isLoading = false;
    _errorMessage = null;
    _selectedTab = 'all';
    notifyListeners();
  }
}
