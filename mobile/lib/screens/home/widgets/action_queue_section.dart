import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../models/workspace_model.dart';

/// Today's Action Items section — maps actionQueue from workspace API
class ActionQueueSection extends StatelessWidget {
  final List<ActionItem> actions;

  const ActionQueueSection({super.key, required this.actions});

  @override
  Widget build(BuildContext context) {
    final pendingCount = actions.where((a) => a.isHigh || a.isCritical).length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section header
        Row(
          children: [
            Flexible(
              flex: 3,
              child: Text(
                "Today's Action Items",
                style: AppTypography.titleMd,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(width: AppDimensions.spaceXs),
            if (pendingCount > 0)
              Flexible(
                flex: 2,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppColors.errorContainer,
                    borderRadius:
                        BorderRadius.circular(AppDimensions.radiusFull),
                  ),
                  child: Text(
                    '$pendingCount Pending',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AppTypography.labelSm.copyWith(
                      color: AppColors.onErrorContainer,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            const SizedBox(width: AppDimensions.spaceXs),
            Expanded(
              flex: 2,
              child: Text(
                'Priority queue',
                textAlign: TextAlign.end,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: AppTypography.labelSm.copyWith(
                  color: AppColors.onSurfaceVariant,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: AppDimensions.spaceSm),

        // Action items or empty
        if (actions.isEmpty)
          _EmptyActionQueue()
        else
          ...actions.map((action) => Padding(
                padding: const EdgeInsets.only(bottom: AppDimensions.spaceSm),
                child: _ActionItemCard(action: action),
              )),
      ],
    );
  }
}

class _EmptyActionQueue extends StatelessWidget {
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
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppColors.tertiaryFixed,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check_circle_outline,
                size: 20, color: AppColors.onTertiaryFixed),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'All caught up!',
                  style: AppTypography.labelLg,
                ),
                Text(
                  'No pending actions at the moment.',
                  style: AppTypography.bodySm,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ActionItemCard extends StatelessWidget {
  final ActionItem action;
  const _ActionItemCard({required this.action});

  Color _iconBg() {
    if (action.isCritical) return AppColors.errorContainer;
    if (action.id == 'CHECK_IN_TODAY') return AppColors.surfaceVariant;
    if (action.id.startsWith('REVISE_LOGBOOK')) return AppColors.errorContainer;
    if (action.id == 'SUBMIT_FIRST_LOGBOOK') return AppColors.secondaryFixed;
    if (action.id.startsWith('UPCOMING_MEETING')) return AppColors.tertiaryFixed;
    if (action.id == 'PENDING_APPROVAL') return AppColors.primaryFixed;
    return AppColors.surfaceVariant;
  }

  Color _iconColor() {
    if (action.isCritical) return AppColors.error;
    if (action.id == 'CHECK_IN_TODAY') return AppColors.primary;
    if (action.id.startsWith('REVISE_LOGBOOK')) return AppColors.onErrorContainer;
    if (action.id == 'SUBMIT_FIRST_LOGBOOK') return AppColors.onSecondaryFixed;
    if (action.id.startsWith('UPCOMING_MEETING')) return AppColors.onTertiaryFixed;
    return AppColors.primary;
  }

  IconData _icon() {
    if (action.id == 'CHECK_IN_TODAY') return Icons.how_to_reg_outlined;
    if (action.id.startsWith('REVISE_LOGBOOK')) return Icons.edit_note_rounded;
    if (action.id == 'SUBMIT_FIRST_LOGBOOK') return Icons.menu_book_outlined;
    if (action.id == 'SUBMIT_PLACEMENT') return Icons.send_outlined;
    if (action.id == 'PENDING_APPROVAL') return Icons.hourglass_top_rounded;
    if (action.id == 'REVISE_PLACEMENT') return Icons.error_outline;
    if (action.id.startsWith('UPCOMING_MEETING')) return Icons.groups_outlined;
    return Icons.edit_calendar_outlined;
  }

  @override
  Widget build(BuildContext context) {
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header row
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Icon
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: _iconBg(),
                  borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
                ),
                child: Icon(_icon(), size: 18, color: _iconColor()),
              ),
              const SizedBox(width: AppDimensions.spaceXs),
              // Title + description
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      action.title,
                      style: AppTypography.labelLg,
                      overflow: TextOverflow.ellipsis,
                      maxLines: 1,
                    ),
                    Text(
                      action.description,
                      style: AppTypography.bodySm,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 4),
              // Priority chip
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: action.isCritical
                      ? AppColors.errorContainer
                      : AppColors.surfaceContainerHigh,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  action.isCritical ? 'Critical' : action.priority,
                  style: AppTypography.labelSm.copyWith(
                    color: action.isCritical
                        ? AppColors.onErrorContainer
                        : AppColors.onSurfaceVariant,
                  ),
                ),
              ),
            ],
          ),

          // Logbook/revision description bubble
          if (action.id.startsWith('REVISE_LOGBOOK') &&
              action.description.contains('"'))
            Padding(
              padding: const EdgeInsets.only(top: AppDimensions.spaceXs),
              child: Container(
                padding: const EdgeInsets.all(AppDimensions.spaceXs),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerLow,
                  borderRadius:
                      BorderRadius.circular(AppDimensions.radiusMd),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.format_quote_rounded,
                        size: 16, color: AppColors.secondary),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        action.description,
                        style: AppTypography.bodySm.copyWith(
                          fontStyle: FontStyle.italic,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
            ),

          // CTA button
          const SizedBox(height: AppDimensions.spaceSm),
          SizedBox(
            width: double.infinity,
            height: 40,
            child: _isPrimaryAction(action.id)
                ? ElevatedButton.icon(
                    onPressed: null, // Phase 4+
                    icon: const Icon(Icons.add, size: 18),
                    label: Text(action.actionText ?? 'Take Action'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: AppColors.onPrimary,
                      shape: const StadiumBorder(),
                      elevation: 1,
                      textStyle: AppTypography.labelLg,
                    ),
                  )
                : OutlinedButton.icon(
                    onPressed: null,
                    icon: const Icon(Icons.chevron_right, size: 16),
                    label: Text(action.actionText ?? 'View'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.primary,
                      side: BorderSide.none,
                      backgroundColor: AppColors.surfaceContainer,
                      shape: const StadiumBorder(),
                      textStyle: AppTypography.labelMd.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  bool _isPrimaryAction(String id) {
    return id == 'CHECK_IN_TODAY' || id == 'SUBMIT_PLACEMENT' || id == 'REVISE_PLACEMENT';
  }
}
