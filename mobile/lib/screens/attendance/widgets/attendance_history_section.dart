import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../models/attendance_model.dart';
import '../../../providers/attendance_provider.dart';

/// Section rendering attendance records history with filter tabs matching Stitch
class AttendanceHistorySection extends StatelessWidget {
  final List<AttendanceRecord> records;
  final AttendanceFilter activeFilter;
  final int allCount;
  final int verifiedCount;
  final int excusedCount;
  final ValueChanged<AttendanceFilter> onSelectFilter;

  const AttendanceHistorySection({
    super.key,
    required this.records,
    required this.activeFilter,
    required this.allCount,
    required this.verifiedCount,
    required this.excusedCount,
    required this.onSelectFilter,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Header
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(
                'Recent Attendance Logs',
                style: AppTypography.headlineSm.copyWith(
                  color: AppColors.onSurface,
                  fontWeight: FontWeight.w700,
                  fontSize: 18,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(width: 8),
            Text(
              'Academic Log',
              style: AppTypography.labelMd.copyWith(
                color: AppColors.secondary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),

        const SizedBox(height: 12),

        // Filter Tabs
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              _filterTab(
                label: 'All ($allCount)',
                isSelected: activeFilter == AttendanceFilter.all,
                onTap: () => onSelectFilter(AttendanceFilter.all),
              ),
              const SizedBox(width: 8),
              _filterTab(
                label: 'Verified ($verifiedCount)',
                isSelected: activeFilter == AttendanceFilter.verified,
                onTap: () => onSelectFilter(AttendanceFilter.verified),
              ),
              const SizedBox(width: 8),
              _filterTab(
                label: 'Excused ($excusedCount)',
                isSelected: activeFilter == AttendanceFilter.excused,
                onTap: () => onSelectFilter(AttendanceFilter.excused),
              ),
            ],
          ),
        ),

        const SizedBox(height: 12),

        // Log Items or Empty State
        if (records.isEmpty)
          _buildEmptyState()
        else
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: records.length,
            separatorBuilder: (context, index) => const SizedBox(height: 10),
            itemBuilder: (context, index) {
              final record = records[index];
              // Assign day number (counting from 1 to N, or total - index)
              final dayNumber = (allCount - index).clamp(1, 999);
              return _AttendanceLogCard(
                record: record,
                dayNumber: dayNumber,
              );
            },
          ),
      ],
    );
  }

  Widget _filterTab({
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.surfaceVariant
              : AppColors.surfaceContainerLowest,
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            if (!isSelected)
              const BoxShadow(
                color: Color.fromRGBO(0, 0, 0, 0.02),
                blurRadius: 4,
                offset: Offset(0, 1),
              ),
          ],
        ),
        child: Text(
          label,
          style: AppTypography.labelSm.copyWith(
            color: isSelected ? AppColors.primary : AppColors.onSurfaceVariant,
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 16),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
      ),
      child: Column(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerLow,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.event_busy_rounded,
              color: AppColors.outline,
              size: 24,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'No attendance records found',
            style: AppTypography.titleMd.copyWith(
              color: AppColors.onSurface,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Records will appear here once verified on-site by your supervisor.',
            style: AppTypography.bodySm.copyWith(
              color: AppColors.onSurfaceVariant,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class _AttendanceLogCard extends StatelessWidget {
  final AttendanceRecord record;
  final int dayNumber;

  const _AttendanceLogCard({
    required this.record,
    required this.dayNumber,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppDimensions.spaceSm + 4),
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
          // Header row: Day number box + Date & shift title + Status badge
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: record.isExcused
                            ? AppColors.secondaryFixed
                            : AppColors.surfaceContainer,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Center(
                        child: Text(
                          '$dayNumber',
                          style: AppTypography.labelMd.copyWith(
                            color: record.isExcused
                                ? AppColors.secondary
                                : AppColors.primary,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            record.formattedShortDate,
                            style: AppTypography.titleMd.copyWith(
                              color: AppColors.onSurface,
                              fontWeight: FontWeight.w700,
                              fontSize: 14,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            record.isExcused
                                ? (record.notes ?? 'Excused absence approved')
                                : 'Standard working shift',
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
              ),
              const SizedBox(width: 8),
              _buildStatusBadge(record),
            ],
          ),

          const SizedBox(height: 10),

          // Detail 3-Column Grid
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.surfaceContainerLow,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _colItem('Check In', record.formattedCheckInTime),
                _colItem('Check Out', record.isVerified ? '05:00 PM' : 'N/A'),
                _colItem('Duration', record.isVerified ? '8h 00m' : '0h 00m', isPrimary: true),
              ],
            ),
          ),

          const SizedBox(height: 8),

          // Bottom verification signature line
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Icon(
                      record.isVerified
                          ? Icons.verified_rounded
                          : (record.isExcused
                              ? Icons.description_outlined
                              : Icons.cancel_outlined),
                          size: 15,
                          color: record.isVerified
                              ? AppColors.secondary
                              : (record.isExcused
                                  ? AppColors.secondary
                                  : AppColors.error),
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        record.notes != null && record.notes!.isNotEmpty
                            ? record.notes!
                            : (record.isVerified
                                ? 'Verified on-site: Dynamic QR'
                                : 'Unexcused absence'),
                        style: AppTypography.bodySm.copyWith(
                          color: AppColors.onSurfaceVariant,
                          fontSize: 11,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 6),
              const Icon(
                Icons.chevron_right_rounded,
                size: 18,
                color: AppColors.outline,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _colItem(String label, String value, {bool isPrimary = false}) {
    return Column(
      children: [
        Text(
          label,
          style: AppTypography.labelSm.copyWith(
            color: AppColors.onSurfaceVariant,
            fontSize: 11,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: AppTypography.labelMd.copyWith(
            color: isPrimary ? AppColors.primary : AppColors.onSurface,
            fontWeight: isPrimary ? FontWeight.w700 : FontWeight.w600,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildStatusBadge(AttendanceRecord r) {
    Color bg;
    Color fg;
    String text;

    if (r.isPresent) {
      bg = AppColors.tertiaryFixed;
      fg = AppColors.onTertiaryFixed;
      text = 'Verified On-site';
    } else if (r.isLate) {
      bg = const Color(0xFFFEF3C7);
      fg = const Color(0xFF92400E);
      text = 'Late Entry';
    } else if (r.isExcused) {
      bg = AppColors.secondaryFixed;
      fg = AppColors.onSecondaryFixedVariant;
      text = 'Excused Medical';
    } else {
      bg = AppColors.errorContainer;
      fg = AppColors.onErrorContainer;
      text = 'Unexcused';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
      ),
      child: Text(
        text,
        style: AppTypography.labelSm.copyWith(
          color: fg,
          fontWeight: FontWeight.w700,
          fontSize: 11,
        ),
      ),
    );
  }
}
