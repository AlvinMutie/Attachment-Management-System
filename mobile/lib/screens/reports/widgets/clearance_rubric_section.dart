import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../models/workspace_model.dart';

/// 8-Point Institutional Clearance Rubric Section matching Stitch design
class ClearanceRubricSection extends StatelessWidget {
  final ReadinessResult? readiness;

  const ClearanceRubricSection({
    super.key,
    this.readiness,
  });

  @override
  Widget build(BuildContext context) {
    final checklist = readiness?.checklist;
    final score = readiness?.score ?? 0;

    final rubricItems = [
      _RubricItem(
        label: 'Host Organization Placement Approved',
        description: 'Verified attachment organization details on file',
        passed: checklist?.placementApproved ?? false,
      ),
      _RubricItem(
        label: 'Industry Workplace Supervisor Assigned',
        description: 'Mentor allocated at host workstation',
        passed: checklist?.industrySupervisorAssigned ?? false,
      ),
      _RubricItem(
        label: 'University Academic Supervisor Assigned',
        description: 'Faculty advisor assigned for academic supervision',
        passed: checklist?.universitySupervisorAssigned ?? false,
      ),
      _RubricItem(
        label: 'Attendance Compliance (≥75% threshold)',
        description: 'Regular presence verified via Dynamic QR',
        passed: checklist?.attendanceThresholdMet ?? false,
      ),
      _RubricItem(
        label: 'Weekly Logbook Submissions Reviewed & Signed',
        description: 'Required weekly activity logs approved by supervisor',
        passed: checklist?.logbooksSubmittedAndReviewed ?? false,
      ),
      _RubricItem(
        label: 'Academic Supervision Site Visit Conducted',
        description: 'Faculty on-site / virtual supervision milestone confirmed',
        passed: checklist?.supervisionCompleted ?? false,
      ),
      _RubricItem(
        label: 'Industry Supervisor Evaluation Submitted',
        description: 'Formal workplace competency evaluation graded',
        passed: checklist?.industryAssessmentCompleted ?? false,
      ),
      _RubricItem(
        label: 'Faculty Academic Assessment Graded',
        description: 'Final university grading submitted and recorded',
        passed: checklist?.universityAssessmentCompleted ?? false,
      ),
    ];

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppDimensions.spaceMd),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
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
          // Section Header
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
                          Icons.rule_folder_outlined,
                          size: 16,
                          color: AppColors.primary,
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            'Academic Clearance Rubric',
                            style: AppTypography.titleMd.copyWith(
                              color: AppColors.onSurface,
                              fontWeight: FontWeight.w700,
                              fontSize: 14,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '8 institutional benchmarks required for final clearance',
                      style: AppTypography.bodySm.copyWith(
                        color: AppColors.onSurfaceVariant,
                        fontSize: 11,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.primaryContainer.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
                ),
                child: Text(
                  '$score% Met',
                  style: AppTypography.labelSm.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700,
                    fontSize: 11,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),
          const Divider(height: 1, thickness: 0.5),
          const SizedBox(height: 8),

          // 8 Checklist Items
          ...rubricItems.asMap().entries.map((entry) {
            final idx = entry.key + 1;
            final item = entry.value;

            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Number / Check Circle
                  Container(
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(
                      color: item.passed
                          ? AppColors.tertiaryContainer.withValues(alpha: 0.3)
                          : AppColors.surfaceContainer,
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: item.passed
                          ? const Icon(
                              Icons.check_rounded,
                              size: 14,
                              color: AppColors.tertiary,
                            )
                          : Text(
                              '$idx',
                              style: AppTypography.labelSm.copyWith(
                                color: AppColors.onSurfaceVariant,
                                fontWeight: FontWeight.w700,
                                fontSize: 10,
                              ),
                            ),
                    ),
                  ),

                  const SizedBox(width: 10),

                  // Label and Description
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.label,
                          style: AppTypography.labelLg.copyWith(
                            color: item.passed
                                ? AppColors.onSurface
                                : AppColors.onSurfaceVariant,
                            fontWeight: item.passed
                                ? FontWeight.w700
                                : FontWeight.w600,
                            fontSize: 12.5,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 1),
                        Text(
                          item.description,
                          style: AppTypography.bodySm.copyWith(
                            color: AppColors.onSurfaceVariant,
                            fontSize: 10.5,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(width: 8),

                  // Status Pill
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: item.passed
                          ? AppColors.tertiaryContainer.withValues(alpha: 0.2)
                          : AppColors.surfaceContainer,
                      borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
                    ),
                    child: Text(
                      item.passed ? 'Verified' : 'Pending',
                      style: AppTypography.labelSm.copyWith(
                        color: item.passed
                            ? AppColors.tertiary
                            : AppColors.onSurfaceVariant,
                        fontWeight: FontWeight.w700,
                        fontSize: 10,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

class _RubricItem {
  final String label;
  final String description;
  final bool passed;

  _RubricItem({
    required this.label,
    required this.description,
    required this.passed,
  });
}
