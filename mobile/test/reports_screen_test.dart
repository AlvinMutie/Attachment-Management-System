import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:attachpro_student/core/errors/app_exceptions.dart';
import 'package:attachpro_student/models/assessment_model.dart';
import 'package:attachpro_student/models/user_model.dart';
import 'package:attachpro_student/models/workspace_model.dart';
import 'package:attachpro_student/providers/auth_provider.dart';
import 'package:attachpro_student/providers/reports_provider.dart';
import 'package:attachpro_student/providers/workspace_provider.dart';
import 'package:attachpro_student/screens/reports/reports_screen.dart';
import 'package:attachpro_student/services/auth_service.dart';
import 'package:attachpro_student/services/report_service.dart';
import 'package:attachpro_student/services/workspace_service.dart';

class _FakeAuthService extends AuthService {
  final UserModel _user;
  _FakeAuthService(this._user);

  @override
  Future<UserModel?> restoreSession() async => _user;
}

class _FakeReportService extends ReportService {
  final List<dynamic> _responses;
  int callCount = 0;

  _FakeReportService({List<dynamic>? responses})
      : _responses = responses ?? [];

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

class _FakeWorkspaceService extends WorkspaceService {
  final Map<String, dynamic> _data;
  _FakeWorkspaceService(this._data);

  @override
  Future<WorkspaceModel> getWorkspace() async {
    return WorkspaceModel.fromJson(_data);
  }
}

UserModel _testUser() {
  return const UserModel(
    id: 'user_1',
    name: 'Alvin Kiprop',
    email: 'alvin@example.com',
    role: 'student',
    admissionNumber: 'SC211/0458/2022',
  );
}

Map<String, dynamic> _sampleWorkspaceJson({bool isReady = false}) {
  return {
    'success': true,
    'data': {
      'student': {
        'id': 'student_1',
        'admissionNumber': 'SC211/0458/2022',
        'course': 'BSc Computer Science',
        'department': 'School of Computer Science',
        'placementStatus': 'ACTIVE',
        'organizationName': 'Safaricom PLC',
        'startDate': '2026-05-04',
        'endDate': '2026-08-28',
        'user': {'id': 'user_1', 'name': 'Alvin Kiprop', 'email': 'alvin@example.com'},
        'industrySupervisor': {
          'id': 'eval_ind_1',
          'name': 'Eng. David Mwangi',
          'email': 'david.mwangi@safaricom.co.ke'
        },
        'universitySupervisor': {
          'id': 'eval_uni_1',
          'name': 'Dr. Grace Njeri',
          'email': 'grace.njeri@dkut.ac.ke'
        },
      },
      'dates': {
        'startDate': '2026-05-04',
        'endDate': '2026-08-28',
        'totalDays': 116,
        'daysCompleted': 100,
        'daysRemaining': 16,
        'percentElapsed': 86,
      },
      'attendance': {
        'totalRecords': 45,
        'presentCount': 44,
        'lateCount': 0,
        'absentCount': 1,
        'excusedCount': 0,
        'rate': 98,
        'status': 'COMPLIANT',
      },
      'logbooksSummary': {
        'total': 12,
        'submitted': 12,
        'approved': 12,
        'pending': 0,
        'rejected': 0,
      },
      'assessmentsSummary': {
        'total': 2,
        'industrySubmitted': true,
        'universitySubmitted': isReady,
      },
      'actionQueue': [],
      'deadlines': [],
      'readiness': {
        'ready': isReady,
        'isReady': isReady,
        'score': isReady ? 100 : 75,
        'blockers': isReady
            ? []
            : [
                'Pending University Supervisor End-of-Attachment Evaluation Submission'
              ],
        'checklist': {
          'placementApproved': true,
          'industrySupervisorAssigned': true,
          'universitySupervisorAssigned': true,
          'attendanceThresholdMet': true,
          'logbooksSubmittedAndReviewed': true,
          'supervisionCompleted': true,
          'industryAssessmentCompleted': true,
          'universityAssessmentCompleted': isReady,
        },
      },
    },
  };
}

List<AssessmentRecord> _sampleAssessments() {
  return [
    AssessmentRecord(
      id: 'asm_1',
      studentId: 'student_1',
      evaluatorId: 'eval_ind_1',
      schoolId: 'school_1',
      type: 'end-of-attachment',
      evaluatorType: 'industry',
      score: 92,
      criteria: {
        'Technical Competence': 95,
        'Punctuality & Discipline': 90,
        'Team Collaboration': 90,
        'Problem Solving': 93,
      },
      feedback:
          'Outstanding performance in cloud infrastructure migration. Demonstrated strong initiative and technical depth.',
      status: 'submitted',
      createdAt: DateTime(2026, 8, 20, 14, 30),
      updatedAt: DateTime(2026, 8, 20, 14, 30),
      evaluator: const AssessmentEvaluator(
        id: 'eval_ind_1',
        name: 'Eng. David Mwangi',
        email: 'david.mwangi@safaricom.co.ke',
        role: 'industry_supervisor',
      ),
    ),
    AssessmentRecord(
      id: 'asm_2',
      studentId: 'student_1',
      evaluatorId: 'eval_uni_1',
      schoolId: 'school_1',
      type: 'mid-term',
      evaluatorType: 'university',
      score: 86,
      criteria: {
        'Academic Relevance': 88,
        'Logbook Quality': 85,
        'Fieldwork Presentation': 85,
      },
      feedback:
          'Thorough documentation and clear alignment between coursework theory and industrial practice.',
      status: 'submitted',
      createdAt: DateTime(2026, 7, 10, 11, 15),
      updatedAt: DateTime(2026, 7, 10, 11, 15),
      evaluator: const AssessmentEvaluator(
        id: 'eval_uni_1',
        name: 'Dr. Grace Njeri',
        email: 'grace.njeri@dkut.ac.ke',
        role: 'university_supervisor',
      ),
    ),
  ];
}

Future<_FakeReportService> _pumpReportsScreen(
  WidgetTester tester, {
  List<dynamic>? responses,
  Map<String, dynamic>? workspaceJson,
}) async {
  GoogleFonts.config.allowRuntimeFetching = false;

  tester.view.physicalSize = const Size(412 * 3, 917 * 3);
  tester.view.devicePixelRatio = 3.0;
  addTearDown(() {
    tester.view.resetPhysicalSize();
    tester.view.resetDevicePixelRatio();
  });

  final authService = _FakeAuthService(_testUser());
  final reportService = _FakeReportService(responses: responses);
  final workspaceService = _FakeWorkspaceService(workspaceJson ?? _sampleWorkspaceJson());

  final authProvider = AuthProvider(authService: authService);
  final workspaceProvider = WorkspaceProvider(service: workspaceService);
  final reportsProvider = ReportsProvider(service: reportService);

  await tester.pumpWidget(
    MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: authProvider),
        ChangeNotifierProvider.value(value: workspaceProvider),
        ChangeNotifierProvider.value(value: reportsProvider),
      ],
      child: const MaterialApp(
        home: ReportsScreen(),
      ),
    ),
  );

  return reportService;
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Phase 6 — Reports & Documents / Accreditation Screen Tests', () {
    testWidgets('1. Renders real assessments, scores, evaluator info, and criteria pills',
        (tester) async {
      await _pumpReportsScreen(
        tester,
        responses: [_sampleAssessments()],
      );

      await tester.pumpAndSettle();

      // Header and description
      expect(find.text('Reports & Evaluations'), findsOneWidget);
      expect(
        find.textContaining('Official academic evaluations'),
        findsOneWidget,
      );

      // Readiness Hero
      expect(find.text('CLEARANCE READINESS'), findsOneWidget);
      expect(find.text('75%'), findsOneWidget);
      expect(find.text('75% Ready'), findsOneWidget);

      // Bento Grid items
      expect(find.text('AVERAGE SCORE'), findsOneWidget);
      expect(find.text('89.0%'), findsOneWidget);
      expect(find.text('Distinction (A)'), findsWidgets);
      expect(find.text('GRADED REVIEWS'), findsOneWidget);
      expect(find.text('2 of 2'), findsOneWidget);

      // Section header
      expect(find.text('SUBMITTED EVALUATIONS (2)'), findsOneWidget);

      // Assessment card 1 (Industry)
      expect(find.text('Eng. David Mwangi'), findsWidgets);
      expect(find.text('Industry Supervisor'), findsWidgets);
      expect(find.text('92%'), findsOneWidget);
      expect(find.textContaining('cloud infrastructure migration'), findsOneWidget);
      expect(find.text('Technical Competence'), findsOneWidget);

      // Assessment card 2 (University)
      expect(find.text('Dr. Grace Njeri'), findsWidgets);
      expect(find.text('Faculty Academic Advisor'), findsOneWidget);
      expect(find.text('86%'), findsOneWidget);
      expect(find.textContaining('Thorough documentation'), findsOneWidget);
    });

    testWidgets('2. Displays 100% Eligible for Clearance badge when readiness is complete',
        (tester) async {
      await _pumpReportsScreen(
        tester,
        responses: [_sampleAssessments()],
        workspaceJson: _sampleWorkspaceJson(isReady: true),
      );

      await tester.pumpAndSettle();

      expect(find.text('100%'), findsOneWidget);
      expect(find.text('Eligible for Academic Clearance'), findsOneWidget);
      expect(find.text('Eligible'), findsOneWidget);
      expect(
        find.text('All mandatory academic requirements satisfied for final sign-off.'),
        findsOneWidget,
      );
    });

    testWidgets('3. Clearance Rubric tab renders 8-point institutional checklist',
        (tester) async {
      await _pumpReportsScreen(
        tester,
        responses: [_sampleAssessments()],
      );

      await tester.pumpAndSettle();

      // Tap on Clearance Rubric tab
      final rubricTab = find.text('Clearance Rubric (8)');
      expect(rubricTab, findsOneWidget);
      await tester.ensureVisible(rubricTab);
      await tester.tap(rubricTab);
      await tester.pumpAndSettle();

      // Rubric section header and benchmarks
      expect(find.text('Academic Clearance Rubric'), findsOneWidget);
      expect(find.text('Host Organization Placement Approved'), findsOneWidget);
      expect(find.text('Attendance Compliance (≥75% threshold)'), findsOneWidget);
      expect(find.text('Weekly Logbook Submissions Reviewed & Signed'), findsOneWidget);
      expect(find.text('Industry Supervisor Evaluation Submitted'), findsOneWidget);
      expect(find.text('Faculty Academic Assessment Graded'), findsOneWidget);
    });

    testWidgets('4. Institutional Documents tab renders static resources and opens preview',
        (tester) async {
      await _pumpReportsScreen(
        tester,
        responses: [_sampleAssessments()],
      );

      await tester.pumpAndSettle();

      // Tap on Institutional Documents tab
      final docsTab = find.text('Institutional Documents (4)');
      expect(docsTab, findsOneWidget);
      await tester.ensureVisible(docsTab);
      await tester.tap(docsTab);
      await tester.pumpAndSettle();

      // Document list items
      expect(find.text('Institutional Documents'), findsOneWidget);
      await tester.drag(find.byType(ListView), const Offset(0, -250));
      await tester.pumpAndSettle();

      final docItem =
          find.text('Industrial Attachment Policy & Regulatory Guidelines');
      expect(docItem, findsOneWidget);

      // Tap on a document to open bottom sheet preview
      await tester.tap(docItem);
      await tester.pumpAndSettle();

      // Bottom sheet verification
      expect(find.text('Institutional Overview'), findsOneWidget);
      expect(find.text('Institutional Governance'), findsOneWidget);
      expect(find.text('Close Overview'), findsOneWidget);

      // Close bottom sheet
      await tester.tap(find.text('Close Overview'));
      await tester.pumpAndSettle();
    });

    testWidgets('5. Handles empty assessments state gracefully', (tester) async {
      await _pumpReportsScreen(
        tester,
        responses: [ <AssessmentRecord>[] ],
      );

      await tester.pumpAndSettle();

      expect(find.text('No Evaluations Submitted Yet'), findsOneWidget);
      expect(
        find.textContaining('Formal mid-term and final attachment assessments'),
        findsOneWidget,
      );
    });

    testWidgets('6. Handles API error and allows retry', (tester) async {
      final fakeReportService = await _pumpReportsScreen(
        tester,
        responses: [
          const NetworkException('Failed to connect to AttachPro assessment server.'),
          _sampleAssessments(),
        ],
      );

      await tester.pumpAndSettle();

      // Verify error state
      expect(find.text('Unable to Load Reports'), findsOneWidget);
      expect(
        find.text('Failed to connect to AttachPro assessment server.'),
        findsOneWidget,
      );
      expect(find.text('Retry'), findsOneWidget);

      // Tap Retry
      await tester.tap(find.text('Retry'));
      await tester.pumpAndSettle();

      // Should now show assessments
      expect(fakeReportService.callCount, 2);
      expect(find.text('SUBMITTED EVALUATIONS (2)'), findsOneWidget);
      expect(find.text('Eng. David Mwangi'), findsWidgets);
    });
  });
}
