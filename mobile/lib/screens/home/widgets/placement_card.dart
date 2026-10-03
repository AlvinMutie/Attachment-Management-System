import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../models/workspace_model.dart';

/// Placement details card: host org, dates, supervisors
class PlacementCard extends StatelessWidget {
  final StudentProfile student;
  final DateMetrics dates;

  const PlacementCard({
    super.key,
    required this.student,
    required this.dates,
  });

  void _showDetailsSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _PlacementDetailsSheet(student: student, dates: dates),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.surfaceContainerLowest,
      borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
      elevation: 1,
      shadowColor: Colors.black.withAlpha(10),
      child: InkWell(
        onTap: () => _showDetailsSheet(context),
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
        child: Padding(
          padding: const EdgeInsets.all(AppDimensions.spaceMd),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Organization row
              student.hasOrganization
                  ? _OrganizationRow(student: student)
                  : _NoOrganizationRow(),

              const SizedBox(height: AppDimensions.spaceSm),

              // Date range row
              if (dates.hasDateRange) _DateRangeRow(dates: dates),

              // Supervisors
              if (student.hasIndustrySupervisor || student.hasUniversitySupervisor)
                Padding(
                  padding: const EdgeInsets.only(top: AppDimensions.spaceXs),
                  child: _SupervisorsPanel(student: student),
                ),

              if (!student.hasIndustrySupervisor && !student.hasUniversitySupervisor)
                Padding(
                  padding:
                      const EdgeInsets.only(top: AppDimensions.spaceSm),
                  child: _NoSupervisorsNote(),
                ),

              // Action link
              const SizedBox(height: AppDimensions.spaceXs),
              _ActionLink(onTap: () => _showDetailsSheet(context)),
            ],
          ),
        ),
      ),
    );
  }
}

class _OrganizationRow extends StatelessWidget {
  final StudentProfile student;
  const _OrganizationRow({required this.student});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: AppColors.surfaceContainer,
            borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
          ),
          child: const Icon(
            Icons.apartment_rounded,
            size: 26,
            color: AppColors.primary,
          ),
        ),
        const SizedBox(width: AppDimensions.spaceSm),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'HOST ORGANIZATION',
                style: AppTypography.labelSm.copyWith(
                  color: AppColors.secondary,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.8,
                ),
              ),
              Text(
                student.organizationName!,
                style: AppTypography.headlineSm,
                overflow: TextOverflow.ellipsis,
                maxLines: 1,
              ),
              if (student.department != null)
                Text(
                  student.department!,
                  style: AppTypography.bodySm,
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                ),
            ],
          ),
        ),
        const SizedBox(width: 4),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
          decoration: BoxDecoration(
            color: AppColors.surfaceContainerHigh,
            borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
          ),
          child: Text(
            'On-site',
            style: AppTypography.labelSm.copyWith(
              color: AppColors.onSurfaceVariant,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }
}

class _NoOrganizationRow extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: AppColors.surfaceContainerLow,
            borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
          ),
          child: const Icon(
            Icons.apartment_outlined,
            size: 24,
            color: AppColors.onSurfaceVariant,
          ),
        ),
        const SizedBox(width: AppDimensions.spaceSm),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'HOST ORGANIZATION',
                style: AppTypography.labelSm.copyWith(
                  color: AppColors.onSurfaceVariant,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.8,
                ),
              ),
              Text(
                'Not yet assigned',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: AppTypography.headlineSm.copyWith(
                  color: AppColors.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _DateRangeRow extends StatelessWidget {
  final DateMetrics dates;
  const _DateRangeRow({required this.dates});

  String _formatDateShort(String? dateStr) {
    if (dateStr == null) return '—';
    try {
      final d = DateTime.parse(dateStr);
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ];
      return '${d.day.toString().padLeft(2, '0')} ${months[d.month - 1]} ${d.year}';
    } catch (_) {
      return dateStr;
    }
  }

  @override
  Widget build(BuildContext context) {
    final weekLabel = dates.totalWeeks > 0
        ? 'Week ${dates.currentWeek} of ${dates.totalWeeks}'
        : '';

    return Container(
      padding: const EdgeInsets.symmetric(
          horizontal: AppDimensions.spaceSm, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
      ),
      child: Row(
        children: [
          const Icon(Icons.date_range_outlined,
              size: 18, color: AppColors.secondary),
          const SizedBox(width: AppDimensions.spaceXs),
          Expanded(
            child: Text(
              '${_formatDateShort(dates.startDate)} — ${_formatDateShort(dates.endDate)}',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: AppTypography.bodySm.copyWith(
                color: AppColors.onSurface,
              ),
            ),
          ),
          if (weekLabel.isNotEmpty) ...[
            const SizedBox(width: 4),
            Flexible(
              child: Text(
                weekLabel,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: AppTypography.labelSm.copyWith(
                  color: AppColors.onSurfaceVariant,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _SupervisorsPanel extends StatelessWidget {
  final StudentProfile student;
  const _SupervisorsPanel({required this.student});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (student.hasIndustrySupervisor)
          _SupervisorRow(
            supervisor: student.industrySupervisor!,
            role: 'Industry Supervisor',
            avatarBg: AppColors.secondaryFixed,
            avatarFg: AppColors.onSecondaryFixed,
            isIndustry: true,
          ),
        if (student.hasUniversitySupervisor)
          Padding(
            padding: EdgeInsets.only(
              top: student.hasIndustrySupervisor ? 4 : 0,
            ),
            child: _SupervisorRow(
              supervisor: student.universitySupervisor!,
              role: 'University Supervisor',
              avatarBg: AppColors.primaryFixed,
              avatarFg: AppColors.onPrimaryFixed,
              isIndustry: false,
            ),
          ),
      ],
    );
  }
}

class _SupervisorRow extends StatelessWidget {
  final UserRef supervisor;
  final String role;
  final Color avatarBg;
  final Color avatarFg;
  final bool isIndustry;

  const _SupervisorRow({
    required this.supervisor,
    required this.role,
    required this.avatarBg,
    required this.avatarFg,
    required this.isIndustry,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          // Avatar with initials
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(
              color: avatarBg,
              shape: BoxShape.circle,
            ),
            alignment: Alignment.center,
            child: Text(
              supervisor.initials,
              style: AppTypography.labelSm.copyWith(
                color: avatarFg,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          const SizedBox(width: AppDimensions.spaceXs),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  supervisor.name,
                  style: AppTypography.labelMd,
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                ),
                Text(
                  role,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTypography.labelSm.copyWith(
                    color: AppColors.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
          // Contact action
          if (supervisor.email != null && supervisor.email!.isNotEmpty)
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: AppColors.surfaceContainer,
                shape: BoxShape.circle,
              ),
              child: Icon(
                isIndustry ? Icons.call_outlined : Icons.mail_outlined,
                size: 16,
                color: AppColors.primary,
              ),
            ),
        ],
      ),
    );
  }
}

class _NoSupervisorsNote extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppDimensions.spaceXs),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
      ),
      child: Row(
        children: [
          const Icon(Icons.people_outline,
              size: 18, color: AppColors.onSurfaceVariant),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              'No supervisors assigned yet',
              style: AppTypography.bodySm.copyWith(
                color: AppColors.onSurfaceVariant,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ActionLink extends StatelessWidget {
  final VoidCallback? onTap;
  const _ActionLink({this.onTap});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: TextButton.icon(
        onPressed: onTap,
        icon: const Icon(Icons.info_outline_rounded, size: 16),
        label: const Text(
          'View Placement Details & Contacts',
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primary,
          textStyle: AppTypography.labelMd.copyWith(fontWeight: FontWeight.w600),
          padding: const EdgeInsets.symmetric(vertical: 4),
        ),
      ),
    );
  }
}

class _PlacementDetailsSheet extends StatelessWidget {
  final StudentProfile student;
  final DateMetrics dates;

  const _PlacementDetailsSheet({
    required this.student,
    required this.dates,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.85,
      ),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        top: false,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppDimensions.spaceLg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              // Grab handle
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.outlineVariant,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Title
              Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppColors.primaryContainer,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.business_rounded, color: AppColors.onPrimary, size: 22),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Attachment Profile', style: AppTypography.headlineSm),
                        Text(
                          student.organizationName ?? 'Host Organization',
                          style: AppTypography.bodySm.copyWith(color: AppColors.onSurfaceVariant),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Organization Details Card
              Container(
                padding: const EdgeInsets.all(AppDimensions.spaceMd),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerLowest,
                  borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                  border: Border.all(color: AppColors.outlineVariant.withAlpha(80)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('HOST ORGANIZATION', style: AppTypography.labelSm.copyWith(color: AppColors.primary, letterSpacing: 0.8)),
                    const SizedBox(height: 8),
                    _detailRow(Icons.apartment_rounded, 'Company', student.organizationName ?? 'Not specified'),
                    if (student.department != null) ...[
                      const Divider(height: 16),
                      _detailRow(Icons.account_tree_outlined, 'Department', student.department!),
                    ],
                    if (student.organizationAddress != null) ...[
                      const Divider(height: 16),
                      _detailRow(Icons.location_on_outlined, 'Location', student.organizationAddress!),
                    ],
                    if (student.contactPerson != null) ...[
                      const Divider(height: 16),
                      _detailRow(Icons.person_pin_circle_outlined, 'Contact Person', student.contactPerson!),
                    ],
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Supervisors Card
              Container(
                padding: const EdgeInsets.all(AppDimensions.spaceMd),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerLowest,
                  borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                  border: Border.all(color: AppColors.outlineVariant.withAlpha(80)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('ASSIGNED SUPERVISORS', style: AppTypography.labelSm.copyWith(color: AppColors.primary, letterSpacing: 0.8)),
                    const SizedBox(height: 12),
                    if (student.industrySupervisor != null)
                      _supervisorContactCard(
                        name: student.industrySupervisor!.name,
                        email: student.industrySupervisor!.email,
                        role: 'Industry Mentor / Supervisor',
                        icon: Icons.factory_outlined,
                        color: AppColors.secondary,
                      ),
                    if (student.industrySupervisor != null && student.universitySupervisor != null)
                      const SizedBox(height: 12),
                    if (student.universitySupervisor != null)
                      _supervisorContactCard(
                        name: student.universitySupervisor!.name,
                        email: student.universitySupervisor!.email,
                        role: 'Academic Liaison / Faculty Supervisor',
                        icon: Icons.school_outlined,
                        color: AppColors.primary,
                      ),
                    if (student.industrySupervisor == null && student.universitySupervisor == null)
                      Text('No supervisors currently assigned to your record.', style: AppTypography.bodySm),
                  ],
                ),
              ),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _detailRow(IconData icon, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 18, color: AppColors.onSurfaceVariant),
        const SizedBox(width: 8),
        Text('$label: ', style: AppTypography.labelMd.copyWith(color: AppColors.onSurfaceVariant)),
        Expanded(
          child: Text(
            value,
            style: AppTypography.bodyMd.copyWith(fontWeight: FontWeight.w600),
            overflow: TextOverflow.ellipsis,
            maxLines: 2,
          ),
        ),
      ],
    );
  }

  Widget _supervisorContactCard({
    required String name,
    String? email,
    required String role,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(AppDimensions.spaceSm),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 20,
            backgroundColor: color.withAlpha(30),
            child: Icon(icon, size: 20, color: color),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: AppTypography.labelLg.copyWith(fontWeight: FontWeight.w700), maxLines: 1, overflow: TextOverflow.ellipsis),
                Text(role, style: AppTypography.labelSm.copyWith(color: AppColors.onSurfaceVariant), maxLines: 1, overflow: TextOverflow.ellipsis),
                if (email != null && email.isNotEmpty)
                  Text(email, style: AppTypography.bodySm.copyWith(color: color), maxLines: 1, overflow: TextOverflow.ellipsis),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
