import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../models/user_model.dart';
import '../../../models/workspace_model.dart';

/// Modal bottom sheet helper with consistent Stitch design styling
void _showModalSheet(BuildContext context, Widget content) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (ctx) => Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(ctx).size.height * 0.88,
      ),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppDimensions.radius2xl)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag handle
          Center(
            child: Container(
              margin: const EdgeInsets.only(top: 12, bottom: 4),
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.outlineVariant,
                borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
              ),
            ),
          ),
          Flexible(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(
                AppDimensions.margin,
                AppDimensions.spaceSm,
                AppDimensions.margin,
                AppDimensions.space2xl,
              ),
              child: content,
            ),
          ),
        ],
      ),
    ),
  );
}

/// Helper for header row in modal sheets
Widget _buildSheetHeader(BuildContext context, String title, String subtitle, IconData icon) {
  return Row(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: AppColors.primaryContainer.withAlpha(25),
          borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
        ),
        child: Icon(icon, color: AppColors.primary, size: 24),
      ),
      const SizedBox(width: 14),
      Expanded(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: AppTypography.titleMd.copyWith(fontWeight: FontWeight.w700)),
            const SizedBox(height: 2),
            Text(subtitle, style: AppTypography.bodySm),
          ],
        ),
      ),
      IconButton(
        icon: const Icon(Icons.close_rounded, size: 22),
        onPressed: () => Navigator.pop(context),
      ),
    ],
  );
}

/// Reusable grouped card container
Widget _buildInfoCard({required List<Widget> children, EdgeInsetsGeometry? padding}) {
  return Container(
    width: double.infinity,
    padding: padding ?? const EdgeInsets.all(AppDimensions.spaceMd),
    decoration: BoxDecoration(
      color: AppColors.surfaceContainerLowest,
      borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
      border: Border.all(color: AppColors.outlineVariant.withAlpha(70)),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: children,
    ),
  );
}

/// Reusable key-value row
Widget _buildDetailRow(String label, String value, {IconData? icon, VoidCallback? onCopy, BuildContext? context}) {
  return Padding(
    padding: const EdgeInsets.symmetric(vertical: 6),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (icon != null) ...[
          Icon(icon, size: 16, color: AppColors.onSurfaceVariant),
          const SizedBox(width: 8),
        ],
        SizedBox(
          width: 110,
          child: Text(label, style: AppTypography.labelSm.copyWith(color: AppColors.onSurfaceVariant)),
        ),
        Expanded(
          child: Text(value, style: AppTypography.bodyMd.copyWith(fontWeight: FontWeight.w500)),
        ),
        if (onCopy != null && context != null)
          GestureDetector(
            onTap: onCopy,
            child: Padding(
              padding: const EdgeInsets.only(left: 6),
              child: Icon(Icons.copy_rounded, size: 15, color: AppColors.primary),
            ),
          ),
      ],
    ),
  );
}

// ----------------------------------------------------------------------
// 1. My Profile Sheet
// ----------------------------------------------------------------------
void showProfileSheet(BuildContext context, UserModel? user, WorkspaceModel? workspace) {
  final student = workspace?.student;
  final name = user?.name.isNotEmpty == true ? user!.name : (student?.user?.name ?? 'Student');
  final admissionNumber = user?.admissionNumber?.isNotEmpty == true
      ? user!.admissionNumber!
      : (student?.admissionNumber ?? 'CT201/0042/22');
  final email = user?.email.isNotEmpty == true ? user!.email : (student?.user?.email ?? 'student@attachpro.edu');
  final course = student?.course ?? user?.department ?? 'BSc Software Engineering';
  final institution = user?.institution ?? user?.schoolName ?? 'Technical University';
  final placementOrg = student?.organizationName ?? 'Safaricom PLC HQ';

  _showModalSheet(
    context,
    Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSheetHeader(context, 'Student Profile', 'Official academic & attachment records', Icons.account_circle_outlined),
        const SizedBox(height: 20),

        // Avatar + Name Hero
        Center(
          child: Column(
            children: [
              CircleAvatar(
                radius: 36,
                backgroundColor: AppColors.primaryContainer,
                child: Text(
                  name.isNotEmpty ? name[0].toUpperCase() : 'S',
                  style: AppTypography.displayLg.copyWith(color: AppColors.onPrimary, fontSize: 28),
                ),
              ),
              const SizedBox(height: 10),
              Text(name, style: AppTypography.headlineSm),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.successContainer.withAlpha(120),
                  borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
                ),
                child: Text(
                  'ACTIVE ATTACHMENT CANDIDATE',
                  style: AppTypography.labelSm.copyWith(
                    color: AppColors.success,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Academic Identity
        Text('ACADEMIC IDENTIFICATION', style: AppTypography.labelSm.copyWith(color: AppColors.primary, letterSpacing: 0.8)),
        const SizedBox(height: 8),
        _buildInfoCard(
          children: [
            _buildDetailRow(
              'Admission No.',
              admissionNumber,
              icon: Icons.badge_outlined,
              context: context,
              onCopy: () {
                Clipboard.setData(ClipboardData(text: admissionNumber));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Admission number copied to clipboard')),
                );
              },
            ),
            const Divider(height: 16),
            _buildDetailRow('Program', course, icon: Icons.school_outlined),
            const Divider(height: 16),
            _buildDetailRow('Institution', institution, icon: Icons.account_balance_outlined),
            const Divider(height: 16),
            _buildDetailRow('Faculty Dept.', student?.department ?? 'Computing & Informatics', icon: Icons.apartment_outlined),
          ],
        ),
        const SizedBox(height: 18),

        // Contact & SSO Credentials
        Text('CONTACT & AUTHENTICATION', style: AppTypography.labelSm.copyWith(color: AppColors.primary, letterSpacing: 0.8)),
        const SizedBox(height: 8),
        _buildInfoCard(
          children: [
            _buildDetailRow(
              'Official Email',
              email,
              icon: Icons.email_outlined,
              context: context,
              onCopy: () {
                Clipboard.setData(ClipboardData(text: email));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Email copied to clipboard')),
                );
              },
            ),
            const Divider(height: 16),
            _buildDetailRow('Placement Org', placementOrg, icon: Icons.business_outlined),
            const Divider(height: 16),
            _buildDetailRow('SSO Status', 'Verified via University Portal', icon: Icons.verified_user_outlined),
          ],
        ),
      ],
    ),
  );
}

// ----------------------------------------------------------------------
// 2. Attachment Details Sheet
// ----------------------------------------------------------------------
void showAttachmentDetailsSheet(BuildContext context, WorkspaceModel? workspace) {
  final student = workspace?.student;
  final dates = workspace?.dates;

  final orgName = student?.organizationName ?? 'Safaricom PLC HQ';
  final orgAddress = student?.organizationAddress ?? 'Waiyaki Way, Nairobi, Kenya';
  final role = student?.contactPerson ?? 'Software Engineering Intern';
  final dept = student?.department ?? 'Digital Engineering & Cloud';
  final startDate = dates?.startDate ?? '2026-05-04';
  final endDate = dates?.endDate ?? '2026-07-24';
  final totalWeeks = dates?.totalWeeks ?? 12;
  final completedDays = dates?.daysCompleted ?? 33;
  final remainingDays = dates?.daysRemaining ?? 27;

  _showModalSheet(
    context,
    Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSheetHeader(context, 'Attachment Details', 'Placement verification & contract parameters', Icons.business_center_outlined),
        const SizedBox(height: 20),

        // Host Organization Card
        Text('HOST ORGANIZATION', style: AppTypography.labelSm.copyWith(color: AppColors.primary, letterSpacing: 0.8)),
        const SizedBox(height: 8),
        _buildInfoCard(
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(orgName, style: AppTypography.titleMd.copyWith(fontWeight: FontWeight.w700)),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.successContainer.withAlpha(120),
                    borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
                  ),
                  child: Text('APPROVED', style: AppTypography.labelSm.copyWith(color: AppColors.success, fontWeight: FontWeight.w700)),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(orgAddress, style: AppTypography.bodySm),
            const Divider(height: 20),
            _buildDetailRow('Assigned Role', role, icon: Icons.work_outline),
            const Divider(height: 16),
            _buildDetailRow('Host Dept.', dept, icon: Icons.hub_outlined),
          ],
        ),
        const SizedBox(height: 18),

        // Timeline & Metrics Card
        Text('TIMELINE & DURATION', style: AppTypography.labelSm.copyWith(color: AppColors.primary, letterSpacing: 0.8)),
        const SizedBox(height: 8),
        _buildInfoCard(
          children: [
            _buildDetailRow('Start Date', startDate, icon: Icons.calendar_today_outlined),
            const Divider(height: 16),
            _buildDetailRow('End Date', endDate, icon: Icons.event_available_outlined),
            const Divider(height: 16),
            _buildDetailRow('Duration', '$totalWeeks Weeks ($completedDays / ${completedDays + remainingDays} Days Complete)', icon: Icons.timelapse_outlined),
            const Divider(height: 16),
            _buildDetailRow('Work Schedule', 'Mon - Fri • 08:00 AM - 05:00 PM', icon: Icons.schedule_outlined),
          ],
        ),
      ],
    ),
  );
}

// ----------------------------------------------------------------------
// 3. My Supervisors Sheet
// ----------------------------------------------------------------------
void showSupervisorsSheet(BuildContext context, WorkspaceModel? workspace) {
  final student = workspace?.student;
  final indSupName = student?.industrySupervisor?.name ?? 'Eng. Sarah Jenkins';
  final indSupEmail = student?.industrySupervisor?.email ?? 'sarah.j@safaricom.co.ke';
  final uniSupName = student?.universitySupervisor?.name ?? 'Dr. James Okoth';
  final uniSupEmail = student?.universitySupervisor?.email ?? 'unisup_a@ams.com';

  _showModalSheet(
    context,
    Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSheetHeader(context, 'My Supervisors', 'Assigned academic & industry mentors', Icons.people_alt_outlined),
        const SizedBox(height: 20),

        // Industry Supervisor
        Text('INDUSTRY / HOST SUPERVISOR', style: AppTypography.labelSm.copyWith(color: AppColors.primary, letterSpacing: 0.8)),
        const SizedBox(height: 8),
        _buildInfoCard(
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: AppColors.primaryFixed,
                  child: const Icon(Icons.person, color: AppColors.primary, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(indSupName, style: AppTypography.titleMd.copyWith(fontWeight: FontWeight.w700)),
                      Text('Host Industry Mentor • Daily Logs & Attendance', style: AppTypography.bodySm),
                    ],
                  ),
                ),
              ],
            ),
            const Divider(height: 20),
            _buildDetailRow(
              'Email',
              indSupEmail,
              icon: Icons.email_outlined,
              context: context,
              onCopy: () {
                Clipboard.setData(ClipboardData(text: indSupEmail));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Supervisor email copied to clipboard')),
                );
              },
            ),
            const Divider(height: 16),
            _buildDetailRow('Verification Method', 'Dynamic QR Verification & Weekly Sign-off', icon: Icons.verified_outlined),
          ],
        ),
        const SizedBox(height: 18),

        // University Supervisor
        Text('UNIVERSITY / ACADEMIC SUPERVISOR', style: AppTypography.labelSm.copyWith(color: AppColors.primary, letterSpacing: 0.8)),
        const SizedBox(height: 8),
        _buildInfoCard(
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: AppColors.secondaryFixed,
                  child: const Icon(Icons.school, color: AppColors.secondary, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(uniSupName, style: AppTypography.titleMd.copyWith(fontWeight: FontWeight.w700)),
                      Text('Faculty Supervisor • Academic Accreditation', style: AppTypography.bodySm),
                    ],
                  ),
                ),
              ],
            ),
            const Divider(height: 20),
            _buildDetailRow(
              'Email',
              uniSupEmail,
              icon: Icons.email_outlined,
              context: context,
              onCopy: () {
                Clipboard.setData(ClipboardData(text: uniSupEmail));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Academic supervisor email copied')),
                );
              },
            ),
            const Divider(height: 16),
            _buildDetailRow('Site Visits', 'Field Assessment scheduled for Week 8', icon: Icons.location_on_outlined),
          ],
        ),
      ],
    ),
  );
}

// ----------------------------------------------------------------------
// 4. Tasks & Deadlines Sheet
// ----------------------------------------------------------------------
void showTasksAndDeadlinesSheet(BuildContext context, WorkspaceModel? workspace) {
  final deadlines = workspace?.deadlines ?? [];

  _showModalSheet(
    context,
    Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSheetHeader(context, 'Tasks & Deadlines', 'Required submissions and accreditation milestones', Icons.task_alt_outlined),
        const SizedBox(height: 20),

        if (deadlines.isNotEmpty) ...[
          Text('UPCOMING ATTACHMENT MILESTONES', style: AppTypography.labelSm.copyWith(color: AppColors.primary, letterSpacing: 0.8)),
          const SizedBox(height: 8),
          ...deadlines.map((dl) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: _buildInfoCard(
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.primaryContainer.withAlpha(25),
                            borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
                          ),
                          child: const Icon(Icons.calendar_month_outlined, size: 20, color: AppColors.primary),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(dl.title, style: AppTypography.titleMd.copyWith(fontWeight: FontWeight.w600)),
                              const SizedBox(height: 2),
                              Text('Target Date: ${dl.targetDate ?? "Upcoming"}', style: AppTypography.bodySm),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: dl.isOverdue ? AppColors.errorContainer : AppColors.surfaceContainerLow,
                            borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
                          ),
                          child: Text(
                            dl.daysRemaining != null ? '${dl.daysRemaining} days left' : 'UPCOMING',
                            style: AppTypography.labelSm.copyWith(
                              color: dl.isOverdue ? AppColors.error : AppColors.primary,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              )),
          const SizedBox(height: 8),
        ],

        Text('STANDARD COMPLIANCE SCHEDULE', style: AppTypography.labelSm.copyWith(color: AppColors.primary, letterSpacing: 0.8)),
        const SizedBox(height: 8),
        _buildInfoCard(
          children: [
            _buildDetailRow('Weekly Logbook', 'Every Friday by 5:00 PM EAT', icon: Icons.edit_calendar_outlined),
            const Divider(height: 16),
            _buildDetailRow('Attendance Sync', 'Daily QR check-in with host supervisor', icon: Icons.qr_code_2_outlined),
            const Divider(height: 16),
            _buildDetailRow('Mid-Term Report', 'Week 6-7 Evaluation Rubric', icon: Icons.description_outlined),
            const Divider(height: 16),
            _buildDetailRow('Final Defense', 'Week 12 Comprehensive Oral Defense', icon: Icons.military_tech_outlined),
          ],
        ),
      ],
    ),
  );
}

// ----------------------------------------------------------------------
// 5. Announcements Sheet
// ----------------------------------------------------------------------
void showAnnouncementsSheet(BuildContext context) {
  final announcements = [
    {
      'title': 'Mid-Term Faculty Site Supervision Visits',
      'date': 'Oct 02, 2026',
      'tag': 'FACULTY NOTICE',
      'body': 'Faculty assessors will visit all host companies across weeks 7–9. Please ensure your physical logbook records match your AttachPro daily submissions.',
    },
    {
      'title': 'Weekly Logbook Review Policy Reminder',
      'date': 'Sep 28, 2026',
      'tag': 'COMPLIANCE',
      'body': 'All daily logs must be submitted before Friday 17:00. Entries with "Needs Revision" must be resubmitted within 48 hours.',
    },
    {
      'title': 'Workplace Safety & Student Insurance Cover',
      'date': 'Sep 15, 2026',
      'tag': 'SAFETY',
      'body': 'All enrolled attachment students are covered under the University Group Personal Accident & Liability Policy during official work hours.',
    },
  ];

  _showModalSheet(
    context,
    Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSheetHeader(context, 'Announcements', 'Official notices from Industrial Training Directorate', Icons.campaign_outlined),
        const SizedBox(height: 20),

        ...announcements.map((item) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: _buildInfoCard(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppColors.primaryFixed,
                          borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
                        ),
                        child: Text(
                          item['tag']!,
                          style: AppTypography.labelSm.copyWith(
                            color: AppColors.onPrimaryFixedVariant,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      Text(item['date']!, style: AppTypography.labelSm),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(item['title']!, style: AppTypography.titleMd.copyWith(fontWeight: FontWeight.w700)),
                  const SizedBox(height: 4),
                  Text(item['body']!, style: AppTypography.bodySm.copyWith(height: 1.4)),
                ],
              ),
            )),
      ],
    ),
  );
}

// ----------------------------------------------------------------------
// 6. Support & Helpdesk Sheet
// ----------------------------------------------------------------------
void showSupportSheet(BuildContext context) {
  _showModalSheet(
    context,
    Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSheetHeader(context, 'Technical Support', 'AttachPro helpdesk & system assistance', Icons.support_agent_outlined),
        const SizedBox(height: 20),

        // Helpdesk Contact
        Text('HELPDESK CHANNELS', style: AppTypography.labelSm.copyWith(color: AppColors.primary, letterSpacing: 0.8)),
        const SizedBox(height: 8),
        _buildInfoCard(
          children: [
            _buildDetailRow(
              'Support Email',
              'support@attachpro.edu',
              icon: Icons.email_outlined,
              context: context,
              onCopy: () {
                Clipboard.setData(const ClipboardData(text: 'support@attachpro.edu'));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Support email copied')),
                );
              },
            ),
            const Divider(height: 16),
            _buildDetailRow(
              'Hotline',
              '+254 700 000 000',
              icon: Icons.phone_outlined,
              context: context,
              onCopy: () {
                Clipboard.setData(const ClipboardData(text: '+254700000000'));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Hotline phone number copied')),
                );
              },
            ),
            const Divider(height: 16),
            _buildDetailRow('Support Hours', 'Monday - Friday • 08:00 AM - 06:00 PM', icon: Icons.schedule_outlined),
          ],
        ),
        const SizedBox(height: 18),

        // Quick FAQs
        Text('COMMON TOPICS', style: AppTypography.labelSm.copyWith(color: AppColors.primary, letterSpacing: 0.8)),
        const SizedBox(height: 8),
        _buildInfoCard(
          children: [
            Text('• How do I verify attendance if QR scanning fails?', style: AppTypography.labelMd),
            const SizedBox(height: 4),
            Text('Your industry supervisor can manually confirm your daily logbook entry if the camera scanner experiences connection latency.', style: AppTypography.bodySm),
            const Divider(height: 18),
            Text('• When are logbooks considered late?', style: AppTypography.labelMd),
            const SizedBox(height: 4),
            Text('Daily entries must be saved by 23:59 each working day and submitted as a weekly bundle by Friday 17:00.', style: AppTypography.bodySm),
          ],
        ),
      ],
    ),
  );
}

// ----------------------------------------------------------------------
// 7. Report Workplace or Safety Issue Sheet
// ----------------------------------------------------------------------
void showSafetyIssueSheet(BuildContext context) {
  _showModalSheet(
    context,
    _SafetyIssueForm(),
  );
}

class _SafetyIssueForm extends StatefulWidget {
  @override
  State<_SafetyIssueForm> createState() => _SafetyIssueFormState();
}

class _SafetyIssueFormState extends State<_SafetyIssueForm> {
  String _selectedCategory = 'Occupational Safety';
  final _detailsController = TextEditingController();
  bool _isSubmitted = false;

  @override
  void dispose() {
    _detailsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isSubmitted) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.successContainer,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check_circle_rounded, color: AppColors.success, size: 40),
          ),
          const SizedBox(height: 16),
          Text('Report Received Confidentially', style: AppTypography.headlineSm),
          const SizedBox(height: 8),
          Text(
            'Your concern has been forwarded directly to the Dean of Students & University Attachment Directorate. A designated student counselor or liaison officer will reach out promptly.',
            textAlign: TextAlign.center,
            style: AppTypography.bodyMd,
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => Navigator.pop(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: AppColors.onPrimary,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppDimensions.radiusFull)),
              ),
              child: const Text('Done'),
            ),
          ),
        ],
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSheetHeader(context, 'Report Workplace Issue', 'Confidential safety & student welfare channel', Icons.report_problem_outlined),
        const SizedBox(height: 16),

        // Confidentiality Notice
        Container(
          padding: const EdgeInsets.all(AppDimensions.spaceSm + 2),
          decoration: BoxDecoration(
            color: AppColors.errorContainer.withAlpha(80),
            borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
            border: Border.all(color: AppColors.error.withAlpha(90)),
          ),
          child: Row(
            children: [
              const Icon(Icons.security_rounded, color: AppColors.error, size: 22),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Your submission is 100% confidential and handled by university student welfare officers.',
                  style: AppTypography.labelSm.copyWith(color: AppColors.error, fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        Text('ISSUE CATEGORY', style: AppTypography.labelSm.copyWith(color: AppColors.primary, letterSpacing: 0.8)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            'Occupational Safety',
            'Harassment / Discrimination',
            'Unfair Work Hours',
            'Workplace Injury',
          ].map((category) {
            final isSelected = _selectedCategory == category;
            return ChoiceChip(
              label: Text(category),
              selected: isSelected,
              onSelected: (selected) {
                if (selected) setState(() => _selectedCategory = category);
              },
              selectedColor: AppColors.primaryFixed,
              labelStyle: AppTypography.labelSm.copyWith(
                color: isSelected ? AppColors.onPrimaryFixedVariant : AppColors.onSurfaceVariant,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 16),

        Text('INCIDENT DETAILS', style: AppTypography.labelSm.copyWith(color: AppColors.primary, letterSpacing: 0.8)),
        const SizedBox(height: 8),
        TextField(
          controller: _detailsController,
          maxLines: 4,
          style: AppTypography.bodyMd,
          decoration: InputDecoration(
            hintText: 'Describe the issue or safety hazard encountered...',
            hintStyle: AppTypography.bodySm,
            filled: true,
            fillColor: AppColors.surfaceContainerLowest,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
              borderSide: BorderSide(color: AppColors.outlineVariant.withAlpha(90)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
              borderSide: BorderSide(color: AppColors.outlineVariant.withAlpha(90)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
              borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
            ),
          ),
        ),
        const SizedBox(height: 20),

        SizedBox(
          width: double.infinity,
          height: AppDimensions.buttonHeight,
          child: ElevatedButton.icon(
            onPressed: () {
              if (_detailsController.text.trim().isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Please describe the incident before submitting.')),
                );
                return;
              }
              setState(() => _isSubmitted = true);
            },
            icon: const Icon(Icons.send_rounded),
            label: const Text('Submit Confidential Report'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
              foregroundColor: AppColors.onError,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppDimensions.radiusFull)),
            ),
          ),
        ),
      ],
    );
  }
}

// ----------------------------------------------------------------------
// 8. Industrial Attachment Handbook Sheet
// ----------------------------------------------------------------------
void showHandbookSheet(BuildContext context) {
  _showModalSheet(
    context,
    Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSheetHeader(context, 'Attachment Handbook', 'Edition v2026.2 • Official Student Guide', Icons.menu_book_outlined),
        const SizedBox(height: 20),

        _buildInfoCard(
          children: [
            Text('1. Objectives of Industrial Training', style: AppTypography.titleMd.copyWith(color: AppColors.primary)),
            const SizedBox(height: 4),
            Text(
              'Industrial attachment is an integral academic course component designed to bridge theoretical knowledge with professional industry practice, expose students to enterprise workflows, and build workplace soft skills.',
              style: AppTypography.bodySm.copyWith(height: 1.4),
            ),
            const Divider(height: 20),
            Text('2. Daily Logbook Standards', style: AppTypography.titleMd.copyWith(color: AppColors.primary)),
            const SizedBox(height: 4),
            Text(
              'Students must document daily technical activities detailing specific tasks performed, tools utilized, bugs resolved, and lessons learned. Weekly bundles must be approved by the assigned host supervisor.',
              style: AppTypography.bodySm.copyWith(height: 1.4),
            ),
            const Divider(height: 20),
            Text('3. 80% Minimum Attendance Rule', style: AppTypography.titleMd.copyWith(color: AppColors.primary)),
            const SizedBox(height: 4),
            Text(
              'Course accreditation requires a verified attendance rate of at least 80% over the full placement duration. Unauthorized absences will result in deferment or score deduction.',
              style: AppTypography.bodySm.copyWith(height: 1.4),
            ),
            const Divider(height: 20),
            Text('4. Grading Structure', style: AppTypography.titleMd.copyWith(color: AppColors.primary)),
            const SizedBox(height: 4),
            Text(
              '• Host Industry Assessment: 40%\n• Academic Site Supervision: 40%\n• Final Technical Attachment Report & Defense: 20%',
              style: AppTypography.bodySm.copyWith(height: 1.4),
            ),
          ],
        ),
      ],
    ),
  );
}

// ----------------------------------------------------------------------
// 9. Student Code of Industrial Conduct Sheet
// ----------------------------------------------------------------------
void showCodeOfConductSheet(BuildContext context) {
  _showModalSheet(
    context,
    Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSheetHeader(context, 'Code of Industrial Conduct', 'Ethical and professional obligations', Icons.policy_outlined),
        const SizedBox(height: 20),

        _buildInfoCard(
          children: [
            Text('Article 1 — Professional Integrity', style: AppTypography.titleMd.copyWith(color: AppColors.primary)),
            const SizedBox(height: 4),
            Text('Students must maintain punctuality, professional attire, respect towards team members, and strictly abide by host company regulations.', style: AppTypography.bodySm),
            const Divider(height: 20),
            Text('Article 2 — Non-Disclosure & Confidentiality', style: AppTypography.titleMd.copyWith(color: AppColors.primary)),
            const SizedBox(height: 4),
            Text('Proprietary code, client records, and enterprise internal databases must remain strictly confidential and never be shared externally.', style: AppTypography.bodySm),
            const Divider(height: 20),
            Text('Article 3 — Occupational Safety & Health', style: AppTypography.titleMd.copyWith(color: AppColors.primary)),
            const SizedBox(height: 4),
            Text('Adhere to safety procedures, emergency protocols, and report any hazardous conditions immediately to safety officers and university liaisons.', style: AppTypography.bodySm),
            const Divider(height: 20),
            Text('Article 4 — Academic Honesty', style: AppTypography.titleMd.copyWith(color: AppColors.primary)),
            const SizedBox(height: 4),
            Text('All logbook submissions and assessment reports must be authentic reflections of work personally performed by the student.', style: AppTypography.bodySm),
          ],
        ),
      ],
    ),
  );
}
