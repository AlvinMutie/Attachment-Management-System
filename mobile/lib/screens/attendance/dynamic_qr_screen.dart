import 'dart:math';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import '../../core/constants/app_typography.dart';
import '../../providers/attendance_provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/workspace_provider.dart';

/// Dynamic QR Check-in screen with countdown, expiry handling, and supervisor scan polling
class DynamicQrScreen extends StatefulWidget {
  const DynamicQrScreen({super.key});

  @override
  State<DynamicQrScreen> createState() => _DynamicQrScreenState();
}

class _DynamicQrScreenState extends State<DynamicQrScreen> {
  AttendanceProvider? _attendanceProvider;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final provider = context.read<AttendanceProvider>();
      provider.generateQrToken();
      provider.startVerificationPolling();
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _attendanceProvider = Provider.of<AttendanceProvider>(context, listen: false);
  }

  @override
  void dispose() {
    _attendanceProvider?.stopVerificationPolling();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final attendanceProv = context.watch<AttendanceProvider>();
    final workspaceProv = context.watch<WorkspaceProvider>();
    final authProv = context.watch<AuthProvider>();

    final user = authProv.user;
    final placement = workspaceProv.workspace?.student;

    final studentName = user?.name ?? 'Student Trainee';
    final admissionNumber = placement?.admissionNumber ?? (user?.admissionNumber ?? '');
    final organizationName = placement?.organizationName ?? 'Host Organization';
    final supervisorName = placement?.industrySupervisor?.name ?? 'Industry Supervisor';

    // Auto-pop or display success if today was verified while on this screen
    if (attendanceProv.isTodayVerified) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted && Navigator.canPop(context)) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Attendance verified successfully by supervisor!'),
              backgroundColor: AppColors.tertiary,
            ),
          );
          Navigator.pop(context);
        }
      });
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface.withValues(alpha: 0.92),
        elevation: 0,
        centerTitle: false,
        leading: IconButton(
          icon: const Icon(Icons.close_rounded, color: AppColors.onSurface),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Qr Scanner Verification',
          style: AppTypography.headlineSm.copyWith(
            color: AppColors.onSurface,
            fontWeight: FontWeight.w700,
            fontSize: 18,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.help_outline_rounded,
                color: AppColors.onSurfaceVariant),
            onPressed: () => _showHelpDialog(context),
          ),
        ],
      ),
      body: SafeArea(
        child: attendanceProv.isQrLoading
            ? const Center(
                child: CircularProgressIndicator(
                  color: AppColors.primaryContainer,
                ),
              )
            : attendanceProv.qrErrorMessage != null
                ? _buildErrorView(context, attendanceProv)
                : SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppDimensions.margin,
                      vertical: AppDimensions.spaceSm,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        // Live Geofence Pill
                        _buildGeofencePill(organizationName),

                        const SizedBox(height: 12),

                        // Context & Student details card
                        _buildContextCard(
                          orgName: organizationName,
                          name: studentName,
                          reg: admissionNumber,
                        ),

                        const SizedBox(height: 14),

                        // Main Dynamic QR Card (or Expired view)
                        attendanceProv.isQrExpired
                            ? _buildExpiredQrCard(context, attendanceProv)
                            : _buildActiveQrCard(context, attendanceProv),

                        const SizedBox(height: 16),

                        // Verification Protocol Steps
                        _buildProtocolSteps(supervisorName),

                        const SizedBox(height: 16),

                        // Secondary Actions
                        _buildActionButtons(context, attendanceProv),

                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
      ),
    );
  }

  Widget _buildGeofencePill(String orgName) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainer,
        borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: const BoxDecoration(
              color: AppColors.secondary,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 8),
          Flexible(
            child: Text(
              'Inside Geofence: $orgName HQ',
              style: AppTypography.labelMd.copyWith(
                color: AppColors.onSurface,
                fontWeight: FontWeight.w600,
                fontSize: 12,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          const SizedBox(width: 6),
          const Icon(
            Icons.verified_rounded,
            size: 16,
            color: AppColors.secondary,
          ),
        ],
      ),
    );
  }

  Widget _buildContextCard({
    required String orgName,
    required String name,
    required String reg,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppDimensions.spaceMd),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.corporate_fare_rounded,
                          size: 16,
                          color: AppColors.primary,
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            'INDUSTRY ATTACHMENT',
                            style: AppTypography.labelSm.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.8,
                              fontSize: 11,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      orgName,
                      style: AppTypography.titleMd.copyWith(
                        color: AppColors.onSurface,
                        fontWeight: FontWeight.w700,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerHigh,
                  borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
                ),
                child: Text(
                  'Morning IN',
                  style: AppTypography.labelSm.copyWith(
                    color: AppColors.onSurfaceVariant,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(AppDimensions.spaceSm),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerLowest,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Student Trainee',
                        style: AppTypography.labelSm.copyWith(
                          color: AppColors.onSurfaceVariant,
                          fontSize: 11,
                        ),
                      ),
                      Text(
                        name,
                        style: AppTypography.labelLg.copyWith(
                          fontWeight: FontWeight.w700,
                          fontSize: 13,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Reg Identifier',
                        style: AppTypography.labelSm.copyWith(
                          color: AppColors.onSurfaceVariant,
                          fontSize: 11,
                        ),
                      ),
                      Text(
                        reg.isNotEmpty ? reg : 'AP-2026',
                        style: AppTypography.labelLg.copyWith(
                          fontFamily: 'monospace',
                          fontWeight: FontWeight.w700,
                          fontSize: 13,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActiveQrCard(
      BuildContext context, AttendanceProvider provider) {
    final tokenData = provider.qrTokenData;
    final token = tokenData?.token ?? 'ATTENDANCE_TOKEN';
    final securityHash = tokenData?.securityHash ?? 'AP-8842-SEC-KEN-2026';
    final remainingSecs = provider.remainingSeconds;
    final minutes = (remainingSecs ~/ 60).toString().padLeft(2, '0');
    final seconds = (remainingSecs % 60).toString().padLeft(2, '0');
    final progress = (remainingSecs / 300.0).clamp(0.0, 1.0);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppDimensions.spaceLg),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppDimensions.radiusXl),
        boxShadow: const [
          BoxShadow(
            color: Color.fromRGBO(0, 0, 0, 0.04),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          // QR container with target corners
          Stack(
            alignment: Alignment.center,
            children: [
              // 4 Corner Brackets
              Positioned(
                top: 0,
                left: 0,
                child: _cornerBracket(isTop: true, isLeft: true),
              ),
              Positioned(
                top: 0,
                right: 0,
                child: _cornerBracket(isTop: true, isLeft: false),
              ),
              Positioned(
                bottom: 0,
                left: 0,
                child: _cornerBracket(isTop: false, isLeft: true),
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: _cornerBracket(isTop: false, isLeft: false),
              ),

              // QR Box
              Container(
                margin: const EdgeInsets.all(12),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerLow,
                  borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                ),
                child: QrImageView(
                  data: token,
                  version: QrVersions.auto,
                  size: min(MediaQuery.of(context).size.width * 0.52, 220.0),
                  backgroundColor: AppColors.surfaceContainerLow,
                  eyeStyle: const QrEyeStyle(
                    eyeShape: QrEyeShape.square,
                    color: AppColors.onSurface,
                  ),
                  dataModuleStyle: const QrDataModuleStyle(
                    dataModuleShape: QrDataModuleShape.square,
                    color: AppColors.onSurface,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Security Hash identification
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainer,
              borderRadius: BorderRadius.circular(6),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.lock_rounded,
                    size: 14, color: AppColors.onSurfaceVariant),
                const SizedBox(width: 6),
                Text(
                  securityHash,
                  style: AppTypography.labelSm.copyWith(
                    fontFamily: 'monospace',
                    color: AppColors.onSurfaceVariant,
                    letterSpacing: 0.8,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Countdown pill
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerHigh,
              borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.sync_rounded,
                  size: 18,
                  color: AppColors.primary,
                ),
                const SizedBox(width: 8),
                Text(
                  'Expires in ',
                  style: AppTypography.labelLg.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  '$minutes:$seconds',
                  style: AppTypography.labelLg.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700,
                    fontFamily: 'monospace',
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 10),

          // Animated progress bar
          SizedBox(
            width: 200,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: progress,
                minHeight: 5,
                backgroundColor: AppColors.surfaceContainer,
                valueColor: const AlwaysStoppedAnimation<Color>(
                  AppColors.primary,
                ),
              ),
            ),
          ),

          const SizedBox(height: 8),

          Text(
            'Code auto-refreshes every 5 minutes to prevent remote proxy check-ins.',
            style: AppTypography.bodySm.copyWith(
              color: AppColors.onSurfaceVariant,
              fontSize: 11,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildExpiredQrCard(
      BuildContext context, AttendanceProvider provider) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppDimensions.spaceLg),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppDimensions.radiusXl),
        boxShadow: const [
          BoxShadow(
            color: Color.fromRGBO(0, 0, 0, 0.04),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          // Header row with expired badge
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  'Security Token #EXP',
                  style: AppTypography.labelSm.copyWith(
                    color: AppColors.outline,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.errorContainer,
                  borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.error_outline_rounded,
                      size: 14,
                      color: AppColors.onErrorContainer,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '00:00 — Expired',
                      style: AppTypography.labelSm.copyWith(
                        color: AppColors.onErrorContainer,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Blurred QR Placeholder with Expired Overlay
          Container(
            width: 220,
            height: 220,
            decoration: BoxDecoration(
              color: AppColors.surfaceContainer,
              borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                Opacity(
                  opacity: 0.15,
                  child: const Icon(
                    Icons.qr_code_2_rounded,
                    size: 180,
                    color: AppColors.onSurface,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.inverseSurface.withValues(alpha: 0.72),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: const BoxDecoration(
                          color: AppColors.surfaceContainerLowest,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.timer_off_rounded,
                          color: AppColors.error,
                          size: 26,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'CODE EXPIRED',
                        style: AppTypography.titleMd.copyWith(
                          color: AppColors.surfaceContainerLowest,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.0,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Session invalidated automatically',
                        style: AppTypography.labelSm.copyWith(
                          color: AppColors.surfaceVariant,
                          fontSize: 11,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Timeout Explainer Card
          Container(
            padding: const EdgeInsets.all(AppDimensions.spaceSm + 4),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainer,
              borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(
                  Icons.update_disabled_rounded,
                  size: 22,
                  color: AppColors.secondary,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'QR Code Timed Out',
                        style: AppTypography.titleMd.copyWith(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        'For institutional integrity, tokens automatically expire after 5 minutes. Tap below to generate a new QR.',
                        style: AppTypography.bodySm.copyWith(
                          color: AppColors.onSurfaceVariant,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Generate New QR Button
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton.icon(
              onPressed: () => provider.generateQrToken(),
              icon: const Icon(Icons.sync_rounded, size: 20),
              label: const Text('Generate New QR Code'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryContainer,
                foregroundColor: AppColors.onPrimary,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProtocolSteps(String supervisor) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppDimensions.spaceMd),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  'Verification Protocol',
                  style: AppTypography.labelLg.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                'Stage 1 of 3',
                style: AppTypography.labelSm.copyWith(
                  color: AppColors.secondary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _protocolStep(
            number: '1',
            title: 'Present this token to Industry Supervisor',
            subtitle: 'Assigned Mentor: $supervisor',
            isActive: true,
          ),
          const SizedBox(height: 10),
          _protocolStep(
            number: '2',
            title: 'Supervisor scans via AttachPro Scanner',
            subtitle: 'Confirms physical workstation presence',
            isActive: false,
          ),
          const SizedBox(height: 10),
          _protocolStep(
            number: '3',
            title: 'Immediate University Registry Sync',
            subtitle: 'Cryptographically signed & stored in academic log',
            isActive: false,
          ),
        ],
      ),
    );
  }

  Widget _protocolStep({
    required String number,
    required String title,
    required String subtitle,
    required bool isActive,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            color: isActive
                ? AppColors.primary
                : AppColors.surfaceContainerHigh,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              number,
              style: AppTypography.labelSm.copyWith(
                color: isActive
                    ? AppColors.onPrimary
                    : AppColors.onSurfaceVariant,
                fontWeight: FontWeight.w700,
                fontSize: 11,
              ),
            ),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: AppTypography.labelMd.copyWith(
                  fontWeight: FontWeight.w600,
                  fontSize: 12,
                ),
              ),
              Text(
                subtitle,
                style: AppTypography.bodySm.copyWith(
                  color: AppColors.onSurfaceVariant,
                  fontSize: 11,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildActionButtons(
      BuildContext context, AttendanceProvider provider) {
    return Column(
      children: [
        if (!provider.isQrExpired)
          SizedBox(
            width: double.infinity,
            height: 48,
            child: OutlinedButton.icon(
              onPressed: () => provider.refreshQrToken(),
              icon: const Icon(Icons.refresh_rounded, size: 20),
              label: const Text('Refresh QR Now'),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.primary,
                side: const BorderSide(color: AppColors.outlineVariant),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
                ),
              ),
            ),
          ),
        const SizedBox(height: 8),
        TextButton.icon(
          onPressed: () => _showManualFallbackInfo(context),
          icon: const Icon(Icons.dialpad_rounded, size: 16),
          label: const Text('Having trouble scanning? Supervisor Verification Info'),
          style: TextButton.styleFrom(
            foregroundColor: AppColors.secondary,
            textStyle: AppTypography.labelMd.copyWith(fontSize: 12),
          ),
        ),
      ],
    );
  }

  Widget _buildErrorView(
      BuildContext context, AttendanceProvider provider) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppDimensions.margin),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.warning_amber_rounded,
                size: 48, color: AppColors.error),
            const SizedBox(height: 12),
            Text(
              'Failed to Generate QR Token',
              style: AppTypography.titleMd,
            ),
            const SizedBox(height: 6),
            Text(
              provider.qrErrorMessage ?? 'Please check your connection and retry.',
              style: AppTypography.bodySm.copyWith(
                color: AppColors.onSurfaceVariant,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () => provider.generateQrToken(),
              icon: const Icon(Icons.refresh_rounded, size: 18),
              label: const Text('Retry Generation'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryContainer,
                foregroundColor: AppColors.onPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _cornerBracket({required bool isTop, required bool isLeft}) {
    const size = 16.0;
    const stroke = 3.0;
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        border: Border(
          top: isTop
              ? const BorderSide(color: AppColors.primary, width: stroke)
              : BorderSide.none,
          bottom: !isTop
              ? const BorderSide(color: AppColors.primary, width: stroke)
              : BorderSide.none,
          left: isLeft
              ? const BorderSide(color: AppColors.primary, width: stroke)
              : BorderSide.none,
          right: !isLeft
              ? const BorderSide(color: AppColors.primary, width: stroke)
              : BorderSide.none,
        ),
      ),
    );
  }

  void _showHelpDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Dynamic QR Verification'),
        content: const Text(
          'Your dynamic QR code is a secure, temporary token verified by your site supervisor. '
          'Tokens expire after 5 minutes to prevent remote proxy check-ins.\n\n'
          'Once your supervisor scans this QR with their AttachPro Scanner, your attendance is immediately registered in the university system.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Understood'),
          ),
        ],
      ),
    );
  }

  void _showManualFallbackInfo(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Supervisor Verification'),
        content: const Text(
          'If camera or scanning fails, ensure your screen brightness is raised.\n\n'
          'Alternatively, your supervisor can mark your attendance directly through their AttachPro supervisor dashboard.',
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
