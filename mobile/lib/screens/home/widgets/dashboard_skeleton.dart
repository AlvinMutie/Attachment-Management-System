import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';

/// Shimmer-style skeleton loading for the dashboard
class DashboardSkeleton extends StatefulWidget {
  const DashboardSkeleton({super.key});

  @override
  State<DashboardSkeleton> createState() => _DashboardSkeletonState();
}

class _DashboardSkeletonState extends State<DashboardSkeleton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _shimmer;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat(reverse: true);
    _shimmer = Tween<double>(begin: 0.4, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _shimmer,
      builder: (_, __) {
        final alpha = (_shimmer.value * 255).toInt();
        return ListView(
          padding: const EdgeInsets.symmetric(
            horizontal: AppDimensions.margin,
            vertical: AppDimensions.spaceMd,
          ),
          physics: const NeverScrollableScrollPhysics(),
          children: [
            // Header skeleton
            _SkeletonBlock(height: 28, width: 200, alpha: alpha),
            const SizedBox(height: 8),
            _SkeletonBlock(height: 16, width: 260, alpha: alpha),
            const SizedBox(height: AppDimensions.spaceLg),

            // Progress card skeleton
            _SkeletonCard(height: 220, alpha: alpha),
            const SizedBox(height: AppDimensions.spaceSm),

            // Placement card skeleton
            _SkeletonCard(height: 180, alpha: alpha),
            const SizedBox(height: AppDimensions.spaceSm),

            // Action item skeletons
            _SkeletonBlock(height: 22, width: 160, alpha: alpha),
            const SizedBox(height: 8),
            _SkeletonCard(height: 110, alpha: alpha),
            const SizedBox(height: AppDimensions.spaceXs),
            _SkeletonCard(height: 110, alpha: alpha),
          ],
        );
      },
    );
  }
}

class _SkeletonCard extends StatelessWidget {
  final double height;
  final int alpha;

  const _SkeletonCard({required this.height, required this.alpha});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: height,
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerHigh.withAlpha(alpha),
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
      ),
    );
  }
}

class _SkeletonBlock extends StatelessWidget {
  final double height;
  final double? width;
  final int alpha;

  const _SkeletonBlock({required this.height, this.width, required this.alpha});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerHigh.withAlpha(alpha),
        borderRadius: BorderRadius.circular(6),
      ),
    );
  }
}
