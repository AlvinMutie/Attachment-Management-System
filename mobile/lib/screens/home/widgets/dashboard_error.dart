import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';

/// Clean error state for the dashboard with retry action
class DashboardError extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;

  const DashboardError({
    super.key,
    required this.message,
    required this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppDimensions.space2xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: AppColors.errorContainer,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.wifi_off_rounded,
                size: 36,
                color: AppColors.onErrorContainer,
              ),
            ),
            const SizedBox(height: AppDimensions.spaceLg),
            Text(
              'Unable to load dashboard',
              style: AppTypography.headlineSm,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              message,
              style: AppTypography.bodyMd.copyWith(
                color: AppColors.onSurfaceVariant,
              ),
              textAlign: TextAlign.center,
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: AppDimensions.spaceLg),
            SizedBox(
              height: 48,
              child: ElevatedButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh_rounded, size: 20),
                label: const Text('Retry'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryContainer,
                  foregroundColor: AppColors.onPrimary,
                  shape: const StadiumBorder(),
                  padding: const EdgeInsets.symmetric(
                      horizontal: AppDimensions.space2xl),
                  textStyle: AppTypography.labelLg,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
