import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';

/// Loading skeleton for Attendance screen matching Stitch layout
class AttendanceSkeleton extends StatelessWidget {
  const AttendanceSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: AppDimensions.margin),
      physics: const NeverScrollableScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 12),
          // Student identity card skeleton
          _skeletonBox(height: 90),
          const SizedBox(height: 12),
          // Rate primary card
          _skeletonBox(height: 110),
          const SizedBox(height: 10),
          // Two sub-stat cards
          Row(
            children: [
              Expanded(child: _skeletonBox(height: 84)),
              const SizedBox(width: 10),
              Expanded(child: _skeletonBox(height: 84)),
            ],
          ),
          const SizedBox(height: 16),
          // Action hero card
          _skeletonBox(height: 130),
          const SizedBox(height: 20),
          // History section header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _skeletonBox(width: 160, height: 20),
              _skeletonBox(width: 60, height: 16),
            ],
          ),
          const SizedBox(height: 12),
          // Filter pills
          Row(
            children: [
              _skeletonBox(width: 70, height: 28, radius: 8),
              const SizedBox(width: 8),
              _skeletonBox(width: 90, height: 28, radius: 8),
              const SizedBox(width: 8),
              _skeletonBox(width: 80, height: 28, radius: 8),
            ],
          ),
          const SizedBox(height: 12),
          // Log items
          _skeletonBox(height: 120),
          const SizedBox(height: 10),
          _skeletonBox(height: 120),
          const SizedBox(height: 10),
          _skeletonBox(height: 120),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _skeletonBox({
    double? width,
    required double height,
    double radius = 12,
  }) {
    return Container(
      width: width ?? double.infinity,
      height: height,
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerHigh.withValues(alpha: 0.55),
        borderRadius: BorderRadius.circular(radius),
      ),
    );
  }
}
