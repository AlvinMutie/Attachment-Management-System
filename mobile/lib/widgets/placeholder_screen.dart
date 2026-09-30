import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_typography.dart';
import '../core/constants/app_dimensions.dart';

/// Scaffold placeholder for screens that are not yet implemented
class PlaceholderScreen extends StatelessWidget {
  final String title;
  final IconData icon;
  final String description;
  final Color? iconColor;
  final Color? iconBgColor;

  const PlaceholderScreen({
    super.key,
    required this.title,
    required this.icon,
    this.description = 'This section is coming soon.',
    this.iconColor,
    this.iconBgColor,
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
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: iconBgColor ?? AppColors.surfaceContainer,
                borderRadius: BorderRadius.circular(AppDimensions.radius2xl),
              ),
              child: Icon(
                icon,
                size: 40,
                color: iconColor ?? AppColors.primary,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              title,
              style: AppTypography.headlineSm,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              description,
              style: AppTypography.bodyMd.copyWith(
                color: AppColors.onSurfaceVariant,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
