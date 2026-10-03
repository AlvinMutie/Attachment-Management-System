import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import '../../core/constants/app_typography.dart';
import '../../providers/auth_provider.dart';
import '../attendance/attendance_screen.dart';
import '../attendance/dynamic_qr_screen.dart';

/// "More" screen matching Stitch Settings & Help design
class MoreScreen extends StatelessWidget {
  const MoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        title: const Text('More'),
        backgroundColor: AppColors.surface,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(
          horizontal: AppDimensions.margin,
          vertical: AppDimensions.spaceMd,
        ),
        children: [
          // Profile card
          _ProfileCard(user: user),
          const SizedBox(height: 24),

          // Quick links section
          _SectionHeader(label: 'QUICK LINKS'),
          const SizedBox(height: 8),
          _SettingsTile(icon: Icons.person_outline, label: 'My Profile'),
          _SettingsTile(icon: Icons.business_outlined, label: 'Attachment Details'),
          _SettingsTile(icon: Icons.people_outline, label: 'My Supervisors'),
          _SettingsTile(icon: Icons.task_alt_outlined, label: 'Tasks & Deadlines'),
          _SettingsTile(icon: Icons.folder_outlined, label: 'Documents'),
          _SettingsTile(icon: Icons.campaign_outlined, label: 'Announcements'),

          const SizedBox(height: 24),

          // QR Attendance
          _SectionHeader(label: 'ATTENDANCE'),
          const SizedBox(height: 8),
          _SettingsTile(
            icon: Icons.qr_code_scanner_outlined,
            label: 'QR Attendance Check-In',
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const DynamicQrScreen()),
            ),
          ),
          _SettingsTile(
            icon: Icons.history_outlined,
            label: 'Attendance History',
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const AttendanceScreen()),
            ),
          ),

          const SizedBox(height: 24),

          // Support section
          _SectionHeader(label: 'SUPPORT & HELP'),
          const SizedBox(height: 8),
          _SettingsTile(icon: Icons.support_agent_outlined, label: 'AttachPro Technical Support'),
          _SettingsTile(icon: Icons.report_problem_outlined, label: 'Report Workplace or Safety Issue'),

          const SizedBox(height: 24),

          // Legal section
          _SectionHeader(label: 'SYSTEM & POLICIES'),
          const SizedBox(height: 8),
          _SettingsTile(icon: Icons.menu_book_outlined, label: 'Industrial Attachment Handbook', trailing: 'v2026.2'),
          _SettingsTile(icon: Icons.policy_outlined, label: 'Student Code of Industrial Conduct'),
          _AppVersionTile(),

          const SizedBox(height: 24),

          // Sign out
          _SignOutButton(),

          if (user != null) ...[
            const SizedBox(height: 8),
            Center(
              child: Text(
                'Signed in as ${user.email}',
                style: AppTypography.labelSm
                    .copyWith(color: AppColors.onSurfaceVariant),
              ),
            ),
          ],

          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

class _ProfileCard extends StatelessWidget {
  final dynamic user;
  const _ProfileCard({required this.user});

  @override
  Widget build(BuildContext context) {
    final name = user?.name ?? 'Student';
    final email = user?.email ?? '';
    final admissionNumber = user?.admissionNumber ?? '';
    final institution = user?.institution ?? user?.schoolName ?? '';

    return Container(
      padding: const EdgeInsets.all(AppDimensions.spaceMd),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(8),
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 28,
            backgroundColor: AppColors.primaryContainer,
            child: Text(
              name.isNotEmpty ? name[0].toUpperCase() : 'S',
              style: AppTypography.headlineSm
                  .copyWith(color: AppColors.onPrimary),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: AppTypography.titleMd),
                if (admissionNumber.isNotEmpty)
                  Text(admissionNumber,
                      style: AppTypography.labelMd.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w600)),
                if (email.isNotEmpty)
                  Text(email,
                      style: AppTypography.bodySm,
                      overflow: TextOverflow.ellipsis),
                if (institution.isNotEmpty)
                  Text(institution,
                      style: AppTypography.bodySm
                          .copyWith(color: AppColors.secondary),
                      overflow: TextOverflow.ellipsis),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String label;
  const _SectionHeader({required this.label});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 4),
      child: Row(
        children: [
          const Icon(Icons.circle, size: 6, color: AppColors.primary),
          const SizedBox(width: 6),
          Text(
            label,
            style: AppTypography.labelLg.copyWith(
              color: AppColors.primary,
              letterSpacing: 0.8,
            ),
          ),
        ],
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String? trailing;
  final VoidCallback? onTap;

  const _SettingsTile({
    required this.icon,
    required this.label,
    this.trailing,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 2),
      child: Material(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
        child: InkWell(
          borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
          onTap: onTap ?? () {},
          child: Padding(
            padding: const EdgeInsets.symmetric(
                horizontal: AppDimensions.spaceMd,
                vertical: AppDimensions.spaceSm + 2),
            child: Row(
              children: [
                Icon(icon, size: 20, color: AppColors.onSurfaceVariant),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(label, style: AppTypography.titleMd),
                ),
                if (trailing != null)
                  Text(trailing!,
                      style: AppTypography.labelSm
                          .copyWith(color: AppColors.onSurfaceVariant)),
                const SizedBox(width: 4),
                const Icon(Icons.chevron_right,
                    size: 18, color: AppColors.onSurfaceVariant),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _AppVersionTile extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
          horizontal: AppDimensions.spaceMd,
          vertical: AppDimensions.spaceSm + 2),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('AttachPro Mobile',
                  style: AppTypography.labelMd
                      .copyWith(fontWeight: FontWeight.w600)),
              Text('Production Environment • High Security',
                  style: AppTypography.bodySm),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.surfaceVariant,
              borderRadius:
                  BorderRadius.circular(AppDimensions.radiusFull),
            ),
            child: Text('v1.0.0 (1)',
                style: AppTypography.labelSm.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }
}

class _SignOutButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: AppDimensions.buttonHeight,
      child: OutlinedButton.icon(
        onPressed: () => _showSignOutDialog(context),
        icon: const Icon(Icons.logout, size: 20, color: AppColors.error),
        label: Text(
          'Sign Out of AttachPro',
          style:
              AppTypography.labelLg.copyWith(color: AppColors.error),
        ),
        style: OutlinedButton.styleFrom(
          backgroundColor: AppColors.surfaceContainerLow,
          side: BorderSide.none,
          shape: const StadiumBorder(),
          shadowColor: Colors.transparent,
        ),
      ),
    );
  }

  void _showSignOutDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierColor: Colors.black54,
      builder: (ctx) => Dialog(
        shape: RoundedRectangleBorder(
            borderRadius:
                BorderRadius.circular(AppDimensions.radiusXl)),
        backgroundColor: AppColors.surfaceContainerLowest,
        child: Padding(
          padding: const EdgeInsets.all(AppDimensions.spaceLg),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppColors.errorContainer,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.logout,
                    size: 24, color: AppColors.error),
              ),
              const SizedBox(height: 16),
              Text('Sign Out of Account?',
                  style: AppTypography.headlineSm),
              const SizedBox(height: 8),
              Text(
                'You will be returned to the login screen.',
                style: AppTypography.bodySm,
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(ctx),
                      style: OutlinedButton.styleFrom(
                        backgroundColor: AppColors.surfaceContainer,
                        side: BorderSide.none,
                        shape: const StadiumBorder(),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      child: Text('Cancel',
                          style: AppTypography.labelMd),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(ctx);
                        context.read<AuthProvider>().logout();
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.error,
                        foregroundColor: AppColors.onError,
                        shape: const StadiumBorder(),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      child: Text('Sign Out',
                          style: AppTypography.labelMd
                              .copyWith(color: AppColors.onError)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
