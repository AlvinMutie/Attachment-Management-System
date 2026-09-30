import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_dimensions.dart';
import '../core/constants/app_typography.dart';
import '../screens/home/dashboard_screen.dart';
import '../screens/logbook/logbook_screen.dart';
import '../screens/reports/reports_screen.dart';
import '../screens/alerts/alerts_screen.dart';
import '../screens/more/more_screen.dart';

/// Main bottom navigation shell matching Stitch design exactly:
/// Home | Logbook | Reports | Alerts | More
class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _currentIndex = 0;

  static const List<_NavItem> _navItems = [
    _NavItem(
      label: 'Home',
      icon: Icons.dashboard_outlined,
      selectedIcon: Icons.dashboard,
      semanticLabel: 'Home dashboard',
    ),
    _NavItem(
      label: 'Logbook',
      icon: Icons.menu_book_outlined,
      selectedIcon: Icons.menu_book,
      semanticLabel: 'Attachment logbook',
    ),
    _NavItem(
      label: 'Reports',
      icon: Icons.assignment_turned_in_outlined,
      selectedIcon: Icons.assignment_turned_in,
      semanticLabel: 'Evaluations and reports',
    ),
    _NavItem(
      label: 'Alerts',
      icon: Icons.notifications_outlined,
      selectedIcon: Icons.notifications,
      semanticLabel: 'Activity notifications',
      hasBadge: true,
    ),
    _NavItem(
      label: 'More',
      icon: Icons.apps_outlined,
      selectedIcon: Icons.apps,
      semanticLabel: 'More options and settings',
    ),
  ];

  // Lazy-initialized screens
  late final List<Widget> _screens = [
    const DashboardScreen(),
    const LogbookScreen(),
    const ReportsScreen(),
    const AlertsScreen(),
    const MoreScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: _StitchBottomNavBar(
        currentIndex: _currentIndex,
        items: _navItems,
        onTap: (index) => setState(() => _currentIndex = index),
      ),
    );
  }
}

/// Custom Bottom Navigation Bar matching Stitch design with pill-shaped indicators
class _StitchBottomNavBar extends StatelessWidget {
  final int currentIndex;
  final List<_NavItem> items;
  final ValueChanged<int> onTap;

  const _StitchBottomNavBar({
    required this.currentIndex,
    required this.items,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final bottomPadding = MediaQuery.of(context).padding.bottom;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface.withAlpha(242),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(10),
            blurRadius: 12,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            height: AppDimensions.bottomNavHeight,
            child: Row(
              children: List.generate(
                items.length,
                (i) => Expanded(
                  child: _NavBarItem(
                    item: items[i],
                    isSelected: i == currentIndex,
                    onTap: () => onTap(i),
                  ),
                ),
              ),
            ),
          ),
          // Home indicator bar
          SizedBox(
            height: bottomPadding + 8,
            child: Align(
              alignment: Alignment.topCenter,
              child: Container(
                width: 128,
                height: 4,
                margin: const EdgeInsets.only(top: 4),
                decoration: BoxDecoration(
                  color: AppColors.onSurface.withAlpha(50),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _NavBarItem extends StatelessWidget {
  final _NavItem item;
  final bool isSelected;
  final VoidCallback onTap;

  const _NavBarItem({
    required this.item,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: item.semanticLabel,
      selected: isSelected,
      button: true,
      child: InkWell(
        onTap: onTap,
        splashColor: Colors.transparent,
        highlightColor: Colors.transparent,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Pill indicator + icon
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 64,
              height: 32,
              decoration: BoxDecoration(
                color: isSelected ? AppColors.surfaceVariant : Colors.transparent,
                borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Icon(
                    isSelected ? item.selectedIcon : item.icon,
                    size: 22,
                    color: isSelected
                        ? AppColors.primary
                        : AppColors.onSurfaceVariant,
                  ),
                  // Notification badge
                  if (item.hasBadge)
                    Positioned(
                      top: 4,
                      right: 10,
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: AppColors.error,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: AppColors.surface,
                            width: 1.5,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 2),
            // Label
            AnimatedDefaultTextStyle(
              duration: const Duration(milliseconds: 200),
              style: AppTypography.labelSm.copyWith(
                color: isSelected
                    ? AppColors.primary
                    : AppColors.onSurfaceVariant,
                fontWeight:
                    isSelected ? FontWeight.w600 : FontWeight.w500,
              ),
              child: Text(item.label),
            ),
          ],
        ),
      ),
    );
  }
}

class _NavItem {
  final String label;
  final IconData icon;
  final IconData selectedIcon;
  final String semanticLabel;
  final bool hasBadge;

  const _NavItem({
    required this.label,
    required this.icon,
    required this.selectedIcon,
    required this.semanticLabel,
    this.hasBadge = false,
  });
}
