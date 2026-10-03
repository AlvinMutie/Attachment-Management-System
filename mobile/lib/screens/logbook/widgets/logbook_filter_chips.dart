import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_typography.dart';
import '../../../providers/logbook_provider.dart';

/// Section 3: Status Filter Chips matching Stitch
class LogbookFilterChips extends StatelessWidget {
  final LogbookStatusFilter activeFilter;
  final int allCount;
  final int reviewedCount;
  final int underReviewCount;
  final int draftsCount;
  final int rejectedCount;
  final ValueChanged<LogbookStatusFilter> onSelectFilter;

  const LogbookFilterChips({
    super.key,
    required this.activeFilter,
    required this.allCount,
    required this.reviewedCount,
    required this.underReviewCount,
    required this.draftsCount,
    required this.rejectedCount,
    required this.onSelectFilter,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          _FilterChipItem(
            label: 'All ($allCount)',
            isSelected: activeFilter == LogbookStatusFilter.all,
            onTap: () => onSelectFilter(LogbookStatusFilter.all),
          ),
          const SizedBox(width: 8),
          _FilterChipItem(
            label: 'Reviewed ($reviewedCount)',
            dotColor: AppColors.tertiary,
            isSelected: activeFilter == LogbookStatusFilter.reviewed,
            onTap: () => onSelectFilter(LogbookStatusFilter.reviewed),
          ),
          const SizedBox(width: 8),
          _FilterChipItem(
            label: 'Under Review ($underReviewCount)',
            dotColor: AppColors.secondary,
            isSelected: activeFilter == LogbookStatusFilter.underReview,
            onTap: () => onSelectFilter(LogbookStatusFilter.underReview),
          ),
          const SizedBox(width: 8),
          _FilterChipItem(
            label: 'Drafts ($draftsCount)',
            dotColor: AppColors.outline,
            isSelected: activeFilter == LogbookStatusFilter.drafts,
            onTap: () => onSelectFilter(LogbookStatusFilter.drafts),
          ),
          const SizedBox(width: 8),
          _FilterChipItem(
            label: 'Rejected ($rejectedCount)',
            dotColor: AppColors.error,
            isSelected: activeFilter == LogbookStatusFilter.rejected,
            onTap: () => onSelectFilter(LogbookStatusFilter.rejected),
          ),
        ],
      ),
    );
  }
}

class _FilterChipItem extends StatelessWidget {
  final String label;
  final Color? dotColor;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterChipItem({
    required this.label,
    this.dotColor,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.surfaceVariant
              : AppColors.surfaceContainerLowest,
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            if (!isSelected)
              BoxShadow(
                color: Colors.black.withAlpha(6),
                blurRadius: 3,
                offset: const Offset(0, 1),
              ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (dotColor != null) ...[
              Container(
                width: 7,
                height: 7,
                decoration: BoxDecoration(
                  color: dotColor,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 6),
            ],
            Text(
              label,
              style: AppTypography.labelMd.copyWith(
                color: isSelected
                    ? AppColors.primary
                    : AppColors.onSurfaceVariant,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
