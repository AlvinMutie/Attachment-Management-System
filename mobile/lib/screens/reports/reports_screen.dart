import 'package:flutter/material.dart';
import '../../widgets/placeholder_screen.dart';
import '../../core/constants/app_colors.dart';

class ReportsScreen extends StatelessWidget {
  const ReportsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(title: const Text('Reports')),
      body: const PlaceholderScreen(
        title: 'Evaluations & Reports',
        icon: Icons.assignment_turned_in_outlined,
        description: 'Weekly reports and evaluations will appear here. Coming in Phase 3.',
      ),
    );
  }
}
