import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../models/logbook_model.dart';

/// Section 5: Weekly Total Hours & Submission Deadline summary card matching Stitch
class WeeklySummaryCard extends StatelessWidget {
  final LogbookModel? logbook;

  const WeeklySummaryCard({
    super.key,
    this.logbook,
  });

  @override
  Widget build(BuildContext context) {
    final totalHours = logbook?.totalLoggedHours ?? 28.0;
    final percent = logbook?.hoursPercent.round() ?? 70;

    return Container(
      padding: const EdgeInsets.all(AppDimensions.spaceMd),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(8),
            blurRadius: 5,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Row: Timelapse icon + Hours info + % badge
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: const BoxDecoration(
                  color: AppColors.secondaryFixed,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.timelapse_outlined,
                  size: 20,
                  color: AppColors.onSecondaryFixed,
                ),
              ),
              const SizedBox(width: AppDimensions.spaceSm),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Weekly Total Hours',
                      style: AppTypography.labelSm.copyWith(
                        color: AppColors.onSurfaceVariant,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    RichText(
                      text: TextSpan(
                        children: [
                          TextSpan(
                            text: totalHours.toStringAsFixed(1),
                            style: AppTypography.titleMd.copyWith(
                              color: AppColors.onSurface,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          TextSpan(
                            text: ' / 40.0 hrs target',
                            style: AppTypography.bodySm.copyWith(
                              color: AppColors.outline,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainer,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  '$percent% Reached',
                  style: AppTypography.labelMd.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppDimensions.spaceSm),

          // Submission Deadline info box
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
                  Icons.lock_clock_outlined,
                  size: 18,
                  color: AppColors.primary,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: RichText(
                    text: TextSpan(
                      style: AppTypography.bodySm.copyWith(
                        color: AppColors.onSurfaceVariant,
                        height: 1.3,
                      ),
                      children: [
                        TextSpan(
                          text: 'Submission Deadline: ',
                          style: AppTypography.bodySm.copyWith(
                            color: AppColors.onSurface,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const TextSpan(
                          text:
                              'Weekly logbook locks for university faculty grading every Sunday at 11:59 PM EAT.',
                        ),
                      ],
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
