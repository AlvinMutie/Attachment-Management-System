import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../models/workspace_model.dart';

/// Recent Activity section showing latest logbook/attendance events from deadlines
class RecentActivitySection extends StatelessWidget {
  final List<DeadlineItem> deadlines;
  final LogbooksSummary logbooks;
  final AttendanceStats attendance;

  const RecentActivitySection({
    super.key,
    required this.deadlines,
    required this.logbooks,
    required this.attendance,
  });

  List<_ActivityEntry> _buildEntries() {
    final entries = <_ActivityEntry>[];

    // Deadlines from backend calculateDeadlines()
    for (final d in deadlines) {
      if (d.status == 'COMPLETED') continue;
      final overdue = d.isOverdue;
      final days = d.daysRemaining;
      entries.add(_ActivityEntry(
        icon: overdue ? Icons.event_busy_outlined : Icons.event_outlined,
        iconBg: overdue ? AppColors.errorContainer : AppColors.primaryFixed,
        iconFg: overdue ? AppColors.onErrorContainer : AppColors.onPrimaryFixed,
        title: d.title,
        subtitle: days == null
            ? 'Upcoming deadline'
            : overdue
                ? 'Overdue by ${days.abs()} day${days.abs() == 1 ? '' : 's'}'
                : days == 0
                    ? 'Due today'
                    : 'Due in $days day${days == 1 ? '' : 's'}',
        meta: overdue ? 'Overdue' : (d.status == 'DUE_SOON' ? 'Due Soon' : 'Upcoming'),
        metaColor: overdue ? AppColors.error : AppColors.primary,
        metaIcon: overdue ? Icons.error_outline : Icons.schedule_rounded,
      ));
    }

    // Synthesize activity from real data
    if (logbooks.approved > 0) {
      entries.add(_ActivityEntry(
        icon: Icons.done_all_rounded,
        iconBg: AppColors.tertiaryFixed,
        iconFg: AppColors.onTertiaryFixed,
        title: 'Logbook Approved',
        subtitle: '${logbooks.approved} logbook${logbooks.approved > 1 ? 's' : ''} have been approved',
        meta: 'Approved',
        metaColor: AppColors.tertiary,
        metaIcon: Icons.check_circle_outline,
      ));
    }

    if (logbooks.pending > 0) {
      entries.add(_ActivityEntry(
        icon: Icons.hourglass_top_rounded,
        iconBg: AppColors.secondaryFixed,
        iconFg: AppColors.onSecondaryFixed,
        title: 'Logbook Pending Review',
        subtitle: '${logbooks.pending} logbook${logbooks.pending > 1 ? 's' : ''} awaiting supervisor review',
        meta: 'Pending',
        metaColor: AppColors.secondary,
        metaIcon: Icons.hourglass_top_rounded,
      ));
    }

    if (logbooks.rejected > 0) {
      entries.add(_ActivityEntry(
        icon: Icons.edit_note_rounded,
        iconBg: AppColors.errorContainer,
        iconFg: AppColors.onErrorContainer,
        title: 'Revision Requested',
        subtitle: '${logbooks.rejected} logbook${logbooks.rejected > 1 ? 's' : ''} require revision',
        meta: 'Action Needed',
        metaColor: AppColors.error,
        metaIcon: Icons.error_outline,
      ));
    }

    if (attendance.totalRecords > 0) {
      entries.add(_ActivityEntry(
        icon: Icons.how_to_reg_outlined,
        iconBg: AppColors.surfaceVariant,
        iconFg: AppColors.onSurfaceVariant,
        title: 'Attendance Logged',
        subtitle: '${attendance.presentCount + attendance.lateCount} of ${attendance.totalRecords} days present',
        meta: '${attendance.rate}% Rate',
        metaColor: attendance.isCompliant ? AppColors.secondary : AppColors.error,
        metaIcon: attendance.isCompliant
            ? Icons.check_circle_outline
            : Icons.warning_amber_outlined,
      ));
    }

    return entries;
  }

  @override
  Widget build(BuildContext context) {
    final entries = _buildEntries();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Recent Activity', style: AppTypography.titleMd),
            TextButton(
              onPressed: null,
              style: TextButton.styleFrom(
                foregroundColor: AppColors.primary,
                padding: EdgeInsets.zero,
                minimumSize: Size.zero,
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                textStyle: AppTypography.labelMd
                    .copyWith(fontWeight: FontWeight.w600),
              ),
              child: const Text('View all'),
            ),
          ],
        ),
        const SizedBox(height: AppDimensions.spaceSm),
        entries.isEmpty
            ? _EmptyActivity()
            : Container(
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerLowest,
                  borderRadius:
                      BorderRadius.circular(AppDimensions.radiusLg),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withAlpha(8),
                      blurRadius: 4,
                    ),
                  ],
                ),
                child: Column(
                  children: List.generate(entries.length, (i) {
                    final entry = entries[i];
                    final isLast = i == entries.length - 1;
                    return Column(
                      children: [
                        _ActivityRow(entry: entry),
                        if (!isLast)
                          Divider(
                            height: 1,
                            indent: 56,
                            color: AppColors.outlineVariant.withAlpha(80),
                          ),
                      ],
                    );
                  }),
                ),
              ),
      ],
    );
  }
}

class _EmptyActivity extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppDimensions.spaceLg),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(8),
            blurRadius: 4,
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.history_rounded,
              size: 22, color: AppColors.onSurfaceVariant),
          const SizedBox(width: 12),
          Text(
            'No recent activity yet.',
            style: AppTypography.bodyMd.copyWith(
              color: AppColors.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }
}

class _ActivityRow extends StatelessWidget {
  final _ActivityEntry entry;
  const _ActivityRow({required this.entry});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppDimensions.spaceMd,
        vertical: AppDimensions.spaceSm,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: entry.iconBg,
              shape: BoxShape.circle,
            ),
            child: Icon(entry.icon, size: 16, color: entry.iconFg),
          ),
          const SizedBox(width: AppDimensions.spaceSm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(entry.title,
                    style: AppTypography.labelMd,
                    overflow: TextOverflow.ellipsis),
                Text(entry.subtitle,
                    style: AppTypography.bodySm,
                    overflow: TextOverflow.ellipsis,
                    maxLines: 2),
                const SizedBox(height: 2),
                Row(
                  children: [
                    Icon(entry.metaIcon,
                        size: 12, color: entry.metaColor),
                    const SizedBox(width: 2),
                    Text(
                      entry.meta,
                      style: AppTypography.labelSm.copyWith(
                        color: entry.metaColor,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ActivityEntry {
  final IconData icon;
  final Color iconBg;
  final Color iconFg;
  final String title;
  final String subtitle;
  final String meta;
  final Color metaColor;
  final IconData metaIcon;

  const _ActivityEntry({
    required this.icon,
    required this.iconBg,
    required this.iconFg,
    required this.title,
    required this.subtitle,
    required this.meta,
    required this.metaColor,
    required this.metaIcon,
  });
}
