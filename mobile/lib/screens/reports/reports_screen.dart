import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import '../../core/constants/app_typography.dart';
import '../../providers/reports_provider.dart';
import '../../providers/workspace_provider.dart';
import 'widgets/academic_readiness_hero_card.dart';
import 'widgets/assessment_bento_grid.dart';
import 'widgets/assessment_card.dart';
import 'widgets/clearance_rubric_section.dart';
import 'widgets/empty_assessments_card.dart';
import 'widgets/institutional_documents_section.dart';
import 'widgets/reports_error.dart';
import 'widgets/reports_skeleton.dart';
import 'widgets/reports_tab_bar.dart';

/// Reports & Documents / Accreditation Screen matching Stitch design
/// Displays authoritative academic assessments, clearance readiness score,
/// supervisor feedback, criteria scoring, and institutional regulatory documents.
class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        context.read<ReportsProvider>().fetchAssessments();
        context.read<WorkspaceProvider>().fetchWorkspace();
      }
    });
  }

  Future<void> _handleRefresh() async {
    await Future.wait([
      context.read<ReportsProvider>().fetchAssessments(forceRefresh: true),
      context.read<WorkspaceProvider>().fetchWorkspace(forceRefresh: true),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    final reportsProv = context.watch<ReportsProvider>();
    final workspaceProv = context.watch<WorkspaceProvider>();
    final readiness = workspaceProv.workspace?.readiness;
    final assessmentsSummary = workspaceProv.workspace?.assessmentsSummary;

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        title: const Text('Reports & Evaluations'),
        backgroundColor: AppColors.surface,
        elevation: 0,
        actions: [
          IconButton(
            tooltip: 'Refresh assessments',
            icon: const Icon(Icons.refresh_rounded, size: 22),
            onPressed: reportsProv.isLoading ? null : _handleRefresh,
          ),
        ],
      ),
      body: _buildBody(reportsProv, workspaceProv, readiness, assessmentsSummary),
    );
  }

  Widget _buildBody(
    ReportsProvider reportsProv,
    WorkspaceProvider workspaceProv,
    dynamic readiness,
    dynamic assessmentsSummary,
  ) {
    // 1. Initial Loading State
    if (reportsProv.isLoading && reportsProv.assessments.isEmpty) {
      return const ReportsSkeleton();
    }

    // 2. Error State (only if no cached assessments exist)
    if (reportsProv.errorMessage != null && reportsProv.assessments.isEmpty) {
      return ReportsError(
        message: reportsProv.errorMessage!,
        onRetry: () => reportsProv.fetchAssessments(forceRefresh: true),
      );
    }

    // 3. Main Content with Pull-To-Refresh
    return RefreshIndicator(
      onRefresh: _handleRefresh,
      color: AppColors.primary,
      backgroundColor: AppColors.surfaceContainerLowest,
      child: ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.symmetric(
          horizontal: AppDimensions.margin,
          vertical: AppDimensions.spaceMd,
        ),
        children: [
          // Sub-header descriptive text
          Text(
            'Official academic evaluations, criteria scoring, and institutional clearance benchmarks.',
            style: AppTypography.bodySm.copyWith(
              color: AppColors.onSurfaceVariant,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 16),

          // 1. Academic Readiness Hero Card
          AcademicReadinessHeroCard(
            readiness: readiness,
            onCheckRubric: () {
              reportsProv.setTab('rubric');
            },
          ),
          const SizedBox(height: 20),

          // 2. Assessment Bento Grid (4 metrics)
          AssessmentBentoGrid(
            reportsProv: reportsProv,
            assessmentsSummary: assessmentsSummary,
          ),
          const SizedBox(height: 24),

          // 3. Section Filter Tabs
          ReportsTabBar(
            selectedTab: reportsProv.selectedTab,
            totalEvaluations: reportsProv.totalAssessments,
            onTabSelected: (tab) => reportsProv.setTab(tab),
          ),
          const SizedBox(height: 16),

          // 4. Tab Content
          _buildTabContent(reportsProv, readiness),

          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildTabContent(ReportsProvider reportsProv, dynamic readiness) {
    switch (reportsProv.selectedTab) {
      case 'rubric':
        return ClearanceRubricSection(readiness: readiness);

      case 'documents':
        return const InstitutionalDocumentsSection();

      case 'all':
      default:
        if (reportsProv.assessments.isEmpty) {
          return const EmptyAssessmentsCard();
        }

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 2, bottom: 8),
              child: Row(
                children: [
                  const Icon(Icons.circle, size: 6, color: AppColors.primary),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      'SUBMITTED EVALUATIONS (${reportsProv.assessments.length})',
                      style: AppTypography.labelLg.copyWith(
                        color: AppColors.primary,
                        letterSpacing: 0.8,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
            ...reportsProv.assessments.map(
              (assessment) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: AssessmentCard(assessment: assessment),
              ),
            ),
          ],
        );
    }
  }
}
