import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../models/logbook_model.dart';

/// Section 1: Week Navigation & Meta Header matching Stitch
class WeekNavigationHeader extends StatelessWidget {
  final List<int> availableWeeks;
  final int selectedWeek;
  final LogbookModel? currentLogbook;
  final List<LogbookModel> allLogbooks;
  final ValueChanged<int> onSelectWeek;

  const WeekNavigationHeader({
    super.key,
    required this.availableWeeks,
    required this.selectedWeek,
    required this.currentLogbook,
    required this.allLogbooks,
    required this.onSelectWeek,
  });

  @override
  Widget build(BuildContext context) {
    final log = currentLogbook;
    final loggedDays = log?.loggedDaysCount ?? 0;
    final totalDays = log?.totalDaysCount ?? 5;
    final fraction = (totalDays > 0 ? (loggedDays / totalDays) : 0.0).clamp(0.0, 1.0);
    final percent = (fraction * 100).round();
    final dateRange = log?.formattedDateRange ?? 'Week $selectedWeek Cycle';

    return Container(
      padding: const EdgeInsets.all(AppDimensions.spaceMd),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(8),
            blurRadius: 6,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Current Attachment title + Calendar button
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'CURRENT ATTACHMENT',
                      style: AppTypography.labelSm.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.8,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Industrial Attachment Logbook',
                      style: AppTypography.headlineSm,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: AppDimensions.spaceXs),
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainer,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.calendar_month_outlined,
                  size: 20,
                  color: AppColors.onSurfaceVariant,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Date range row
          Row(
            children: [
              const Icon(
                Icons.date_range_outlined,
                size: 16,
                color: AppColors.secondary,
              ),
              const SizedBox(width: 4),
              Text(
                'Week $selectedWeek: ',
                style: AppTypography.bodySm.copyWith(
                  fontWeight: FontWeight.w600,
                  color: AppColors.onSurface,
                ),
              ),
              Expanded(
                child: Text(
                  dateRange,
                  style: AppTypography.bodySm.copyWith(
                    color: AppColors.onSurfaceVariant,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppDimensions.spaceMd),

          // Horizontal week selector scroll
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: availableWeeks.map((weekNum) {
                final isSelected = weekNum == selectedWeek;
                final matching = allLogbooks
                    .where((l) => l.weekNumber == weekNum)
                    .firstOrNull;

                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: _WeekChip(
                    weekNumber: weekNum,
                    isSelected: isSelected,
                    isApproved: matching?.isApproved == true,
                    isRejected: matching?.isRejected == true,
                    isPending: matching?.isPending == true,
                    onTap: () => onSelectWeek(weekNum),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: AppDimensions.spaceMd),

          // Weekly Completion Banner Progress
          Container(
            padding: const EdgeInsets.all(AppDimensions.spaceSm),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerLow,
              borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.donut_large_rounded,
                      size: 18,
                      color: AppColors.primary,
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      flex: 4,
                      child: Text(
                        'Week $selectedWeek Progress',
                        style: AppTypography.labelMd.copyWith(
                          color: AppColors.onSurface,
                          fontWeight: FontWeight.w600,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      flex: 5,
                      child: Text(
                        '$loggedDays of $totalDays days logged ($percent%)',
                        textAlign: TextAlign.end,
                        style: AppTypography.labelMd.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w700,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
                  child: LinearProgressIndicator(
                    value: fraction,
                    minHeight: 8,
                    backgroundColor: AppColors.surfaceContainerHighest,
                    valueColor: const AlwaysStoppedAnimation<Color>(
                      AppColors.primaryContainer,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _WeekChip extends StatelessWidget {
  final int weekNumber;
  final bool isSelected;
  final bool isApproved;
  final bool isRejected;
  final bool isPending;
  final VoidCallback onTap;

  const _WeekChip({
    required this.weekNumber,
    required this.isSelected,
    required this.isApproved,
    required this.isRejected,
    required this.isPending,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    if (isSelected) {
      return InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
          decoration: BoxDecoration(
            color: AppColors.primaryContainer,
            borderRadius: BorderRadius.circular(8),
            boxShadow: [
              BoxShadow(
                color: AppColors.primaryContainer.withAlpha(40),
                blurRadius: 4,
                offset: const Offset(0, 1),
              ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: AppColors.secondaryContainer,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 6),
              Text(
                'Week $weekNumber (Active)',
                style: AppTypography.labelMd.copyWith(
                  color: AppColors.onPrimary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      );
    }

    // Non-selected chip
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: AppColors.surfaceContainer,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (isApproved)
              const Icon(
                Icons.check_circle,
                size: 16,
                color: AppColors.secondary,
              )
            else if (isRejected)
              const Icon(
                Icons.error_outline,
                size: 16,
                color: AppColors.error,
              )
            else if (isPending)
              const Icon(
                Icons.hourglass_top_rounded,
                size: 16,
                color: AppColors.secondary,
              )
            else
              const Icon(
                Icons.schedule,
                size: 16,
                color: AppColors.outline,
              ),
            const SizedBox(width: 6),
            Text(
              'Week $weekNumber',
              style: AppTypography.labelMd.copyWith(
                color: isApproved
                    ? AppColors.onSurfaceVariant
                    : AppColors.outline,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
