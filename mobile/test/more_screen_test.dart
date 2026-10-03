import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:attachpro_student/providers/auth_provider.dart';
import 'package:attachpro_student/providers/reports_provider.dart';
import 'package:attachpro_student/providers/workspace_provider.dart';
import 'package:attachpro_student/screens/more/more_screen.dart';

Widget _buildMoreScreenTestApp() {
  final authProvider = AuthProvider();
  authProvider.setDemoSession();

  final workspaceProvider = WorkspaceProvider();
  workspaceProvider.loadDemoData();

  final reportsProvider = ReportsProvider();

  return MultiProvider(
    providers: [
      ChangeNotifierProvider<AuthProvider>.value(value: authProvider),
      ChangeNotifierProvider<WorkspaceProvider>.value(value: workspaceProvider),
      ChangeNotifierProvider<ReportsProvider>.value(value: reportsProvider),
    ],
    child: const MaterialApp(
      home: MoreScreen(),
    ),
  );
}

void main() {
  group('MoreScreen Interactive Sections Tests', () {
    testWidgets('renders all section headers and settings tiles', (tester) async {
      await tester.pumpWidget(_buildMoreScreenTestApp());
      await tester.pumpAndSettle();

      expect(find.text('More'), findsOneWidget);
      expect(find.text('Alvin Mutie'), findsOneWidget);
      expect(find.text('My Profile'), findsOneWidget);
      expect(find.text('Attachment Details'), findsOneWidget);
      expect(find.text('My Supervisors'), findsOneWidget);
      expect(find.text('Tasks & Deadlines'), findsOneWidget);
      expect(find.text('Announcements'), findsOneWidget);
    });

    testWidgets('tapping My Profile opens profile bottom sheet', (tester) async {
      await tester.pumpWidget(_buildMoreScreenTestApp());
      await tester.pumpAndSettle();

      await tester.tap(find.text('My Profile'));
      await tester.pumpAndSettle();

      expect(find.text('Student Profile'), findsOneWidget);
      expect(find.text('ACADEMIC IDENTIFICATION'), findsOneWidget);
      expect(find.text('CONTACT & AUTHENTICATION'), findsOneWidget);
      expect(find.text('student_a@ams.com'), findsWidgets);
    });

    testWidgets('tapping Attachment Details opens attachment details sheet', (tester) async {
      await tester.pumpWidget(_buildMoreScreenTestApp());
      await tester.pumpAndSettle();

      await tester.tap(find.text('Attachment Details'));
      await tester.pumpAndSettle();

      expect(find.text('Attachment Details'), findsWidgets);
      expect(find.text('HOST ORGANIZATION'), findsOneWidget);
      expect(find.text('TIMELINE & DURATION'), findsOneWidget);
      expect(find.text('Safaricom PLC HQ'), findsOneWidget);
    });

    testWidgets('tapping My Supervisors opens supervisors sheet', (tester) async {
      await tester.pumpWidget(_buildMoreScreenTestApp());
      await tester.pumpAndSettle();

      await tester.tap(find.text('My Supervisors'));
      await tester.pumpAndSettle();

      expect(find.text('My Supervisors'), findsWidgets);
      expect(find.text('INDUSTRY / HOST SUPERVISOR'), findsOneWidget);
      expect(find.text('UNIVERSITY / ACADEMIC SUPERVISOR'), findsOneWidget);
      expect(find.text('Eng. Sarah Jenkins'), findsOneWidget);
      expect(find.text('Dr. James Okoth'), findsOneWidget);
    });

    testWidgets('tapping Tasks & Deadlines opens tasks sheet', (tester) async {
      await tester.pumpWidget(_buildMoreScreenTestApp());
      await tester.pumpAndSettle();

      await tester.tap(find.text('Tasks & Deadlines'));
      await tester.pumpAndSettle();

      expect(find.text('Tasks & Deadlines'), findsWidgets);
      expect(find.text('STANDARD COMPLIANCE SCHEDULE'), findsOneWidget);
    });

    testWidgets('tapping Announcements opens announcements sheet', (tester) async {
      await tester.pumpWidget(_buildMoreScreenTestApp());
      await tester.pumpAndSettle();

      await tester.tap(find.text('Announcements'));
      await tester.pumpAndSettle();

      expect(find.text('Announcements'), findsWidgets);
      expect(find.text('Mid-Term Faculty Site Supervision Visits'), findsOneWidget);
    });

    testWidgets('tapping Technical Support opens support sheet', (tester) async {
      await tester.pumpWidget(_buildMoreScreenTestApp());
      await tester.pumpAndSettle();

      await tester.drag(find.byType(ListView), const Offset(0, -400));
      await tester.pumpAndSettle();

      await tester.tap(find.text('AttachPro Technical Support'));
      await tester.pumpAndSettle();

      expect(find.text('Technical Support'), findsWidgets);
      expect(find.text('HELPDESK CHANNELS'), findsOneWidget);
      expect(find.text('support@attachpro.edu'), findsOneWidget);
    });

    testWidgets('tapping Handbook opens industrial handbook sheet', (tester) async {
      await tester.pumpWidget(_buildMoreScreenTestApp());
      await tester.pumpAndSettle();

      await tester.drag(find.byType(ListView), const Offset(0, -600));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Industrial Attachment Handbook'));
      await tester.pumpAndSettle();

      expect(find.text('Attachment Handbook'), findsWidgets);
      expect(find.text('1. Objectives of Industrial Training'), findsOneWidget);
    });

    testWidgets('tapping Student Code of Conduct opens conduct sheet', (tester) async {
      await tester.pumpWidget(_buildMoreScreenTestApp());
      await tester.pumpAndSettle();

      await tester.drag(find.byType(ListView), const Offset(0, -600));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Student Code of Industrial Conduct'));
      await tester.pumpAndSettle();

      expect(find.text('Code of Industrial Conduct'), findsWidgets);
      expect(find.text('Article 1 — Professional Integrity'), findsOneWidget);
    });
  });
}
