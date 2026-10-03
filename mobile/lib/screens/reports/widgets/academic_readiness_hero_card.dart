import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../models/workspace_model.dart';

/// Hero card displaying deterministic academic clearance readiness matching Stitch
class AcademicReadinessHeroCard extends StatelessWidget {
  final ReadinessResult? readiness;
  final VoidCallback? onCheckRubric;
  final VoidCallback? onRubricTap;

  const AcademicReadinessHeroCard({
    super.key,
    this.readiness,
    this.onCheckRubric,
    this.onRubricTap,
  });

  @override
  Widget build(BuildContext context) {
    final isReady = readiness?.isReady ?? false;
    final score = readiness?.score ?? 0;
    final blockers = readiness?.blockers ?? [];
    final hasBlockers = blockers.isNotEmpty;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppDimensions.spaceMd + 2),
      decoration: BoxDecoration(
        color: isReady
            ? AppColors.tertiaryFixed.withValues(alpha: 0.3)
            : AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
        border: Border.all(
          color: isReady
              ? AppColors.tertiary.withValues(alpha: 0.3)
              : AppColors.surfaceContainerHigh,
          width: 1,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color.fromRGBO(0, 0, 0, 0.03),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header: Shield icon + Title + Status Pill
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Container(
                      width: 38,
                      height: 38,
                      decoration: BoxDecoration(
                        color: isReady
                            ? AppColors.tertiary
                            : AppColors.primaryContainer,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(
                        isReady
                            ? Icons.verified_user_rounded
                            : Icons.shield_outlined,
                        color: isReady
                            ? AppColors.onTertiary
                            : AppColors.onPrimary,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'CLEARANCE READINESS',
                            style: AppTypography.labelSm.copyWith(
                              color: isReady
                                  ? AppColors.tertiary
                                  : AppColors.primary,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.8,
                              fontSize: 10,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            isReady
                                ? 'Eligible for Academic Clearance'
                                : 'Attachment in Progress',
                            style: AppTypography.titleMd.copyWith(
                              color: AppColors.onSurface,
                              fontWeight: FontWeight.w700,
                              fontSize: 15,
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
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isReady
                      ? AppColors.tertiaryContainer.withValues(alpha: 0.25)
                      : AppColors.surfaceContainer,
                  borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(
                        color: isReady ? AppColors.tertiary : AppColors.secondary,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      isReady ? 'Eligible' : '$score% Ready',
                      style: AppTypography.labelSm.copyWith(
                        color: isReady
                            ? AppColors.tertiary
                            : AppColors.onSurface,
                        fontWeight: FontWeight.w700,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          // Progress Bar with Percentage indicator
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      '8-Point Institutional Policy Benchmark',
                      style: AppTypography.bodySm.copyWith(
                        color: AppColors.onSurfaceVariant,
                        fontSize: 11,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '$score%',
                    style: AppTypography.labelMd.copyWith(
                      color: isReady ? AppColors.tertiary : AppColors.primary,
                      fontWeight: FontWeight.w700,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: (score / 100.0).clamp(0.0, 1.0),
                  minHeight: 6,
                  backgroundColor: AppColors.surfaceContainer,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    isReady ? AppColors.tertiary : AppColors.primary,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Blocker / Notice Summary
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            decoration: BoxDecoration(
              color: isReady
                  ? AppColors.surfaceContainerLowest.withValues(alpha: 0.8)
                  : AppColors.surfaceContainerLow,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                Icon(
                  isReady
                      ? Icons.check_circle_rounded
                      : (hasBlockers
                          ? Icons.info_outline_rounded
                          : Icons.hourglass_top_rounded),
                  size: 16,
                  color: isReady
                      ? AppColors.tertiary
                      : AppColors.secondary,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    isReady
                        ? 'All mandatory academic requirements satisfied for final sign-off.'
                        : (hasBlockers
                            ? '${blockers.length} criteria pending completion (${blockers.first})'
                            : 'Assessment and logbook benchmarks are actively tracked.'),
                    style: AppTypography.bodySm.copyWith(
                      color: AppColors.onSurfaceVariant,
                      fontSize: 11,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (onCheckRubric != null || onRubricTap != null) ...[
                  const SizedBox(width: 6),
                  InkWell(
                    onTap: onCheckRubric ?? onRubricTap,
                    child: Text(
                      'Rubric →',
                      style: AppTypography.labelSm.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w700,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
