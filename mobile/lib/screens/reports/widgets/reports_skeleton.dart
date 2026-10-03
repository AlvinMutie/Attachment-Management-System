import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';

/// Shimmer loading skeleton for Reports screen matching Stitch design
class ReportsSkeleton extends StatelessWidget {
  const ReportsSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: AppDimensions.margin),
      physics: const NeverScrollableScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 12),
          // Academic Readiness Hero Skeleton
          _skeletonBox(height: 140, radius: AppDimensions.radiusLg),
          const SizedBox(height: 14),

          // Bento Stats Grid Skeleton (2x2)
          Row(
            children: [
              Expanded(child: _skeletonBox(height: 96, radius: AppDimensions.radiusMd)),
              const SizedBox(width: 10),
              Expanded(child: _skeletonBox(height: 96, radius: AppDimensions.radiusMd)),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(child: _skeletonBox(height: 96, radius: AppDimensions.radiusMd)),
              const SizedBox(width: 10),
              Expanded(child: _skeletonBox(height: 96, radius: AppDimensions.radiusMd)),
            ],
          ),
          const SizedBox(height: 16),

          // Tab Bar Skeleton
          Row(
            children: [
              _skeletonBox(width: 110, height: 34, radius: AppDimensions.radiusFull),
              const SizedBox(width: 8),
              _skeletonBox(width: 120, height: 34, radius: AppDimensions.radiusFull),
              const SizedBox(width: 8),
              _skeletonBox(width: 100, height: 34, radius: AppDimensions.radiusFull),
            ],
          ),
          const SizedBox(height: 16),

          // Assessment Cards Skeleton
          _skeletonBox(height: 160, radius: AppDimensions.radiusLg),
          const SizedBox(height: 12),
          _skeletonBox(height: 160, radius: AppDimensions.radiusLg),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _skeletonBox({
    double? width,
    required double height,
    double radius = AppDimensions.radiusMd,
  }) {
    return Container(
      width: width ?? double.infinity,
      height: height,
      decoration: BoxDecoration(
        color: AppColors.surfaceContainer,
        borderRadius: BorderRadius.circular(radius),
      ),
    );
  }
}
