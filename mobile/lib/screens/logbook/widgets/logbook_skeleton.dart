import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';

/// Shimmer loading skeleton matching the Stitch Logbook layout
class LogbookSkeleton extends StatefulWidget {
  const LogbookSkeleton({super.key});

  @override
  State<LogbookSkeleton> createState() => _LogbookSkeletonState();
}

class _LogbookSkeletonState extends State<LogbookSkeleton>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _shimmerAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);

    _shimmerAnim = Tween<double>(begin: 0.35, end: 0.85).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _shimmerAnim,
      builder: (context, _) {
        final opacity = _shimmerAnim.value;

        return SingleChildScrollView(
          physics: const NeverScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(
            horizontal: AppDimensions.margin,
            vertical: AppDimensions.spaceMd,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Section 1: Week Navigation Skeleton
              _skeletonCard(
                opacity: opacity,
                height: 180,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _box(width: 120, height: 12, opacity: opacity),
                    const SizedBox(height: 8),
                    _box(width: 220, height: 20, opacity: opacity),
                    const SizedBox(height: 16),
                    Row(
                      children: List.generate(
                        4,
                        (i) => Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: _box(
                            width: 72,
                            height: 32,
                            radius: 8,
                            opacity: opacity,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    _box(width: double.infinity, height: 36, opacity: opacity),
                  ],
                ),
              ),
              const SizedBox(height: AppDimensions.spaceMd),

              // Section 2: Action Banner Skeleton
              _skeletonCard(
                opacity: opacity,
                height: 96,
                color: AppColors.primary.withAlpha((255 * opacity).round()),
                child: const SizedBox.shrink(),
              ),
              const SizedBox(height: AppDimensions.spaceMd),

              // Section 3: Filter Chips Skeleton
              Row(
                children: List.generate(
                  4,
                  (i) => Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: _box(
                      width: 64 + (i * 12).toDouble(),
                      height: 30,
                      radius: 8,
                      opacity: opacity,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: AppDimensions.spaceMd),

              // Section 4: Daily Entry Skeletons
              ...List.generate(
                3,
                (i) => Padding(
                  padding: const EdgeInsets.only(bottom: AppDimensions.spaceSm),
                  child: _skeletonCard(
                    opacity: opacity,
                    height: 110,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _box(width: 140, height: 12, opacity: opacity),
                            _box(width: 90, height: 22, radius: 4, opacity: opacity),
                          ],
                        ),
                        const SizedBox(height: 8),
                        _box(width: 260, height: 16, opacity: opacity),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            _box(width: 60, height: 20, radius: 4, opacity: opacity),
                            const SizedBox(width: 8),
                            _box(width: 110, height: 20, radius: 4, opacity: opacity),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _skeletonCard({
    required double opacity,
    required double height,
    Color? color,
    Widget? child,
  }) {
    return Container(
      width: double.infinity,
      height: height,
      padding: const EdgeInsets.all(AppDimensions.spaceMd),
      decoration: BoxDecoration(
        color: color ?? AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(6),
            blurRadius: 4,
          ),
        ],
      ),
      child: child,
    );
  }

  Widget _box({
    required double width,
    required double height,
    double radius = 4,
    required double opacity,
  }) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerHighest.withAlpha((255 * opacity).round()),
        borderRadius: BorderRadius.circular(radius),
      ),
    );
  }
}
