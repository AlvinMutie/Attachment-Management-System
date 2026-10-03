import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';

/// Error state card with Retry button for Logbook screen
class LogbookError extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;

  const LogbookError({
    super.key,
    required this.message,
    required this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppDimensions.margin),
        child: Container(
          padding: const EdgeInsets.all(AppDimensions.spaceXl),
          decoration: BoxDecoration(
            color: AppColors.surfaceContainerLowest,
            borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withAlpha(10),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: AppColors.errorContainer,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.sync_problem_rounded,
                  size: 28,
                  color: AppColors.onErrorContainer,
                ),
              ),
              const SizedBox(height: AppDimensions.spaceMd),
              Text(
                'Unable to load logbooks',
                style: AppTypography.headlineSm,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppDimensions.spaceXs),
              Text(
                message,
                style: AppTypography.bodySm.copyWith(
                  color: AppColors.onSurfaceVariant,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppDimensions.spaceLg),
              SizedBox(
                height: 44,
                child: ElevatedButton.icon(
                  onPressed: onRetry,
                  icon: const Icon(Icons.refresh_rounded, size: 18),
                  label: const Text('Retry'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: AppColors.onPrimary,
                    shape: const StadiumBorder(),
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
