import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import '../../core/constants/app_typography.dart';
import '../../providers/auth_provider.dart';

/// Dashboard/Home screen - stub for Phase 3 implementation
class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;

    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // Top app bar
            SliverAppBar(
              backgroundColor: AppColors.surface,
              pinned: true,
              elevation: 0,
              automaticallyImplyLeading: false,
              flexibleSpace: FlexibleSpaceBar(
                titlePadding: const EdgeInsets.symmetric(
                  horizontal: AppDimensions.margin,
                  vertical: 12,
                ),
                title: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'Good morning,',
                          style: AppTypography.bodySm,
                        ),
                        Text(
                          user?.name.split(' ').first ?? 'Student',
                          style: AppTypography.headlineSm,
                        ),
                      ],
                    ),
                    CircleAvatar(
                      backgroundColor: AppColors.primaryContainer,
                      radius: 20,
                      child: Text(
                        (user?.name.isNotEmpty == true)
                            ? user!.name[0].toUpperCase()
                            : 'S',
                        style: AppTypography.titleMd.copyWith(
                          color: AppColors.onPrimary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Placeholder body
            SliverFillRemaining(
              hasScrollBody: false,
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(AppDimensions.space2xl),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceContainer,
                          borderRadius:
                              BorderRadius.circular(AppDimensions.radius2xl),
                        ),
                        child: const Icon(Icons.dashboard_rounded,
                            size: 40, color: AppColors.primary),
                      ),
                      const SizedBox(height: 20),
                      Text('Dashboard', style: AppTypography.headlineSm),
                      const SizedBox(height: 8),
                      Text(
                        'Your full dashboard is being built.\nPhase 3 will populate this screen with live data.',
                        style: AppTypography.bodyMd
                            .copyWith(color: AppColors.onSurfaceVariant),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
