import 'package:flutter/material.dart';
import '../../widgets/placeholder_screen.dart';
import '../../core/constants/app_colors.dart';

class AlertsScreen extends StatelessWidget {
  const AlertsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(title: const Text('Alerts')),
      body: const PlaceholderScreen(
        title: 'Activity & Notifications',
        icon: Icons.notifications_outlined,
        description: 'Supervisor reviews and system notifications will appear here.',
      ),
    );
  }
}
