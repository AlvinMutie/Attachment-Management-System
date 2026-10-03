import 'package:flutter_test/flutter_test.dart';
import 'package:attachpro_student/core/errors/app_exceptions.dart';
import 'package:attachpro_student/models/assessment_model.dart';
import 'package:attachpro_student/providers/reports_provider.dart';
import 'package:attachpro_student/services/report_service.dart';

class _MockReportService extends ReportService {
  final List<dynamic> _responses;
  int callCount = 0;

  _MockReportService(this._responses);

  @override
  Future<List<AssessmentRecord>> getAssessments() async {
    callCount++;
    if (_responses.isEmpty) return [];
    final next = _responses.removeAt(0);
    if (next is Exception) throw next;
    if (next is List<AssessmentRecord>) return next;
    return [];
  }
}

void main() {
  group('AssessmentModel Unit Tests', () {
    test('Correctly parses and calculates score classifications and criteria', () {
      final json = {
        'id': 'asm_101',
        'studentId': 'std_1',
        'evaluatorId': 'eval_1',
        'schoolId': 'sch_1',
        'type': 'end-of-attachment',
        'evaluatorType': 'industry',
        'score': 94,
        'criteria': {
          'Technical Skills': 95,
          'Work Ethic': 93,
        },
        'feedback': 'Exceptional initiative shown.',
        'status': 'submitted',
        'createdAt': '2026-08-15T10:00:00.000Z',
        'updatedAt': '2026-08-15T10:00:00.000Z',
        'evaluator': {
          'id': 'eval_1',
          'name': 'Eng. Jane Doe',
          'email': 'jane@example.com',
          'role': 'industry_supervisor',
        }
      };

      final model = AssessmentRecord.fromJson(json);

      expect(model.id, 'asm_101');
      expect(model.score, 94);
      expect(model.isIndustry, isTrue);
      expect(model.isUniversity, isFalse);
      expect(model.isFinal, isTrue);
      expect(model.isGraded, isTrue);
      expect(model.displayType, 'Final Evaluation');
      expect(model.displayEvaluatorType, 'Industry Supervisor');
      expect(model.gradeClassification, 'Distinction (A)');
      expect(model.evaluator?.name, 'Eng. Jane Doe');
      expect(model.criteria?.length, 2);
    });

    test('Handles null evaluator and missing criteria gracefully', () {
      final json = {
        'id': 'asm_102',
        'studentId': 'std_1',
        'evaluatorId': 'eval_2',
        'schoolId': 'sch_1',
        'type': 'mid-term',
        'evaluatorType': 'university',
        'score': 65,
        'feedback': 'Satisfactory.',
      };

      final model = AssessmentRecord.fromJson(json);

      expect(model.id, 'asm_102');
      expect(model.score, 65);
      expect(model.isUniversity, isTrue);
      expect(model.isMidterm, isTrue);
      expect(model.gradeClassification, 'Pass (C)');
      expect(model.evaluator, isNull);
      expect(model.criteria, isNull);
    });
  });

  group('ReportsProvider Unit Tests', () {
    test('Calculates composite metrics, average score, and grade classification', () async {
      final assessments = [
        AssessmentRecord(
          id: '1',
          studentId: 'std_1',
          evaluatorId: 'eval_1',
          schoolId: 'sch_1',
          type: 'end-of-attachment',
          evaluatorType: 'industry',
          score: 90,
          criteria: {},
          feedback: 'Great job',
          status: 'submitted',
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
        AssessmentRecord(
          id: '2',
          studentId: 'std_1',
          evaluatorId: 'eval_2',
          schoolId: 'sch_1',
          type: 'end-of-attachment',
          evaluatorType: 'university',
          score: 80,
          criteria: {},
          feedback: 'Solid performance',
          status: 'submitted',
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
      ];

      final provider = ReportsProvider(
        service: _MockReportService([assessments]),
      );

      await provider.fetchAssessments();

      expect(provider.isLoading, isFalse);
      expect(provider.totalAssessments, 2);
      expect(provider.gradedAssessments.length, 2);
      expect(provider.averageScore, 85.0);
      expect(provider.compositeGradeScore, 85.0);
      expect(provider.compositeGradeClassification, 'Distinction (A)');
      expect(provider.isIndustryGraded, isTrue);
      expect(provider.isUniversityGraded, isTrue);
      expect(provider.hasBothEvaluations, isTrue);
    });

    test('Handles fetch error and allows retry', () async {
      final provider = ReportsProvider(
        service: _MockReportService([
          const ServerException('500 Internal Error'),
          <AssessmentRecord>[],
        ]),
      );

      await provider.fetchAssessments();
      expect(provider.isLoading, isFalse);
      expect(provider.errorMessage, '500 Internal Error');

      await provider.fetchAssessments(forceRefresh: true);
      expect(provider.isLoading, isFalse);
      expect(provider.errorMessage, isNull);
      expect(provider.assessments, isEmpty);
    });

    test('Tab switching works as expected', () {
      final provider = ReportsProvider(
        service: _MockReportService([]),
      );

      expect(provider.selectedTab, 'all');
      provider.setTab('rubric');
      expect(provider.selectedTab, 'rubric');
      provider.setTab('documents');
      expect(provider.selectedTab, 'documents');
    });
  });
}
