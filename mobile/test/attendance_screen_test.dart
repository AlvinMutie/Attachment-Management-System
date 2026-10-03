import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:attachpro_student/core/errors/app_exceptions.dart';
import 'package:attachpro_student/models/attendance_model.dart';
import 'package:attachpro_student/models/user_model.dart';
import 'package:attachpro_student/providers/attendance_provider.dart';
import 'package:attachpro_student/providers/auth_provider.dart';
import 'package:attachpro_student/providers/workspace_provider.dart';
import 'package:attachpro_student/screens/attendance/attendance_screen.dart';
import 'package:attachpro_student/services/attendance_service.dart';
import 'package:attachpro_student/services/auth_service.dart';

class _FakeAuthService extends AuthService {
  final UserModel _user;
  _FakeAuthService(this._user);

  @override
  Future<UserModel?> restoreSession() async => _user;
}

class _FakeAttendanceService extends AttendanceService {
  final List<dynamic> _historyResponses;
  final List<dynamic> _qrResponses;
  int historyCalls = 0;
  int qrCalls = 0;

  _FakeAttendanceService({
    List<dynamic>? historyResponses,
    List<dynamic>? qrResponses,
  })  : _historyResponses = historyResponses ?? [],
        _qrResponses = qrResponses ?? [];

  @override
  Future<List<AttendanceRecord>> getAttendanceHistory() async {
    historyCalls++;
    if (_historyResponses.isEmpty) return [];
    final next = _historyResponses.removeAt(0);
    if (next is Exception) throw next;
    if (next is List<AttendanceRecord>) return next;
    return [];
  }

  @override
  Future<AttendanceQrTokenData> getQrToken() async {
    qrCalls++;
    if (_qrResponses.isEmpty) {
      return AttendanceQrTokenData(
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy',
        securityHash: 'AP-8842-SEC-KEN-2026',
        expiresInSeconds: 300,
        expiresAt: DateTime.now().add(const Duration(seconds: 300)),
        date: '2026-08-14',
        alreadyVerified: false,
      );
    }
    final next = _qrResponses.removeAt(0);
    if (next is Exception) throw next;
    if (next is AttendanceQrTokenData) return next;
    return AttendanceQrTokenData(
      token: 'dummy',
      securityHash: 'AP-8842-SEC-KEN-2026',
      expiresInSeconds: 300,
      expiresAt: DateTime.now().add(const Duration(seconds: 300)),
      date: '2026-08-14',
      alreadyVerified: false,
    );
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

List<AttendanceRecord> _sampleAttendanceRecords() {
  return [
    AttendanceRecord(
      id: 'att_1',
      studentId: 'student_1',
      schoolId: 'school_1',
      date: '2026-08-13',
      timestamp: DateTime(2026, 8, 13, 8, 24),
      status: 'present',
      verificationMethod: 'qr_scanner',
      notes: 'Scan verified: John Kamau (Supervisor)',
    ),
    AttendanceRecord(
      id: 'att_2',
      studentId: 'student_1',
      schoolId: 'school_1',
      date: '2026-08-12',
      timestamp: DateTime(2026, 8, 12, 8, 31),
      status: 'present',
      verificationMethod: 'qr_scanner',
      notes: 'Proximity match: Lab Building B',
    ),
    AttendanceRecord(
      id: 'att_3',
      studentId: 'student_1',
      schoolId: 'school_1',
      date: '2026-08-11',
      timestamp: DateTime(2026, 8, 11, 8, 15),
      status: 'present',
      verificationMethod: 'qr_scanner',
      notes: 'Supervisor signed & confirmed',
    ),
    AttendanceRecord(
      id: 'att_4',
      studentId: 'student_1',
      schoolId: 'school_1',
      date: '2026-08-06',
      timestamp: DateTime(2026, 8, 6, 9, 0),
      status: 'excused',
      verificationMethod: 'manual',
      notes: 'Hospital consultation day',
    ),
    AttendanceRecord(
      id: 'att_5',
      studentId: 'student_1',
      schoolId: 'school_1',
      date: '2026-08-05',
      timestamp: DateTime(2026, 8, 5, 8, 30),
      status: 'present',
      verificationMethod: 'qr_scanner',
      notes: 'Field site inspection',
    ),
  ];
}

Future<_FakeAttendanceService> _pumpAttendanceScreen(
  WidgetTester tester, {
  List<dynamic>? historyResponses,
  List<dynamic>? qrResponses,
}) async {
  final attendanceService = _FakeAttendanceService(
    historyResponses: historyResponses,
    qrResponses: qrResponses,
  );

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
          create: (_) => AttendanceProvider(service: attendanceService),
        ),
      ],
      child: const MaterialApp(
        home: AttendanceScreen(),
      ),
    ),
  );

  for (var i = 0; i < 8; i++) {
    await tester.pump(const Duration(milliseconds: 100));
  }
  return attendanceService;
}

void main() {
  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  testWidgets(
      'renders Stitch attendance screen with identification card, bento stats, and today check-in trigger',
      (tester) async {
    await _pumpAttendanceScreen(
      tester,
      historyResponses: [
        _sampleAttendanceRecords(),
      ],
    );

    // Verify Student Identity Card
    expect(find.text('Alvin Kiprop'), findsOneWidget);
    expect(find.text('Reg: SC211/0458/2022'), findsOneWidget);
    expect(find.text('Academic Year 2026'), findsOneWidget);

    // Verify Bento Stats
    expect(find.text('ATTENDANCE RATE'), findsOneWidget);
    expect(find.text('On Track'), findsOneWidget);
    expect(find.text('80.0%'), findsOneWidget); // 4 of 5 = 80%
    expect(find.text('Days Present'), findsOneWidget);
    expect(find.text('Unexcused Absences'), findsOneWidget);
    expect(find.text('Perfect Record'), findsOneWidget);

    // Verify Excused Days Card
    expect(find.text('1 Excused Days'), findsOneWidget);

    // Verify Today's Unverified Hero Card
    expect(find.text('Generate Check-in QR Code'), findsOneWidget);
    expect(find.text('Not Checked In'), findsOneWidget);

    // Verify Attendance History Section
    expect(find.text('Recent Attendance Logs'), findsOneWidget);
    expect(find.text('All (5)'), findsOneWidget);
    expect(find.text('Verified (4)'), findsOneWidget);
    expect(find.text('Excused (1)'), findsOneWidget);

    // Verify History Log Cards
    expect(find.text('Hospital consultation day'), findsWidgets);
    expect(find.text('Scan verified: John Kamau (Supervisor)'), findsOneWidget);
  });

  testWidgets('filters attendance logs by All, Verified, and Excused filter tabs',
      (tester) async {
    await _pumpAttendanceScreen(
      tester,
      historyResponses: [
        _sampleAttendanceRecords(),
      ],
    );

    // Scroll down to filter chips
    await tester.drag(find.byType(SingleChildScrollView).first, const Offset(0, -300));
    await tester.pumpAndSettle();

    // Filter by Verified (4)
    await tester.tap(find.text('Verified (4)'));
    await tester.pumpAndSettle();

    expect(find.text('Scan verified: John Kamau (Supervisor)'), findsOneWidget);
    expect(find.text('Hospital consultation day'), findsNothing);

    // Filter by Excused (1)
    await tester.tap(find.text('Excused (1)'));
    await tester.pumpAndSettle();

    expect(find.text('Hospital consultation day'), findsWidgets);
    expect(find.text('Scan verified: John Kamau (Supervisor)'), findsNothing);

    // Filter by All (5)
    await tester.tap(find.text('All (5)'));
    await tester.pumpAndSettle();

    expect(find.text('Hospital consultation day'), findsWidgets);
    expect(find.text('Scan verified: John Kamau (Supervisor)'), findsOneWidget);
  });

  testWidgets(
      'navigates to Dynamic QR Screen and renders server-signed token, hash, and countdown',
      (tester) async {
    final service = await _pumpAttendanceScreen(
      tester,
      historyResponses: [
        _sampleAttendanceRecords(),
      ],
      qrResponses: [
        AttendanceQrTokenData(
          token: 'server_jwt_secret_token_123',
          securityHash: 'AP-0458-SEC-KEN-2026',
          expiresInSeconds: 300,
          expiresAt: DateTime.now().add(const Duration(seconds: 300)),
          date: '2026-08-14',
          alreadyVerified: false,
        ),
      ],
    );

    // Tap "Generate Check-in QR Code"
    await tester.tap(find.text('Generate Check-in QR Code'));
    await tester.pumpAndSettle();

    // Verify on Dynamic QR Screen
    expect(find.text('Qr Scanner Verification'), findsOneWidget);
    expect(find.text('AP-0458-SEC-KEN-2026'), findsOneWidget);
    expect(find.byType(QrImageView), findsOneWidget);
    expect(find.textContaining('Expires in'), findsOneWidget);
    expect(find.text('Verification Protocol'), findsOneWidget);

    // Close screen
    await tester.tap(find.byIcon(Icons.close_rounded));
    await tester.pumpAndSettle();

    expect(find.text('Attendance & Verification'), findsOneWidget);
    expect(service.qrCalls, 1);
  });

  testWidgets('handles expired QR token and regenerates on button tap',
      (tester) async {
    final service = await _pumpAttendanceScreen(
      tester,
      historyResponses: [
        _sampleAttendanceRecords(),
      ],
      qrResponses: [
        // Expired response
        AttendanceQrTokenData(
          token: 'expired_jwt_token',
          securityHash: 'AP-0458-SEC-EXP',
          expiresInSeconds: 0,
          expiresAt: DateTime.now().subtract(const Duration(seconds: 10)),
          date: '2026-08-14',
          alreadyVerified: false,
        ),
        // Fresh response upon regeneration
        AttendanceQrTokenData(
          token: 'fresh_jwt_token',
          securityHash: 'AP-0458-SEC-FRESH',
          expiresInSeconds: 300,
          expiresAt: DateTime.now().add(const Duration(seconds: 300)),
          date: '2026-08-14',
          alreadyVerified: false,
        ),
      ],
    );

    // Tap "Generate Check-in QR Code"
    await tester.tap(find.text('Generate Check-in QR Code'));
    await tester.pumpAndSettle();

    // Verify Expired view is displayed
    expect(find.text('CODE EXPIRED'), findsOneWidget);
    expect(find.text('00:00 — Expired'), findsOneWidget);
    expect(find.text('Generate New QR Code'), findsOneWidget);

    // Tap "Generate New QR Code"
    await tester.tap(find.text('Generate New QR Code'));
    await tester.pumpAndSettle();

    // Verify fresh QR is now active
    expect(find.text('AP-0458-SEC-FRESH'), findsOneWidget);
    expect(find.textContaining('Expires in'), findsOneWidget);
    expect(find.text('CODE EXPIRED'), findsNothing);
    expect(service.qrCalls, 2);
  });

  testWidgets(
      'displays verified attendance hero card and active shift tracker when verified for today',
      (tester) async {
    final now = DateTime.now();
    final todayFormatted =
        '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';

    final todayVerifiedRecord = AttendanceRecord(
      id: 'att_today',
      studentId: 'student_1',
      schoolId: 'school_1',
      date: todayFormatted,
      timestamp: now.subtract(const Duration(hours: 3)),
      status: 'present',
      verificationMethod: 'qr_scanner',
      notes: 'Verified via Dynamic QR Scan',
    );

    await _pumpAttendanceScreen(
      tester,
      historyResponses: [
        [todayVerifiedRecord, ..._sampleAttendanceRecords()],
      ],
    );

    // Verify Celebratory Verified State
    expect(find.text('Check-in Verified by Supervisor!'), findsOneWidget);
    expect(find.text('Attendance Confirmed'), findsOneWidget);
    expect(find.text('ACTIVE SHIFT PULSE'), findsOneWidget);
    expect(find.text('End-of-Day Departure'), findsOneWidget);

    // Verify "Generate Check-in QR Code" is not shown since already verified
    expect(find.text('Generate Check-in QR Code'), findsNothing);
  });

  testWidgets('handles attendance loading error and recovers on retry',
      (tester) async {
    final service = await _pumpAttendanceScreen(
      tester,
      historyResponses: [
        NetworkException('Failed to reach attendance server'),
        _sampleAttendanceRecords(),
      ],
    );

    expect(find.text('Unable to Load Attendance'), findsOneWidget);
    expect(find.text('Failed to reach attendance server'), findsOneWidget);
    expect(find.text('Retry'), findsOneWidget);

    // Tap Retry
    await tester.tap(find.text('Retry'));
    await tester.pumpAndSettle();

    expect(find.text('ATTENDANCE RATE'), findsOneWidget);
    expect(find.text('Unable to Load Attendance'), findsNothing);
    expect(service.historyCalls, 2);
  });

  testWidgets('handles empty attendance records gracefully', (tester) async {
    await _pumpAttendanceScreen(
      tester,
      historyResponses: [
        <AttendanceRecord>[],
      ],
    );

    expect(find.text('--'), findsOneWidget);
    expect(find.text('No attendance records found'), findsOneWidget);
    expect(find.text('All (0)'), findsOneWidget);
  });
}
