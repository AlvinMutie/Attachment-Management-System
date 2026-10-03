import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';

/// Stitch-styled horizontal tab selector for Reports screen
class ReportsTabBar extends StatelessWidget {
  final String selectedTab;
  final int totalEvaluations;
  final ValueChanged<String> onTabSelected;

  const ReportsTabBar({
    super.key,
    required this.selectedTab,
    required this.totalEvaluations,
    required this.onTabSelected,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          _tabChip(
            id: 'all',
            label: 'All Evaluations',
            count: totalEvaluations,
            icon: Icons.assignment_outlined,
          ),
          const SizedBox(width: 8),
          _tabChip(
            id: 'rubric',
            label: 'Clearance Rubric',
            count: 8,
            icon: Icons.rule_folder_outlined,
          ),
          const SizedBox(width: 8),
          _tabChip(
            id: 'documents',
            label: 'Institutional Documents',
            count: 4,
            icon: Icons.folder_shared_outlined,
          ),
        ],
      ),
    );
  }

  Widget _tabChip({
    required String id,
    required String label,
    required int count,
    required IconData icon,
  }) {
    final isSelected = selectedTab == id;

    return InkWell(
      onTap: () => onTabSelected(id),
      borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primaryContainer
              : AppColors.surfaceContainerLowest,
          borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
          border: Border.all(
            color: isSelected
                ? AppColors.primaryContainer
                : AppColors.surfaceContainerHigh,
            width: 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppColors.primaryContainer.withValues(alpha: 0.25),
                    blurRadius: 4,
                    offset: const Offset(0, 1),
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 14,
              color: isSelected ? AppColors.onPrimary : AppColors.onSurfaceVariant,
            ),
            const SizedBox(width: 6),
            Text(
              '$label ($count)',
              style: AppTypography.labelSm.copyWith(
                color: isSelected
                    ? AppColors.onPrimary
                    : AppColors.onSurfaceVariant,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                fontSize: 11,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
