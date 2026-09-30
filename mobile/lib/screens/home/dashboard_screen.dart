import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import '../../core/constants/app_typography.dart';
import '../../providers/auth_provider.dart';
import '../../providers/workspace_provider.dart';
import 'widgets/dashboard_header.dart';
import 'widgets/attachment_progress_card.dart';
import 'widgets/placement_card.dart';
import 'widgets/action_queue_section.dart';
import 'widgets/recent_activity_section.dart';
import 'widgets/dashboard_skeleton.dart';
import 'widgets/dashboard_error.dart';

/// AttachPro Student Home Dashboard – Phase 3
/// Consumes real data from GET /api/student/workspace
class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    // Trigger initial workspace fetch after first frame
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<WorkspaceProvider>().fetchWorkspace();
    });
  }

  Future<void> _onRefresh() async {
    await context.read<WorkspaceProvider>().fetchWorkspace(forceRefresh: true);
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    final auth = context.watch<AuthProvider>();
    final workspace = context.watch<WorkspaceProvider>();

    final user = auth.user;
    final firstName = (user?.name ?? '').split(' ').first;

    return Scaffold(
      backgroundColor: AppColors.surface,
      body: AnnotatedRegion<SystemUiOverlayStyle>(
        value: const SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.dark,
        ),
        child: Column(
          children: [
            // ── App Bar (Stitch-style pinned header) ─────────────────
            _DashboardAppBar(firstName: firstName, user: user),

            // ── Content ───────────────────────────────────────────────
            Expanded(
              child: _buildBody(workspace),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBody(WorkspaceProvider workspace) {
    // Loading
    if (workspace.isLoading) {
      return const DashboardSkeleton();
    }

    // Error
    if (workspace.hasError) {
      return DashboardError(
        message: workspace.errorMessage ??
            'Something went wrong. Please try again.',
        onRetry: () => workspace.retry(),
      );
    }

    // Loaded
    if (workspace.hasData) {
      return _DashboardContent(
        workspace: workspace,
        onRefresh: _onRefresh,
      );
    }

    // Initial state (before first fetch)
    return const DashboardSkeleton();
  }
}

/// ── Pinned App Bar ───────────────────────────────────────────────────────────
class _DashboardAppBar extends StatelessWidget {
  final String firstName;
  final dynamic user;

  const _DashboardAppBar({required this.firstName, this.user});

  @override
  Widget build(BuildContext context) {
    final topPadding = MediaQuery.of(context).padding.top;
    return Container(
      color: AppColors.surface.withAlpha(230),
      child: Column(
        children: [
          SizedBox(height: topPadding),
          SizedBox(
            height: 56,
            child: Padding(
              padding: const EdgeInsets.symmetric(
                  horizontal: AppDimensions.margin),
              child: Row(
                children: [
                  // Logo + Title
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: AppColors.surfaceContainer,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.work_outline_rounded,
                        size: 18, color: AppColors.primary),
                  ),
                  const SizedBox(width: AppDimensions.spaceSm),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'ATTACHPRO',
                        style: AppTypography.labelSm.copyWith(
                          color: AppColors.onSurfaceVariant,
                          letterSpacing: 1.2,
                        ),
                      ),
                      Text(
                        'Overview Dashboard',
                        style: AppTypography.headlineSm.copyWith(height: 1.1),
                      ),
                    ],
                  ),
                  const Spacer(),
                  // Profile avatar
                  CircleAvatar(
                    radius: 18,
                    backgroundColor: AppColors.primaryContainer,
                    child: Text(
                      firstName.isNotEmpty ? firstName[0].toUpperCase() : 'S',
                      style: AppTypography.labelMd.copyWith(
                        color: AppColors.onPrimary,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Container(
            height: 1,
            color: AppColors.outlineVariant.withAlpha(50),
          ),
        ],
      ),
    );
  }
}

/// ── Main Scrollable Content ──────────────────────────────────────────────────
class _DashboardContent extends StatelessWidget {
  final WorkspaceProvider workspace;
  final Future<void> Function() onRefresh;

  const _DashboardContent({
    required this.workspace,
    required this.onRefresh,
  });

  @override
  Widget build(BuildContext context) {
    final data = workspace.workspace!;
    final student = data.student;
    final dates = data.dates;
    final attendance = data.attendance;
    final logbooks = data.logbooksSummary;
    final assessments = data.assessmentsSummary;
    final actionQueue = data.actionQueue;
    final deadlines = data.deadlines;
    final userName = student.user?.name ?? '';
    final firstName = userName.split(' ').first;

    return RefreshIndicator(
      onRefresh: onRefresh,
      color: AppColors.primary,
      backgroundColor: AppColors.surfaceContainerLowest,
      child: CustomScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        slivers: [
          SliverPadding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppDimensions.margin,
              vertical: AppDimensions.spaceMd,
            ),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // ① Greeting Header
                DashboardHeader(
                  firstName: firstName,
                  daysCompleted: dates.totalDays > 0 ? dates.daysCompleted : null,
                  totalDays: dates.totalDays > 0 ? dates.totalDays : null,
                ),

                const SizedBox(height: AppDimensions.spaceLg),

                // ② Attachment Progress Hero Card
                AttachmentProgressCard(
                  dates: dates,
                  logbooks: logbooks,
                  assessments: assessments,
                  placementStatus: student.placementStatus,
                ),

                const SizedBox(height: AppDimensions.spaceSm),

                // ③ Placement Details Card
                PlacementCard(
                  student: student,
                  dates: dates,
                ),

                const SizedBox(height: AppDimensions.spaceSm),

                // ④ Action Queue
                ActionQueueSection(actions: actionQueue),

                const SizedBox(height: AppDimensions.spaceSm),

                // ⑤ Recent Activity
                RecentActivitySection(
                  deadlines: deadlines,
                  logbooks: logbooks,
                  attendance: attendance,
                ),

                // Bottom padding for nav bar
                const SizedBox(height: AppDimensions.space2xl),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}
