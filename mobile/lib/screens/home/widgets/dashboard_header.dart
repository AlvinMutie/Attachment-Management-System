import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';

/// Header section: greeting, today's date chip, and attachment day indicator
class DashboardHeader extends StatelessWidget {
  final String firstName;
  final int? daysCompleted;
  final int? totalDays;

  const DashboardHeader({
    super.key,
    required this.firstName,
    this.daysCompleted,
    this.totalDays,
  });

  String _greeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  String _formattedDate() {
    final now = DateTime.now();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return '${now.day.toString().padLeft(2, '0')} ${months[now.month - 1]} ${now.year}';
  }

  @override
  Widget build(BuildContext context) {
    final hasAttachment = daysCompleted != null && totalDays != null && totalDays! > 0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Greeting + date chip
        Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Expanded(
              child: RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: '${_greeting()}, $firstName ',
                      style: AppTypography.headlineLg.copyWith(
                        color: AppColors.onSurface,
                      ),
                    ),
                    const TextSpan(
                      text: '👋',
                      style: TextStyle(fontSize: 26),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.surfaceContainerHigh,
                borderRadius:
                    BorderRadius.circular(AppDimensions.radiusFull),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withAlpha(8),
                    blurRadius: 4,
                  ),
                ],
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.calendar_today_outlined,
                      size: 14, color: AppColors.primary),
                  const SizedBox(width: 4),
                  Text(
                    _formattedDate(),
                    style: AppTypography.labelSm.copyWith(
                      color: AppColors.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),

        // Attachment day sub-line
        Row(
          children: [
            Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                color: AppColors.secondary,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 6),
            Text(
              hasAttachment
                  ? 'Day $daysCompleted of your $totalDays-day industrial attachment'
                  : 'Set up your attachment placement to get started',
              style: AppTypography.bodyMd.copyWith(
                color: AppColors.onSurfaceVariant,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
