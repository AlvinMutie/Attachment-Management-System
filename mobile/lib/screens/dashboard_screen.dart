import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../constants/theme.dart';
import '../constants/api_constants.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  List<dynamic> _students = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    setState(() => _isLoading = true);
    final result = await ApiService.get(ApiConstants.presence);
    if (result['success'] == true && result['data'] != null) {
      setState(() {
        _students = result['data'];
        _isLoading = false;
      });
    } else {
      setState(() => _isLoading = false);
    }
  }

  int get _presentCount => _students.where((s) =>
      s['presenceStatus'] == 'present' || s['presenceStatus'] == 'checked-in').length;

  int get _pendingLogbooks => _students.where((s) =>
      s['latestLogbook'] != null && s['latestLogbook']['status'] == 'pending').length;

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final userName = auth.user?['name'] ?? 'Supervisor';

    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _fetchData,
          color: AppColors.primary,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'INDUSTRY SUPERVISOR',
                            style: Theme.of(context).textTheme.labelSmall?.copyWith(
                              color: AppColors.primary,
                              letterSpacing: 3,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Welcome, ${userName.split(' ').first}',
                            style: Theme.of(context).textTheme.headlineMedium,
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppColors.success.withAlpha(25),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.success.withAlpha(50)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: AppColors.success,
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(color: AppColors.success.withAlpha(150), blurRadius: 6),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          const Text(
                            'ONLINE',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                              color: AppColors.success,
                              letterSpacing: 2,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ).animate().fadeIn(duration: 500.ms),

                const SizedBox(height: 28),

                // Stat cards
                Row(
                  children: [
                    Expanded(child: _StatCard(
                      icon: Icons.people_rounded,
                      label: 'STUDENTS',
                      value: '${_students.length}',
                      color: AppColors.primary,
                      isLoading: _isLoading,
                    )),
                    const SizedBox(width: 12),
                    Expanded(child: _StatCard(
                      icon: Icons.check_circle_rounded,
                      label: 'PRESENT',
                      value: '$_presentCount',
                      color: AppColors.success,
                      isLoading: _isLoading,
                    )),
                  ],
                ).animate().fadeIn(delay: 200.ms, duration: 500.ms),

                const SizedBox(height: 12),

                Row(
                  children: [
                    Expanded(child: _StatCard(
                      icon: Icons.pending_actions_rounded,
                      label: 'PENDING',
                      value: '$_pendingLogbooks',
                      color: AppColors.warning,
                      isLoading: _isLoading,
                    )),
                    const SizedBox(width: 12),
                    Expanded(child: _StatCard(
                      icon: Icons.trending_up_rounded,
                      label: 'RATE',
                      value: _students.isEmpty
                          ? '0%'
                          : '${((_presentCount / _students.length) * 100).round()}%',
                      color: AppColors.purple,
                      isLoading: _isLoading,
                    )),
                  ],
                ).animate().fadeIn(delay: 300.ms, duration: 500.ms),

                const SizedBox(height: 28),

                // Quick actions
                Text(
                  'QUICK ACTIONS',
                  style: Theme.of(context).textTheme.labelSmall,
                ),
                const SizedBox(height: 12),

                Row(
                  children: [
                    Expanded(
                      child: _QuickAction(
                        icon: Icons.qr_code_scanner_rounded,
                        label: 'Scan QR',
                        color: AppColors.primary,
                        onTap: () {
                          // Navigate to scanner tab
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _QuickAction(
                        icon: Icons.people_alt_rounded,
                        label: 'Presence',
                        color: AppColors.success,
                        onTap: () {},
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _QuickAction(
                        icon: Icons.message_rounded,
                        label: 'Messages',
                        color: AppColors.info,
                        onTap: () {},
                      ),
                    ),
                  ],
                ).animate().fadeIn(delay: 400.ms, duration: 500.ms),

                const SizedBox(height: 28),

                // Student roster
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'STUDENT ROSTER',
                      style: Theme.of(context).textTheme.labelSmall,
                    ),
                    Text(
                      '${_students.length} assigned',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.textMuted,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                if (_isLoading)
                  ...List.generate(3, (i) => Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: Container(
                      height: 80,
                      decoration: BoxDecoration(
                        color: AppColors.card,
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ))
                else if (_students.isEmpty)
                  Container(
                    padding: const EdgeInsets.all(40),
                    decoration: BoxDecoration(
                      color: AppColors.card,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFF1E293B)),
                    ),
                    child: const Center(
                      child: Column(
                        children: [
                          Icon(Icons.people_outline_rounded, size: 48, color: AppColors.textMuted),
                          SizedBox(height: 12),
                          Text(
                            'No students assigned yet',
                            style: TextStyle(color: AppColors.textMuted, fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                    ),
                  )
                else
                  ..._students.asMap().entries.map((entry) {
                    final i = entry.key;
                    final student = entry.value;
                    return _StudentRow(student: student)
                        .animate()
                        .fadeIn(delay: Duration(milliseconds: 500 + i * 100), duration: 400.ms)
                        .slideX(begin: 0.1);
                  }),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;
  final bool isLoading;

  const _StatCard({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textMuted,
                  letterSpacing: 2,
                ),
              ),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withAlpha(25),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 18),
              ),
            ],
          ),
          const SizedBox(height: 16),
          isLoading
              ? Container(
                  width: 40,
                  height: 32,
                  decoration: BoxDecoration(
                    color: AppColors.surfaceLight,
                    borderRadius: BorderRadius.circular(8),
                  ),
                )
              : Text(
                  value,
                  style: const TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w900,
                    color: AppColors.textPrimary,
                    letterSpacing: -1,
                  ),
                ),
        ],
      ),
    );
  }
}

class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickAction({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 20),
        decoration: BoxDecoration(
          color: color.withAlpha(15),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: color.withAlpha(40)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 26),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StudentRow extends StatelessWidget {
  final dynamic student;

  const _StudentRow({required this.student});

  Color _statusColor(String status) {
    switch (status) {
      case 'present':
      case 'checked-in':
        return AppColors.success;
      case 'absent':
        return AppColors.error;
      default:
        return AppColors.textMuted;
    }
  }

  String _statusLabel(String status) {
    switch (status) {
      case 'present':
      case 'checked-in':
        return 'PRESENT';
      case 'absent':
        return 'ABSENT';
      default:
        return 'NOT SCANNED';
    }
  }

  @override
  Widget build(BuildContext context) {
    final status = student['presenceStatus'] ?? 'not-scanned';
    final color = _statusColor(status);

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Row(
        children: [
          // Avatar
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.primary.withAlpha(30),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Center(
              child: Text(
                (student['name'] ?? 'S').substring(0, 1).toUpperCase(),
                style: const TextStyle(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w800,
                  fontSize: 18,
                ),
              ),
            ),
          ),
          const SizedBox(width: 14),
          // Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  student['name'] ?? 'Unknown',
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontWeight: FontWeight.w700,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  student['admissionNumber'] ?? student['email'] ?? '',
                  style: const TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          // Status badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: color.withAlpha(20),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              _statusLabel(status),
              style: TextStyle(
                color: color,
                fontSize: 9,
                fontWeight: FontWeight.w800,
                letterSpacing: 1,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
