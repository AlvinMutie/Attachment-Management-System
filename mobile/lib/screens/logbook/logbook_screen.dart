import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import '../../core/constants/app_typography.dart';
import '../../models/logbook_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/logbook_provider.dart';
import '../../providers/workspace_provider.dart';
import 'widgets/daily_entry_card.dart';
import 'widgets/log_today_action_banner.dart';
import 'widgets/logbook_editor_sheet.dart';
import 'widgets/logbook_error.dart';
import 'widgets/logbook_filter_chips.dart';
import 'widgets/logbook_skeleton.dart';
import 'widgets/week_navigation_header.dart';
import 'widgets/weekly_summary_card.dart';

/// Main Student Attachment Logbook Screen matching Stitch design exactly
class LogbookScreen extends StatefulWidget {
  const LogbookScreen({super.key});

  @override
  State<LogbookScreen> createState() => _LogbookScreenState();
}

class _LogbookScreenState extends State<LogbookScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<LogbookProvider>().fetchLogbooks();
    });
  }

  void _openEditor({LogbookModel? logbook, String? initialDay}) {
    final provider = context.read<LogbookProvider>();
    final targetWeek = logbook?.weekNumber ?? provider.selectedWeek;

    LogbookEditorSheet.show(
      context,
      logbook: logbook ?? provider.selectedLogbook,
      defaultWeekNumber: targetWeek,
      initialDayToFocus: initialDay,
    );
  }

  @override
  Widget build(BuildContext context) {
    final logbookProv = context.watch<LogbookProvider>();
    final authProv = context.watch<AuthProvider>();
    final workspaceProv = context.watch<WorkspaceProvider>();

    final user = authProv.user;
    final firstName = user?.name.isNotEmpty == true
        ? user!.name.split(' ').first
        : 'Student';
    final currentDay = workspaceProv.workspace?.dates.daysCompleted;

    return Scaffold(
      backgroundColor: AppColors.surface,
      body: Column(
        children: [
          // Pinned App Bar matching Stitch
          _LogbookAppBar(firstName: firstName),

          // Main Body
          Expanded(
            child: _buildBody(logbookProv, currentDay),
          ),
        ],
      ),
    );
  }

  Widget _buildBody(LogbookProvider provider, int? currentDay) {
    if (provider.isLoading && provider.logbooks.isEmpty) {
      return const LogbookSkeleton();
    }

    if (provider.errorMessage != null && provider.logbooks.isEmpty) {
      return LogbookError(
        message: provider.errorMessage!,
        onRetry: provider.retry,
      );
    }

    return RefreshIndicator(
      onRefresh: () => provider.fetchLogbooks(forceRefresh: true),
      color: AppColors.primary,
      backgroundColor: AppColors.surface,
      child: _LogbookContent(
        provider: provider,
        currentDayNumber: currentDay,
        onOpenEditor: _openEditor,
      ),
    );
  }
}

/// Pinned App Bar matching Stitch Logbook header
class _LogbookAppBar extends StatelessWidget {
  final String firstName;

  const _LogbookAppBar({required this.firstName});

  @override
  Widget build(BuildContext context) {
    final topPadding = MediaQuery.of(context).padding.top;

    return Container(
      color: AppColors.surface.withAlpha(235),
      child: Column(
        children: [
          SizedBox(height: topPadding),
          SizedBox(
            height: 56,
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppDimensions.margin,
              ),
              child: Row(
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: AppColors.surfaceContainer,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(
                      Icons.menu_book_rounded,
                      size: 18,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(width: AppDimensions.spaceSm),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'ATTACHPRO',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppTypography.labelSm.copyWith(
                            color: AppColors.onSurfaceVariant,
                            letterSpacing: 1.2,
                          ),
                        ),
                        Text(
                          'Attachment Logbook',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppTypography.headlineSm.copyWith(height: 1.1),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: AppDimensions.spaceXs),
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

/// Scrollable Logbook Content with all 5 Stitch sections
class _LogbookContent extends StatelessWidget {
  final LogbookProvider provider;
  final int? currentDayNumber;
  final void Function({LogbookModel? logbook, String? initialDay}) onOpenEditor;

  const _LogbookContent({
    required this.provider,
    this.currentDayNumber,
    required this.onOpenEditor,
  });

  static const List<String> _weekdays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
  ];

  @override
  Widget build(BuildContext context) {
    final currentLog = provider.selectedLogbook;
    final parentStatus = currentLog?.status ?? 'draft';
    final supervisorComment = currentLog?.supervisorComment;

    // Filtered weekdays
    final filteredDays = _getFilteredDays(currentLog);

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.symmetric(
        horizontal: AppDimensions.margin,
        vertical: AppDimensions.spaceMd,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section 1: Week Navigation & Meta Header
          WeekNavigationHeader(
            availableWeeks: provider.availableWeeks,
            selectedWeek: provider.selectedWeek,
            currentLogbook: currentLog,
            allLogbooks: provider.logbooks,
            onSelectWeek: provider.selectWeek,
          ),
          const SizedBox(height: AppDimensions.spaceMd),

          // Section 2: Prominent Action Banner: Add Today's Entry
          LogTodayActionBanner(
            currentDayNumber: currentDayNumber,
            onTap: () => onOpenEditor(logbook: currentLog),
          ),
          const SizedBox(height: AppDimensions.spaceMd),

          // Section 3: Status Filter Chips
          LogbookFilterChips(
            activeFilter: provider.activeFilter,
            allCount: provider.allCount,
            reviewedCount: provider.approvedCount,
            underReviewCount: provider.pendingCount,
            draftsCount: provider.draftCount,
            rejectedCount: provider.rejectedCount,
            onSelectFilter: provider.setFilter,
          ),
          const SizedBox(height: AppDimensions.spaceMd),

          // Section 4: Daily Entries Timeline List
          if (filteredDays.isEmpty)
            _EmptyFilteredState(filter: provider.activeFilter)
          else
            ...filteredDays.map((dayKey) {
              final dayIndex = _weekdays.indexOf(dayKey);
              final entry = currentLog?.getDailyEntry(dayKey);
              final date = currentLog?.dateForWeekday(dayIndex);
              final dayNum = currentDayNumber != null
                  ? (currentDayNumber! - (4 - dayIndex)).clamp(1, 999)
                  : null;

              return Padding(
                padding: const EdgeInsets.only(bottom: AppDimensions.spaceSm),
                child: DailyEntryCard(
                  dayName: dayKey,
                  dayOffset: dayIndex,
                  date: date,
                  globalDayNumber: dayNum,
                  entry: entry,
                  parentLogbookStatus: parentStatus,
                  supervisorComment: supervisorComment,
                  onEdit: () => onOpenEditor(
                    logbook: currentLog,
                    initialDay: dayKey,
                  ),
                ),
              );
            }),

          const SizedBox(height: AppDimensions.spaceXs),

          // Section 5: Weekly Summary & Total Hours Card
          WeeklySummaryCard(logbook: currentLog),

          const SizedBox(height: AppDimensions.space2xl),
        ],
      ),
    );
  }

  List<String> _getFilteredDays(LogbookModel? log) {
    if (provider.activeFilter == LogbookStatusFilter.all) {
      return _weekdays;
    }

    final result = <String>[];
    for (final day in _weekdays) {
      final entry = log?.getDailyEntry(day);
      final hasContent = entry != null && entry.hasContent;
      final status = (entry?.statusOverride ?? log?.status ?? 'draft').toLowerCase();

      switch (provider.activeFilter) {
        case LogbookStatusFilter.reviewed:
          if (hasContent && status == 'approved') result.add(day);
          break;
        case LogbookStatusFilter.underReview:
          if (hasContent && status == 'pending') result.add(day);
          break;
        case LogbookStatusFilter.rejected:
          if (hasContent && status == 'rejected') result.add(day);
          break;
        case LogbookStatusFilter.drafts:
          if (!hasContent || status == 'draft') result.add(day);
          break;
        case LogbookStatusFilter.all:
          result.add(day);
          break;
      }
    }
    return result;
  }
}

class _EmptyFilteredState extends StatelessWidget {
  final LogbookStatusFilter filter;

  const _EmptyFilteredState({required this.filter});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppDimensions.spaceLg),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
      ),
      child: Center(
        child: Column(
          children: [
            const Icon(
              Icons.filter_list_off_rounded,
              size: 28,
              color: AppColors.outline,
            ),
            const SizedBox(height: 8),
            Text(
              'No entries match this filter',
              style: AppTypography.labelMd.copyWith(color: AppColors.outline),
            ),
          ],
        ),
      ),
    );
  }
}
