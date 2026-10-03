import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../models/logbook_model.dart';

enum EntryVisualStatus {
  approved,
  underReview,
  needsRevision,
  draft,
  scheduled,
}

/// Section 4: Daily Entry Timeline Card matching Stitch design exactly
class DailyEntryCard extends StatelessWidget {
  final String dayName; // 'monday', 'tuesday', ...
  final int dayOffset; // 0..4
  final DateTime? date;
  final int? globalDayNumber;
  final DailyLogEntry? entry;
  final String parentLogbookStatus; // 'approved', 'pending', 'rejected', 'draft'
  final String? supervisorComment;
  final VoidCallback onEdit;

  const DailyEntryCard({
    super.key,
    required this.dayName,
    required this.dayOffset,
    this.date,
    this.globalDayNumber,
    this.entry,
    required this.parentLogbookStatus,
    this.supervisorComment,
    required this.onEdit,
  });

  EntryVisualStatus get _visualStatus {
    if (entry == null || !entry!.hasContent) {
      return EntryVisualStatus.scheduled;
    }
    if (entry!.statusOverride != null) {
      final s = entry!.statusOverride!.toLowerCase();
      if (s == 'approved') return EntryVisualStatus.approved;
      if (s == 'rejected') return EntryVisualStatus.needsRevision;
      if (s == 'pending') return EntryVisualStatus.underReview;
      if (s == 'draft') return EntryVisualStatus.draft;
    }
    final parent = parentLogbookStatus.toLowerCase();
    if (parent == 'approved') return EntryVisualStatus.approved;
    if (parent == 'rejected') return EntryVisualStatus.needsRevision;
    if (parent == 'pending') return EntryVisualStatus.underReview;
    return EntryVisualStatus.draft;
  }

  String _formatDateHeader() {
    final capDay = dayName[0].toUpperCase() + dayName.substring(1);
    final dayNum = globalDayNumber != null ? 'Day $globalDayNumber • ' : '';
    if (date != null) {
      final dateStr = DateFormat('EEEE, d MMM').format(date!);
      return '$dayNum$dateStr'.toUpperCase();
    }
    return '$dayNum$capDay'.toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    final status = _visualStatus;
    final isNeedsRevision = status == EntryVisualStatus.needsRevision;
    final isScheduled = status == EntryVisualStatus.scheduled;

    return Material(
      color: isScheduled
          ? AppColors.surfaceContainerLow.withAlpha(160)
          : AppColors.surfaceContainerLowest,
      borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
      elevation: isScheduled ? 0 : 1,
      shadowColor: Colors.black.withAlpha(8),
      child: InkWell(
        onTap: () {
          if (isScheduled) return;
          if (status == EntryVisualStatus.draft || isNeedsRevision) {
            onEdit();
          } else {
            _showDetails(context);
          }
        },
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
            border: isNeedsRevision
                ? const Border(
                    left: BorderSide(color: AppColors.error, width: 4),
                  )
                : null,
          ),
          child: Padding(
            padding: const EdgeInsets.all(AppDimensions.spaceMd),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Row: Day & Date header + Status Badge
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _formatDateHeader(),
                            style: AppTypography.labelSm.copyWith(
                              color: isNeedsRevision
                                  ? AppColors.error
                                  : AppColors.outline,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 0.6,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 3),
                          Text(
                            _entryTitle(status),
                            style: AppTypography.titleMd.copyWith(
                              color: isScheduled
                                  ? AppColors.onSurfaceVariant
                                  : AppColors.onSurface,
                              fontWeight:
                                  isScheduled ? FontWeight.w500 : FontWeight.w700,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: AppDimensions.spaceSm),
                    _StatusBadge(status: status),
                  ],
                ),

                const SizedBox(height: 8),

            // Meta row (Hours pill + Category pill or Scheduled note)
            if (isScheduled)
              Row(
                children: [
                  const Icon(Icons.pending_actions,
                      size: 16, color: AppColors.outline),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      'Planned for end of sprint cycle',
                      style: AppTypography.bodySm.copyWith(
                        color: AppColors.outline,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              )
            else if (status == EntryVisualStatus.draft)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Flexible(
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.timer_outlined,
                            size: 16, color: AppColors.outline),
                        const SizedBox(width: 4),
                        Flexible(
                          child: Text(
                            '${entry?.hours ?? 4.0} hrs recorded so far today',
                            style: AppTypography.bodySm.copyWith(
                              color: AppColors.onSurfaceVariant,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  InkWell(
                    onTap: onEdit,
                    borderRadius: BorderRadius.circular(8),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: AppColors.primaryFixed,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'Continue Editing',
                            style: AppTypography.labelMd.copyWith(
                              color: AppColors.onPrimaryFixed,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Icon(Icons.edit_outlined,
                              size: 14, color: AppColors.onPrimaryFixed),
                        ],
                      ),
                    ),
                  ),
                ],
              )
            else
              Row(
                children: [
                  // Hours Pill
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceContainerLow,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.schedule,
                          size: 14,
                          color: isNeedsRevision
                              ? AppColors.error
                              : status == EntryVisualStatus.underReview
                                  ? AppColors.secondary
                                  : AppColors.primary,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '${entry?.hours ?? 8.0} hrs',
                          style: AppTypography.labelSm.copyWith(
                            color: AppColors.onSurface,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  // Category Pill
                  Expanded(
                    child: Row(
                      children: [
                        Icon(
                          _categoryIcon(entry?.category ?? ''),
                          size: 14,
                          color: AppColors.onSurfaceVariant,
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            entry?.category ?? 'Industrial Attachment',
                            style: AppTypography.bodySm.copyWith(
                              color: AppColors.onSurfaceVariant,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

            // Under review info line
            if (status == EntryVisualStatus.underReview) ...[
              const SizedBox(height: 6),
              Row(
                children: [
                  const Icon(Icons.info_outline,
                      size: 14, color: AppColors.secondary),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      'Submitted • Awaiting supervisor review',
                      style: AppTypography.labelSm.copyWith(
                        color: AppColors.onSurfaceVariant,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ],

            // Supervisor feedback box for Approved entries
            if (status == EntryVisualStatus.approved &&
                parentLogbookStatus.toLowerCase() == 'approved' &&
                supervisorComment != null &&
                supervisorComment!.trim().isNotEmpty) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(AppDimensions.spaceSm),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerLow,
                  borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(
                      Icons.rate_review,
                      size: 18,
                      color: AppColors.tertiary,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '"${supervisorComment!.trim()}"',
                            style: AppTypography.bodySm.copyWith(
                              fontStyle: FontStyle.italic,
                              color: AppColors.onSurfaceVariant,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '— Industry Supervisor',
                            style: AppTypography.labelSm.copyWith(
                              color: AppColors.onSurface,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],

            // Supervisor Revision Prompt Note for Rejected entries
            if (isNeedsRevision) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(AppDimensions.spaceSm),
                decoration: BoxDecoration(
                  color: AppColors.errorContainer.withAlpha(100),
                  borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.feedback_outlined,
                          size: 16,
                          color: AppColors.error,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'Supervisor Feedback',
                          style: AppTypography.labelMd.copyWith(
                            color: AppColors.onErrorContainer,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      supervisorComment != null && supervisorComment!.isNotEmpty
                          ? '"$supervisorComment"'
                          : '"Please expand on your engineering activities and safety procedures before sign-off."',
                      style: AppTypography.bodySm.copyWith(
                        color: AppColors.onSurface,
                      ),
                    ),
                    const SizedBox(height: 6),
                    InkWell(
                      onTap: onEdit,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'Edit and Resubmit',
                            style: AppTypography.labelMd.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Icon(
                            Icons.arrow_forward,
                            size: 16,
                            color: AppColors.primary,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    ),
  ),
);
  }

  void _showDetails(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _DailyEntryDetailSheet(
        dayName: dayName,
        date: date,
        globalDayNumber: globalDayNumber,
        entry: entry,
        status: _visualStatus,
        supervisorComment: supervisorComment,
        onEdit: onEdit,
      ),
    );
  }

  String _entryTitle(EntryVisualStatus status) {
    if (entry != null && entry!.title.isNotEmpty) {
      return entry!.title;
    }
    if (status == EntryVisualStatus.scheduled) {
      return 'Sprint demo & weekly retrospective';
    }
    return '${dayName[0].toUpperCase()}${dayName.substring(1)} Tasks';
  }

  IconData _categoryIcon(String category) {
    final lower = category.toLowerCase();
    if (lower.contains('api') || lower.contains('endpoint')) {
      return Icons.api;
    }
    if (lower.contains('database') || lower.contains('schema')) {
      return Icons.data_object_rounded;
    }
    if (lower.contains('qa') || lower.contains('test') || lower.contains('security')) {
      return Icons.verified_user_outlined;
    }
    if (lower.contains('ui') || lower.contains('front')) {
      return Icons.layers_outlined;
    }
    return Icons.code_rounded;
  }
}

class _StatusBadge extends StatelessWidget {
  final EntryVisualStatus status;

  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;
    IconData icon;
    String label;

    switch (status) {
      case EntryVisualStatus.approved:
        bg = AppColors.tertiaryFixed;
        fg = AppColors.onTertiaryFixed;
        icon = Icons.check_circle;
        label = 'Reviewed & Approved';
        break;
      case EntryVisualStatus.underReview:
        bg = AppColors.secondaryFixed;
        fg = AppColors.onSecondaryFixed;
        icon = Icons.hourglass_top_rounded;
        label = 'Under Review';
        break;
      case EntryVisualStatus.needsRevision:
        bg = AppColors.errorContainer;
        fg = AppColors.onErrorContainer;
        icon = Icons.error_outline;
        label = 'Needs Revision';
        break;
      case EntryVisualStatus.draft:
        bg = AppColors.surfaceContainerHighest;
        fg = AppColors.onSurfaceVariant;
        icon = Icons.edit_note;
        label = 'Draft';
        break;
      case EntryVisualStatus.scheduled:
        bg = AppColors.surfaceContainerHigh;
        fg = AppColors.outline;
        icon = Icons.event_outlined;
        label = 'Scheduled';
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: fg),
          const SizedBox(width: 4),
          Text(
            label,
            style: AppTypography.labelSm.copyWith(
              color: fg,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _DailyEntryDetailSheet extends StatelessWidget {
  final String dayName;
  final DateTime? date;
  final int? globalDayNumber;
  final DailyLogEntry? entry;
  final EntryVisualStatus status;
  final String? supervisorComment;
  final VoidCallback onEdit;

  const _DailyEntryDetailSheet({
    required this.dayName,
    this.date,
    this.globalDayNumber,
    this.entry,
    required this.status,
    this.supervisorComment,
    required this.onEdit,
  });

  @override
  Widget build(BuildContext context) {
    final capDay = dayName[0].toUpperCase() + dayName.substring(1);
    final dateStr = date != null ? DateFormat('EEEE, MMMM d, yyyy').format(date!) : capDay;

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

              // Header
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          globalDayNumber != null ? 'DAY $globalDayNumber • $capDay'.toUpperCase() : capDay.toUpperCase(),
                          style: AppTypography.labelSm.copyWith(
                            color: AppColors.primary,
                            letterSpacing: 0.8,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(dateStr, style: AppTypography.titleMd),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Status & Hours pill row
              Row(
                children: [
                  _StatusBadge(status: status),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceContainerLow,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      '${entry?.hours ?? 8.0} Hours Logged',
                      style: AppTypography.labelSm.copyWith(fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Activity Detail Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppDimensions.spaceMd),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerLowest,
                  borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                  border: Border.all(color: AppColors.outlineVariant.withAlpha(80)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'LOGGED ACTIVITIES & LEARNING',
                      style: AppTypography.labelSm.copyWith(
                        color: AppColors.onSurfaceVariant,
                        letterSpacing: 0.8,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      entry?.title.isNotEmpty == true
                          ? entry!.title
                          : (entry?.description.isNotEmpty == true ? entry!.description : 'No activity logged for this day.'),
                      style: AppTypography.bodyMd.copyWith(height: 1.4),
                    ),
                    if (entry?.category != null && entry!.category.isNotEmpty) ...[
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          const Icon(Icons.tag_rounded, size: 16, color: AppColors.primary),
                          const SizedBox(width: 4),
                          Text('Category: ${entry!.category}', style: AppTypography.labelMd.copyWith(color: AppColors.primary)),
                        ],
                      ),
                    ],
                  ],
                ),
              ),

              // Supervisor Feedback Section (if present)
              if (supervisorComment != null && supervisorComment!.trim().isNotEmpty) ...[
                const SizedBox(height: 16),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppDimensions.spaceMd),
                  decoration: BoxDecoration(
                    color: AppColors.errorContainer.withAlpha(90),
                    borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                    border: Border.all(color: AppColors.error.withAlpha(120)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.feedback_outlined, size: 18, color: AppColors.error),
                          const SizedBox(width: 8),
                          Text('Supervisor Feedback', style: AppTypography.labelLg.copyWith(color: AppColors.error, fontWeight: FontWeight.w700)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text('"$supervisorComment"', style: AppTypography.bodyMd.copyWith(color: AppColors.onSurface)),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 24),

              // Action button
              if (status == EntryVisualStatus.needsRevision || status == EntryVisualStatus.draft)
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      onEdit();
                    },
                    icon: const Icon(Icons.edit_note_rounded),
                    label: const Text('Edit and Resubmit Entry'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryContainer,
                      foregroundColor: AppColors.onPrimary,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppDimensions.radiusFull)),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
