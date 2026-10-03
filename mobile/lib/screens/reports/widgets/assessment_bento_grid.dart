import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../models/assessment_model.dart';
import '../../../models/workspace_model.dart';
import '../../../providers/reports_provider.dart';

/// Bento Grid with 4 metric cards matching Stitch Reports design
class AssessmentBentoGrid extends StatelessWidget {
  final ReportsProvider? reportsProv;
  final AssessmentsSummary? assessmentsSummary;
  final double? averageScore;
  final int? totalAssessments;
  final int? gradedCount;
  final AssessmentRecord? industryAssessment;
  final AssessmentRecord? universityAssessment;
  final String? gradeClassification;

  const AssessmentBentoGrid({
    super.key,
    this.reportsProv,
    this.assessmentsSummary,
    this.averageScore,
    this.totalAssessments,
    this.gradedCount,
    this.industryAssessment,
    this.universityAssessment,
    this.gradeClassification,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveAvg = reportsProv?.averageScore ?? averageScore;
    final effectiveGraded = reportsProv?.gradedCount ?? gradedCount ?? 0;
    final effectiveIndustry = reportsProv?.industryAssessment ?? industryAssessment;
    final effectiveUniversity = reportsProv?.universityAssessment ?? universityAssessment;
    final effectiveGradeClass = reportsProv?.compositeGradeClassification ??
        gradeClassification ??
        'Pending';

    return Column(
      children: [
        // Top Row: Average Score + Evaluations Completed
        Row(
          children: [
            // Card 1: Average Score Card
            Expanded(
              child: _bentoCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            'AVERAGE SCORE',
                            style: AppTypography.labelSm.copyWith(
                              color: AppColors.onSurfaceVariant,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.6,
                              fontSize: 10,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const Icon(
                          Icons.insights_rounded,
                          size: 15,
                          color: AppColors.primary,
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      effectiveAvg != null
                          ? '${effectiveAvg.toStringAsFixed(1)}%'
                          : '--',
                      style: AppTypography.headlineLg.copyWith(
                        color: AppColors.onSurface,
                        fontWeight: FontWeight.w800,
                        fontSize: 22,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: effectiveAvg != null
                            ? AppColors.tertiaryContainer.withValues(alpha: 0.25)
                            : AppColors.surfaceContainer,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        effectiveAvg != null ? effectiveGradeClass : 'Pending',
                        style: AppTypography.labelSm.copyWith(
                          color: effectiveAvg != null
                              ? AppColors.tertiary
                              : AppColors.onSurfaceVariant,
                          fontWeight: FontWeight.w700,
                          fontSize: 10,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(width: 10),

            // Card 2: Evaluations Completed (Target 2)
            Expanded(
              child: _bentoCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            'GRADED REVIEWS',
                            style: AppTypography.labelSm.copyWith(
                              color: AppColors.onSurfaceVariant,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.6,
                              fontSize: 10,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const Icon(
                          Icons.task_alt_rounded,
                          size: 15,
                          color: AppColors.secondary,
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '$effectiveGraded of 2',
                      style: AppTypography.headlineLg.copyWith(
                        color: AppColors.onSurface,
                        fontWeight: FontWeight.w800,
                        fontSize: 22,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(3),
                      child: LinearProgressIndicator(
                        value: (effectiveGraded / 2.0).clamp(0.0, 1.0),
                        minHeight: 5,
                        backgroundColor: AppColors.surfaceContainer,
                        valueColor: const AlwaysStoppedAnimation<Color>(
                          AppColors.secondary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),

        const SizedBox(height: 10),

        // Bottom Row: Industry Evaluation vs Faculty Evaluation Status
        Row(
          children: [
            // Card 3: Industry Assessment
            Expanded(
              child: _assessmentSourceCard(
                label: 'INDUSTRY REVIEW',
                icon: Icons.business_center_outlined,
                assessment: effectiveIndustry,
                isSubmittedFromSummary: assessmentsSummary?.industrySubmitted ?? false,
                defaultMentorRole: 'Industry Supervisor',
              ),
            ),

            const SizedBox(width: 10),

            // Card 4: University Assessment
            Expanded(
              child: _assessmentSourceCard(
                label: 'FACULTY REVIEW',
                icon: Icons.school_outlined,
                assessment: effectiveUniversity,
                isSubmittedFromSummary: assessmentsSummary?.universitySubmitted ?? false,
                defaultMentorRole: 'Academic Supervisor',
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _assessmentSourceCard({
    required String label,
    required IconData icon,
    required AssessmentRecord? assessment,
    required bool isSubmittedFromSummary,
    required String defaultMentorRole,
  }) {
    final isGraded = assessment != null && assessment.isGraded;
    final score = assessment?.score;

    return _bentoCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  label,
                  style: AppTypography.labelSm.copyWith(
                    color: AppColors.onSurfaceVariant,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.6,
                    fontSize: 10,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Icon(
                icon,
                size: 15,
                color: isGraded ? AppColors.tertiary : AppColors.onSurfaceVariant,
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Container(
                width: 6,
                height: 6,
                decoration: BoxDecoration(
                  color: isGraded ? AppColors.tertiary : AppColors.secondary,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 5),
              Expanded(
                child: Text(
                  isGraded ? '$score%' : (isSubmittedFromSummary ? 'Submitted' : 'Pending Review'),
                  style: AppTypography.titleMd.copyWith(
                    fontWeight: FontWeight.w700,
                    color: isGraded ? AppColors.tertiary : AppColors.onSurface,
                    fontSize: 14,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            assessment?.evaluator?.name.isNotEmpty == true
                ? assessment!.evaluator!.name
                : defaultMentorRole,
            style: AppTypography.bodySm.copyWith(
              color: AppColors.onSurfaceVariant,
              fontSize: 10,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _bentoCard({required Widget child}) {
    return Container(
      padding: const EdgeInsets.all(AppDimensions.spaceSm + 4),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
        boxShadow: const [
          BoxShadow(
            color: Color.fromRGBO(0, 0, 0, 0.03),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: child,
    );
  }
}
