import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import '../../core/constants/app_typography.dart';
import '../../providers/attendance_provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/workspace_provider.dart';
import 'dynamic_qr_screen.dart';
import 'widgets/attendance_bento_grid.dart';
import 'widgets/attendance_error.dart';
import 'widgets/attendance_history_section.dart';
import 'widgets/attendance_skeleton.dart';
import 'widgets/compliance_callout_card.dart';
import 'widgets/student_identification_card.dart';
import 'widgets/today_attendance_card.dart';

/// Main Attendance & Verification Screen matching Stitch layout
class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final provider = context.read<AttendanceProvider>();
      if (provider.records.isEmpty && !provider.isLoading) {
        provider.fetchAttendance();
      }
    });
  }

  void _openDynamicQrScreen() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => const DynamicQrScreen(),
      ),
    ).then((_) {
      // Refresh attendance silently upon returning from QR screen
      if (mounted) {
        context.read<AttendanceProvider>().fetchAttendance(silent: true);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final attendanceProv = context.watch<AttendanceProvider>();
    final workspaceProv = context.watch<WorkspaceProvider>();
    final authProv = context.watch<AuthProvider>();

    final user = authProv.user;
    final placement = workspaceProv.workspace?.student;

    final studentName = user?.name ?? 'Student Trainee';
    final admissionNumber =
        placement?.admissionNumber ?? (user?.admissionNumber ?? '');
    final organizationName =
        placement?.organizationName ?? 'Tech Solutions Ltd';
    final supervisorName =
        placement?.industrySupervisor?.name ?? 'Industry Supervisor';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface.withValues(alpha: 0.92),
        elevation: 0,
        centerTitle: false,
        leading: Navigator.canPop(context)
            ? IconButton(
                icon: const Icon(Icons.arrow_back_rounded,
                    color: AppColors.onSurface),
                onPressed: () => Navigator.pop(context),
              )
            : null,
        title: Text(
          'Attendance & Verification',
          style: AppTypography.titleMd.copyWith(
            color: AppColors.onSurface,
            fontWeight: FontWeight.w700,
          ),
          overflow: TextOverflow.ellipsis,
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline_rounded,
                color: AppColors.onSurfaceVariant),
            onPressed: () => _showPolicyInfo(context),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => attendanceProv.fetchAttendance(silent: false),
        color: AppColors.primaryContainer,
        child: attendanceProv.isLoading
            ? const AttendanceSkeleton()
            : attendanceProv.errorMessage != null &&
                    attendanceProv.records.isEmpty
                ? AttendanceError(
                    message: attendanceProv.errorMessage!,
                    onRetry: () => attendanceProv.fetchAttendance(),
                  )
                : SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppDimensions.margin,
                      vertical: AppDimensions.spaceSm,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Section 1: Student Identification Card
                        StudentIdentificationCard(
                          studentName: studentName,
                          admissionNumber: admissionNumber,
                          organizationName: organizationName,
                        ),

                        const SizedBox(height: 12),

                        // Section 2: Key Attendance Stats Bento Grid
                        AttendanceBentoGrid(
                          rate: attendanceProv.rate,
                          presentCount: attendanceProv.presentCount,
                          totalCount: attendanceProv.totalRecords,
                          unexcusedCount: attendanceProv.unexcusedCount,
                          excusedCount: attendanceProv.excusedCount,
                          isCompliant: attendanceProv.isCompliant,
                        ),

                        const SizedBox(height: 14),

                        // Section 3: Today's Action Hero Module (or Verified Check-in State)
                        TodayAttendanceCard(
                          isVerified: attendanceProv.isTodayVerified,
                          todayRecord: attendanceProv.todayRecord,
                          supervisorName: supervisorName,
                          onGenerateQr: _openDynamicQrScreen,
                        ),

                        const SizedBox(height: 16),

                        // Section 4: Recent Attendance Logs Section
                        AttendanceHistorySection(
                          records: attendanceProv.filteredRecords,
                          activeFilter: attendanceProv.activeFilter,
                          allCount: attendanceProv.totalRecords,
                          verifiedCount: attendanceProv.presentCount,
                          excusedCount: attendanceProv.excusedCount,
                          onSelectFilter: (f) => attendanceProv.setFilter(f),
                        ),

                        const SizedBox(height: 16),

                        // Section 5: Institutional Compliance Callout Footer
                        const ComplianceCalloutCard(),

                        const SizedBox(height: 32),
                      ],
                    ),
                  ),
      ),
    );
  }

  void _showPolicyInfo(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Attendance Policy'),
        content: const Text(
          'University academic guidelines mandate a verified attendance threshold of at least 80% across the attachment duration.\n\n'
          'Each daily attendance check-in must be scanned on-site by your assigned industry supervisor using dynamic QR codes.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
}
