import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';

/// Section 2: Prominent Action Banner to Log Today's Entry matching Stitch
class LogTodayActionBanner extends StatelessWidget {
  final int? currentDayNumber;
  final VoidCallback onTap;

  const LogTodayActionBanner({
    super.key,
    this.currentDayNumber,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final dayLabel = currentDayNumber != null
        ? 'DAY $currentDayNumber • TODAY'
        : 'LOGBOOK ENTRY • TODAY';

    return Container(
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withAlpha(50),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          // Background ambient circular glow
          Positioned(
            right: -20,
            bottom: -30,
            child: Container(
              width: 140,
              height: 140,
              decoration: BoxDecoration(
                color: AppColors.primaryContainer.withAlpha(80),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(AppDimensions.spaceMd),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.white.withAlpha(45),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          dayLabel,
                          style: AppTypography.labelSm.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        "Log Today's Entry",
                        style: AppTypography.titleMd.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.w700,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Record daily tasks, logged hours, and engineering skills gained.',
                        style: AppTypography.bodySm.copyWith(
                          color: AppColors.primaryFixed,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: AppDimensions.spaceSm),
                // Circular Add button
                Material(
                  color: AppColors.secondaryContainer,
                  shape: const CircleBorder(),
                  elevation: 2,
                  child: InkWell(
                    customBorder: const CircleBorder(),
                    onTap: onTap,
                    child: const SizedBox(
                      width: 48,
                      height: 48,
                      child: Icon(
                        Icons.add,
                        size: 26,
                        color: AppColors.onSecondaryContainer,
                      ),
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
