import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:attachpro_student/core/errors/app_exceptions.dart';
import 'package:attachpro_student/models/logbook_model.dart';
import 'package:attachpro_student/models/user_model.dart';
import 'package:attachpro_student/providers/auth_provider.dart';
import 'package:attachpro_student/providers/logbook_provider.dart';
import 'package:attachpro_student/providers/workspace_provider.dart';
import 'package:attachpro_student/screens/logbook/logbook_screen.dart';
import 'package:attachpro_student/services/auth_service.dart';
import 'package:attachpro_student/services/logbook_service.dart';

class _FakeAuthService extends AuthService {
  final UserModel _user;
  _FakeAuthService(this._user);

  @override
  Future<UserModel?> restoreSession() async => _user;
}

class _FakeLogbookService extends LogbookService {
  final List<dynamic> _responses;
  int calls = 0;
  bool submitCalled = false;
  bool updateCalled = false;

  _FakeLogbookService(this._responses);

  @override
  Future<List<LogbookModel>> getLogbooks() async {
    calls++;
    if (_responses.isEmpty) return [];
    final next = _responses.removeAt(0);
    if (next is Exception) throw next;
    if (next is List<LogbookModel>) return next;
    return [];
  }

  @override
  Future<LogbookModel> submitLogbook({
    required int weekNumber,
    required String startDate,
    required String endDate,
    required String summary,
    required Map<String, dynamic> dailyEntries,
  }) async {
    submitCalled = true;
    return LogbookModel(
      id: 'new_log_$weekNumber',
      studentId: 'student_1',
      weekNumber: weekNumber,
      startDate: startDate,
      endDate: endDate,
      summary: summary,
      dailyEntries: dailyEntries,
      status: 'pending',
    );
  }

  @override
  Future<LogbookModel> updateLogbook(
    String id, {
    required String summary,
    required Map<String, dynamic> dailyEntries,
  }) async {
    updateCalled = true;
    return LogbookModel(
      id: id,
      studentId: 'student_1',
      weekNumber: 7,
      startDate: '2026-08-11',
      endDate: '2026-08-15',
      summary: summary,
      dailyEntries: dailyEntries,
      status: 'pending',
      supervisorComment: null,
    );
  }
}

UserModel _testUser() {
  return const UserModel(
    id: 'user_1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'student',
  );
}

LogbookModel _sampleWeek7Logbook() {
  return LogbookModel(
    id: 'log_week_7',
    studentId: 'student_1',
    weekNumber: 7,
    startDate: '2026-08-11',
    endDate: '2026-08-15',
    summary: 'Weekly engineering activities focusing on database design, REST APIs and auth testing.',
    dailyEntries: {
      'monday': {
        'title': 'Database schema design & PostgreSQL migration',
        'hours': 8.0,
        'category': 'Backend Engineering',
        'status': 'approved',
      },
      'tuesday': {
        'title': 'RESTful API endpoint development with Node.js',
        'hours': 8.5,
        'category': 'API Development',
        'status': 'pending',
      },
      'wednesday': {
        'title': 'Unit testing & debugging authentication flow',
        'hours': 7.5,
        'category': 'QA & Security',
        'status': 'rejected',
      },
      'thursday': {
        'title': 'Client-side state management & caching (Draft)',
        'hours': 4.0,
        'category': 'Frontend Engineering',
        'status': 'draft',
      },
      'friday': '',
    },
    status: 'rejected',
    supervisorComment:
        'Please expand on the security vulnerabilities identified during JWT token testing before sign-off.',
  );
}

LogbookModel _sampleWeek6Logbook() {
  return const LogbookModel(
    id: 'log_week_6',
    studentId: 'student_1',
    weekNumber: 6,
    startDate: '2026-08-04',
    endDate: '2026-08-08',
    summary: 'Circuit design and hardware safety protocols.',
    dailyEntries: {
      'monday': 'Hardware lab safety and inspection.',
      'tuesday': 'Oscilloscope measurements.',
      'wednesday': 'Power converter testing.',
      'thursday': 'Firmware flash.',
      'friday': 'Sprint demo.',
    },
    status: 'approved',
  );
}

Future<_FakeLogbookService> _pumpLogbookScreen(
  WidgetTester tester,
  List<dynamic> responses,
) async {
  final service = _FakeLogbookService(responses);

  tester.view.physicalSize = const Size(412 * 3, 917 * 3);
  tester.view.devicePixelRatio = 3.0;
  addTearDown(() {
    tester.view.resetPhysicalSize();
    tester.view.resetDevicePixelRatio();
  });

  await tester.pumpWidget(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthProvider(authService: _FakeAuthService(_testUser())),
        ),
        ChangeNotifierProvider(create: (_) => WorkspaceProvider()),
        ChangeNotifierProvider(
          create: (_) => LogbookProvider(service: service),
        ),
      ],
      child: const MaterialApp(home: LogbookScreen()),
    ),
  );

  // Pump multiple times to allow async fetch and animations to settle
  for (var i = 0; i < 8; i++) {
    await tester.pump(const Duration(milliseconds: 100));
  }

  return service;
}

void main() {
  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  testWidgets('renders Stitch logbook layout with week header, action banner, and daily entries',
      (tester) async {
    await _pumpLogbookScreen(tester, [
      [_sampleWeek7Logbook(), _sampleWeek6Logbook()],
    ]);

    // Header & title
    expect(find.text('ATTACHPRO'), findsOneWidget);
    expect(find.text('Attachment Logbook'), findsOneWidget);
    expect(find.text('Industrial Attachment Logbook'), findsOneWidget);

    // Week selector
    expect(find.text('Week 7 (Active)'), findsOneWidget);
    expect(find.text('Week 6'), findsOneWidget);

    // Progress banner
    expect(find.text('Week 7 Progress'), findsOneWidget);
    expect(find.text('4 of 5 days logged (80%)'), findsOneWidget);

    // Action banner
    expect(find.text("Log Today's Entry"), findsOneWidget);

    // Filter chips
    expect(find.text('All (5)'), findsOneWidget);

    // Monday Approved Entry
    expect(
      find.text('Database schema design & PostgreSQL migration'),
      findsOneWidget,
    );
    expect(find.text('Reviewed & Approved'), findsOneWidget);
    expect(find.text('8.0 hrs'), findsOneWidget);

    // Tuesday Under Review Entry
    expect(
      find.text('RESTful API endpoint development with Node.js'),
      findsOneWidget,
    );
    expect(find.text('Under Review'), findsOneWidget);

    // Wednesday Needs Revision Entry with supervisor comment
    expect(
      find.text('Unit testing & debugging authentication flow'),
      findsOneWidget,
    );
    expect(find.text('Needs Revision'), findsOneWidget);
    expect(find.text('Supervisor Feedback'), findsOneWidget);
    expect(
      find.textContaining('Please expand on the security vulnerabilities'),
      findsOneWidget,
    );
    expect(find.text('Edit and Resubmit'), findsOneWidget);

    // Thursday Draft Entry
    expect(find.text('Continue Editing'), findsOneWidget);

    // Friday Scheduled Entry
    await tester.scrollUntilVisible(
      find.text('Sprint demo & weekly retrospective'),
      200,
      scrollable: find.byType(Scrollable).first,
    );
    expect(find.text('Sprint demo & weekly retrospective'), findsOneWidget);
    expect(find.text('Scheduled'), findsOneWidget);

    // Bottom Summary Card
    await tester.scrollUntilVisible(
      find.text('Weekly Total Hours'),
      200,
      scrollable: find.byType(Scrollable).first,
    );
    expect(find.text('Weekly Total Hours'), findsOneWidget);
    expect(find.textContaining('Submission Deadline:', findRichText: true), findsOneWidget);
  });

  testWidgets('filters daily entries when filter chip is tapped',
      (tester) async {
    await _pumpLogbookScreen(tester, [
      [_sampleWeek7Logbook()],
    ]);

    // Tap 'Reviewed (1)' filter
    await tester.tap(find.text('Reviewed (1)'));
    await tester.pumpAndSettle();

    // Only Monday should be shown
    expect(find.text('Database schema design & PostgreSQL migration'), findsOneWidget);
    expect(find.text('RESTful API endpoint development with Node.js'), findsNothing);
    expect(find.text('Unit testing & debugging authentication flow'), findsNothing);

    // Tap 'Under Review (1)' filter
    await tester.tap(find.text('Under Review (1)'));
    await tester.pumpAndSettle();

    expect(find.text('Database schema design & PostgreSQL migration'), findsNothing);
    expect(find.text('RESTful API endpoint development with Node.js'), findsOneWidget);

    // Tap 'All (5)' filter
    await tester.tap(find.text('All (5)'));
    await tester.pumpAndSettle();

    expect(find.text('Database schema design & PostgreSQL migration'), findsOneWidget);
    expect(find.text('RESTful API endpoint development with Node.js'), findsOneWidget);
  });

  testWidgets('switches selected week when week chip is tapped',
      (tester) async {
    await _pumpLogbookScreen(tester, [
      [_sampleWeek7Logbook(), _sampleWeek6Logbook()],
    ]);

    expect(find.text('Week 7 (Active)'), findsOneWidget);

    // Tap Week 6 chip
    await tester.tap(find.text('Week 6'));
    await tester.pumpAndSettle();

    expect(find.text('Week 6 (Active)'), findsOneWidget);
    expect(find.text('Week 6 Progress'), findsOneWidget);
  });

  testWidgets('shows error state and recovers on retry', (tester) async {
    final service = await _pumpLogbookScreen(tester, [
      const NetworkException('Unable to reach the server. Please check your internet connection.'),
      [_sampleWeek7Logbook()],
    ]);

    expect(find.text('Unable to load logbooks'), findsOneWidget);
    expect(find.text('Retry'), findsOneWidget);

    await tester.tap(find.text('Retry'));
    for (var i = 0; i < 8; i++) {
      await tester.pump(const Duration(milliseconds: 100));
    }

    expect(service.calls, 2);
    expect(find.text('Unable to load logbooks'), findsNothing);
    expect(find.text('Industrial Attachment Logbook'), findsOneWidget);
  });

  testWidgets('opens editor sheet and resubmits rejected logbook',
      (tester) async {
    final service = await _pumpLogbookScreen(tester, [
      [_sampleWeek7Logbook()],
    ]);

    // Scroll to Wednesday's 'Edit and Resubmit' button
    await tester.scrollUntilVisible(
      find.text('Edit and Resubmit'),
      200,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.tap(find.text('Edit and Resubmit'));
    await tester.pumpAndSettle();

    // Editor sheet should be open
    expect(find.text('REVISION & RESUBMISSION'), findsOneWidget);
    expect(find.text('Supervisor Revision Request'), findsOneWidget);

    // Scroll to bottom of modal sheet
    await tester.drag(find.text('Daily Log Entries (Monday – Friday)'), const Offset(0, -300));
    await tester.pumpAndSettle();

    expect(find.text('Resubmit for Review'), findsOneWidget);

    // Tap 'Resubmit for Review'
    await tester.tap(find.text('Resubmit for Review'));
    await tester.pumpAndSettle();

    expect(service.updateCalled, isTrue);
  });
}
