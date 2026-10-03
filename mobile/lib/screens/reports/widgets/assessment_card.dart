import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../models/assessment_model.dart';

/// Card component displaying a formal evaluation submitted by a supervisor
class AssessmentCard extends StatelessWidget {
  final AssessmentRecord assessment;

  const AssessmentCard({
    super.key,
    required this.assessment,
  });

  String get _evaluatorInitials {
    final name = assessment.evaluator?.name ?? (assessment.isIndustry ? 'Industry Mentor' : 'Faculty Advisor');
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty || parts[0].isEmpty) return 'EV';
    if (parts.length == 1) return parts[0].substring(0, parts[0].length >= 2 ? 2 : 1).toUpperCase();
    return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    final evaluatorName = assessment.evaluator?.name.isNotEmpty == true
        ? assessment.evaluator!.name
        : (assessment.isIndustry ? 'Industry Workplace Supervisor' : 'Faculty Academic Advisor');
    final evaluatorEmail = assessment.evaluator?.email ?? '';
    final isGraded = assessment.isGraded;
    final score = assessment.score;
    final criteria = assessment.criteria;
    final feedback = assessment.feedback;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppDimensions.spaceMd),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
        border: Border.all(
          color: isGraded
              ? AppColors.tertiary.withValues(alpha: 0.25)
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
          // Header Row: Type pill + Evaluator Role Pill + Score Badge
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: assessment.isIndustry
                            ? AppColors.secondaryFixed
                            : AppColors.primaryFixed,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        assessment.displayType,
                        style: AppTypography.labelSm.copyWith(
                          color: assessment.isIndustry
                              ? AppColors.secondary
                              : AppColors.primary,
                          fontWeight: FontWeight.w700,
                          fontSize: 10,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        assessment.displayEvaluatorType,
                        style: AppTypography.bodySm.copyWith(
                          color: AppColors.onSurfaceVariant,
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              if (isGraded)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.tertiaryContainer.withValues(alpha: 0.25),
                    borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.check_circle_rounded,
                        size: 13,
                        color: AppColors.tertiary,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '$score% (${assessment.gradeLetter})',
                        style: AppTypography.labelSm.copyWith(
                          color: AppColors.tertiary,
                          fontWeight: FontWeight.w700,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                )
              else
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceContainer,
                    borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
                  ),
                  child: Text(
                    'Pending Review',
                    style: AppTypography.labelSm.copyWith(
                      color: AppColors.onSurfaceVariant,
                      fontSize: 11,
                    ),
                  ),
                ),
            ],
          ),

          const SizedBox(height: 12),

          // Evaluator Details
          Row(
            children: [
              CircleAvatar(
                radius: 18,
                backgroundColor: assessment.isIndustry
                    ? AppColors.secondaryContainer
                    : AppColors.primaryContainer,
                child: Text(
                  _evaluatorInitials,
                  style: AppTypography.labelSm.copyWith(
                    color: assessment.isIndustry
                        ? AppColors.secondary
                        : AppColors.onPrimary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      evaluatorName,
                      style: AppTypography.titleMd.copyWith(
                        fontWeight: FontWeight.w700,
                        fontSize: 13,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (evaluatorEmail.isNotEmpty)
                      Text(
                        evaluatorEmail,
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
            ],
          ),

          // Criteria breakdown if present
          if (criteria != null && criteria.isNotEmpty) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(AppDimensions.spaceSm + 2),
              decoration: BoxDecoration(
                color: AppColors.surfaceContainerLow,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'EVALUATION CRITERIA BREAKDOWN',
                    style: AppTypography.labelSm.copyWith(
                      color: AppColors.onSurfaceVariant,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.6,
                      fontSize: 10,
                    ),
                  ),
                  const SizedBox(height: 6),
                  ...criteria.entries.map((entry) {
                    final rawKey = entry.key.trim();
                    final keyFormatted = rawKey.contains(' ')
                        ? rawKey.replaceAll(RegExp(r'\s+'), ' ')
                        : rawKey
                            .replaceAll('_', ' ')
                            .replaceAllMapped(
                              RegExp(r'([a-z])([A-Z])'),
                              (m) => '${m[1]} ${m[2]}',
                            );
                    final title = keyFormatted.isEmpty
                        ? rawKey
                        : keyFormatted.substring(0, 1).toUpperCase() +
                            keyFormatted.substring(1);
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 2.5),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              title,
                              style: AppTypography.bodySm.copyWith(
                                color: AppColors.onSurface,
                                fontSize: 11,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '${entry.value} / 10',
                            style: AppTypography.labelSm.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w700,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),
          ],

          // Supervisor qualitative feedback if present
          if (feedback != null && feedback.isNotEmpty) ...[
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(AppDimensions.spaceSm + 2),
              decoration: BoxDecoration(
                color: AppColors.surfaceContainerLowest,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: AppColors.surfaceContainerHigh,
                  width: 0.8,
                ),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(
                    Icons.format_quote_rounded,
                    size: 16,
                    color: AppColors.secondary,
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      '"$feedback"',
                      style: AppTypography.bodySm.copyWith(
                        color: AppColors.onSurface,
                        fontStyle: FontStyle.italic,
                        fontSize: 11.5,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],

          const SizedBox(height: 10),

          // Footer: Timestamp & Verification status
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Icon(
                      Icons.schedule_rounded,
                      size: 13,
                      color: AppColors.onSurfaceVariant,
                    ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        'Submitted on ${assessment.formattedDateTime}',
                        style: AppTypography.bodySm.copyWith(
                          color: AppColors.onSurfaceVariant,
                          fontSize: 10.5,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    Icons.verified_rounded,
                    size: 13,
                    color: AppColors.tertiary,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'Signed & Graded',
                    style: AppTypography.labelSm.copyWith(
                      color: AppColors.tertiary,
                      fontWeight: FontWeight.w600,
                      fontSize: 10.5,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
