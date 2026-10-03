import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import 'package:attachpro_student/core/errors/app_exceptions.dart';
import 'package:attachpro_student/models/user_model.dart';
import 'package:attachpro_student/models/workspace_model.dart';
import 'package:attachpro_student/providers/auth_provider.dart';
import 'package:attachpro_student/providers/workspace_provider.dart';
import 'package:attachpro_student/screens/home/dashboard_screen.dart';
import 'package:attachpro_student/services/auth_service.dart';
import 'package:attachpro_student/services/workspace_service.dart';

/// Fake auth service: restores a fixed student session without touching storage/network.
class _FakeAuthService extends AuthService {
  @override
  Future<UserModel?> restoreSession() async => const UserModel(
        id: 'u1',
        name: 'Jane Wanjiku',
        email: 'jane@uni.ac.ke',
        role: 'student',
      );
}

/// Fake workspace service returning queued responses (JSON map or exception).
class _FakeWorkspaceService extends WorkspaceService {
  final List<Object> _responses;
  int calls = 0;
  _FakeWorkspaceService(this._responses);

  @override
  Future<WorkspaceModel> getWorkspace() async {
    final r = _responses[calls.clamp(0, _responses.length - 1)];
    calls++;
    if (r is Exception) throw r;
    return WorkspaceModel.fromJson(r as Map<String, dynamic>);
  }
}

/// Mirrors the real GET /api/student/workspace payload shape.
Map<String, dynamic> _activeWorkspace() => {
      'success': true,
      'data': {
        'student': {
          'id': 's1',
          'admissionNumber': 'SCT211-0001/2021',
          'department': 'Software Engineering Dept',
          'placementStatus': 'ACTIVE',
          'organizationName': 'Safaricom PLC',
          'startDate': '2026-09-01',
          'endDate': '2026-11-30',
          'user': {'id': 'u1', 'name': 'Jane Wanjiku', 'email': 'jane@uni.ac.ke'},
          'industrySupervisor': {'id': 'i1', 'name': 'Peter Otieno', 'email': 'p@saf.co.ke'},
          'universitySupervisor': {'id': 'v1', 'name': 'Dr. Mary Achieng', 'email': 'm@uni.ac.ke'},
        },
        'dates': {
          'startDate': '2026-09-01',
          'endDate': '2026-11-30',
          'totalDays': 91,
          'daysCompleted': 32,
          'daysRemaining': 59,
          'percentElapsed': 35,
        },
        'attendance': {
          'totalRecords': 25,
          'presentCount': 22,
          'lateCount': 1,
          'absentCount': 2,
          'excusedCount': 0,
          'rate': 92,
          'status': 'COMPLIANT',
        },
        'readiness': {'ready': false, 'score': 57, 'blockers': ['x']},
        'actionQueue': [
          {
            'id': 'CHECK_IN_TODAY',
            'priority': 'HIGH',
            'title': 'Daily Attendance Check-In',
            'description': 'Log your attendance verification for today.',
            'link': '/student/dashboard',
            'actionText': 'Check In Now',
          },
          {
            'id': 'REVISE_LOGBOOK_7',
            'priority': 'HIGH',
            'title': 'Revise Week 3 Logbook',
            'description': 'Supervisor requested revision: "Add more detail"',
            'actionText': 'Revise & Resubmit',
          },
        ],
        'deadlines': [
          {
            'id': 'ATTACHMENT_END',
            'title': 'Attachment Conclusion Date',
            'targetDate': '2026-11-30',
            'daysRemaining': 59,
            'status': 'UPCOMING',
            'category': 'PLACEMENT',
          },
        ],
        'logbooksSummary': {'total': 4, 'approved': 2, 'pending': 1, 'rejected': 1},
        'assessmentsSummary': {
          'total': 0,
          'industrySubmitted': false,
          'universitySubmitted': false,
        },
      },
    };

/// Brand-new student: draft placement, no dates, no supervisors, no records.
Map<String, dynamic> _draftWorkspace() => {
      'success': true,
      'data': {
        'student': {
          'id': 's2',
          'admissionNumber': 'SCT211-0002/2021',
          'placementStatus': 'DRAFT',
          'user': {'id': 'u1', 'name': 'Jane Wanjiku'},
          'industrySupervisor': null,
          'universitySupervisor': null,
        },
        'dates': {
          'startDate': null,
          'endDate': null,
          'totalDays': 0,
          'daysCompleted': 0,
          'daysRemaining': 0,
          'percentElapsed': 0,
        },
        'attendance': {'totalRecords': 0, 'rate': 0, 'status': 'NO_RECORDS'},
        'readiness': {'ready': false, 'score': 0, 'blockers': []},
        'actionQueue': [
          {
            'id': 'SUBMIT_PLACEMENT',
            'priority': 'HIGH',
            'title': 'Submit Placement Application',
            'description': 'Provide host organization details.',
            'actionText': 'Complete Placement',
          },
        ],
        'deadlines': [],
        'logbooksSummary': {'total': 0, 'approved': 0, 'pending': 0, 'rejected': 0},
        'assessmentsSummary': {'total': 0},
      },
    };

Future<_FakeWorkspaceService> _pumpDashboard(
  WidgetTester tester,
  List<Object> responses,
) async {
  tester.view.physicalSize = const Size(412 * 3, 917 * 3);
  tester.view.devicePixelRatio = 3;
  addTearDown(tester.view.reset);

  final service = _FakeWorkspaceService(responses);
  await tester.pumpWidget(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
            create: (_) => AuthProvider(authService: _FakeAuthService())),
        ChangeNotifierProvider(
            create: (_) => WorkspaceProvider(service: service)),
      ],
      child: const MaterialApp(home: DashboardScreen()),
    ),
  );
  // Let post-frame fetch + progress animation complete (skeleton loops, so no pumpAndSettle).
  for (var i = 0; i < 10; i++) {
    await tester.pump(const Duration(milliseconds: 100));
  }
  return service;
}

void main() {
  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  testWidgets('renders real workspace data for an active student',
      (tester) async {
    await _pumpDashboard(tester, [_activeWorkspace()]);

    expect(find.textContaining('Jane', findRichText: true), findsWidgets);
    expect(find.text('Day 32 of your 91-day industrial attachment'), findsOneWidget);
    expect(find.text('35%'), findsOneWidget);
    expect(find.text('59 days left'), findsOneWidget);
    expect(find.text('In Progress'), findsOneWidget);
    expect(find.text('92%', findRichText: true), findsOneWidget);
    expect(find.text('Compliant'), findsOneWidget);

    await tester.scrollUntilVisible(find.text('Dr. Mary Achieng'), 200);
    expect(find.text('Safaricom PLC'), findsOneWidget);
    expect(find.text('Peter Otieno'), findsOneWidget);

    await tester.scrollUntilVisible(find.text('Daily Attendance Check-In'), 200);
    expect(find.text('2 Pending'), findsOneWidget);

    await tester.scrollUntilVisible(find.text('Attachment Conclusion Date'), 200);
    expect(find.text('Due in 59 days'), findsOneWidget);
    expect(find.text('Revision Requested'), findsOneWidget);
  });

  testWidgets('handles a draft student with missing placement data gracefully',
      (tester) async {
    await _pumpDashboard(tester, [_draftWorkspace()]);

    expect(find.text('Set up your attachment placement to get started'), findsOneWidget);
    expect(find.text('Draft'), findsOneWidget);
    expect(find.text('No records'), findsOneWidget);

    await tester.scrollUntilVisible(find.text('Submit Placement Application'), 200);
    expect(find.text('Not yet assigned'), findsOneWidget);
    expect(find.text('No supervisors assigned yet'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('shows error state and recovers on retry', (tester) async {
    final service = await _pumpDashboard(tester, [
      const NetworkException('Unable to connect to the server.'),
      _activeWorkspace(),
    ]);

    expect(find.text('Unable to load dashboard'), findsOneWidget);
    expect(find.text('Unable to connect to the server.'), findsOneWidget);

    await tester.tap(find.text('Retry'));
    for (var i = 0; i < 10; i++) {
      await tester.pump(const Duration(milliseconds: 100));
    }

    expect(service.calls, 2);
    expect(find.text('Unable to load dashboard'), findsNothing);
    expect(find.text('35%'), findsOneWidget);
  });
}
