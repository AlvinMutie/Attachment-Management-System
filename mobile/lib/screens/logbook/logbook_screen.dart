import 'package:flutter/material.dart';
import '../../widgets/placeholder_screen.dart';
import '../../core/constants/app_colors.dart';

class LogbookScreen extends StatelessWidget {
  const LogbookScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(title: const Text('Logbook')),
      body: const PlaceholderScreen(
        title: 'Attachment Logbook',
        icon: Icons.menu_book_outlined,
        description: 'Daily logbook entries and submissions will appear here. Coming in Phase 3.',
      ),
    );
  }
}
