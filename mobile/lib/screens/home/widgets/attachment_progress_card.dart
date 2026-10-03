import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../models/workspace_model.dart';

/// Attachment Progress Hero Card: progress bar, percentage, mini stats
class AttachmentProgressCard extends StatefulWidget {
  final DateMetrics dates;
  final LogbooksSummary logbooks;
  final AssessmentsSummary assessments;
  final AttendanceStats attendance;
  final String? placementStatus;

  const AttachmentProgressCard({
    super.key,
    required this.dates,
    required this.logbooks,
    required this.assessments,
    required this.attendance,
    this.placementStatus,
  });

  @override
  State<AttachmentProgressCard> createState() => _AttachmentProgressCardState();
}

class _AttachmentProgressCardState extends State<AttachmentProgressCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _progressController;
  late Animation<double> _progressAnim;

  @override
  void initState() {
    super.initState();
    _progressController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _progressAnim = Tween<double>(
      begin: 0,
      end: (widget.dates.percentElapsed / 100).clamp(0.0, 1.0),
    ).animate(CurvedAnimation(
      parent: _progressController,
      curve: Curves.easeOut,
    ));
    _progressController.forward();
  }

  @override
  void dispose() {
    _progressController.dispose();
    super.dispose();
  }

  String _statusLabel() {
    final status = widget.placementStatus ?? '';
    switch (status) {
      case 'ACTIVE':
        return 'In Progress';
      case 'APPROVED':
        return 'Approved';
      case 'COMPLETED':
        return 'Completed';
      case 'PENDING_APPROVAL':
        return 'Pending Approval';
      case 'REJECTED':
        return 'Rejected';
      case 'DRAFT':
        return 'Draft';
      default:
        return 'Not Started';
    }
  }

  Color _statusBgColor() {
    final status = widget.placementStatus ?? '';
    switch (status) {
      case 'ACTIVE':
      case 'APPROVED':
        return AppColors.tertiaryFixed;
      case 'COMPLETED':
        return AppColors.secondaryFixed;
      case 'REJECTED':
        return AppColors.errorContainer;
      default:
        return AppColors.surfaceContainerHigh;
    }
  }

  Color _statusTextColor() {
    final status = widget.placementStatus ?? '';
    switch (status) {
      case 'ACTIVE':
      case 'APPROVED':
        return AppColors.onTertiaryFixed;
      case 'COMPLETED':
        return AppColors.onSecondaryFixed;
      case 'REJECTED':
        return AppColors.onErrorContainer;
      default:
        return AppColors.onSurfaceVariant;
    }
  }

  Color _statusDotColor() {
    final status = widget.placementStatus ?? '';
    switch (status) {
      case 'ACTIVE':
      case 'APPROVED':
        return AppColors.tertiary;
      case 'REJECTED':
        return AppColors.error;
      default:
        return AppColors.outline;
    }
  }

  String _attendanceLabel(AttendanceStats a) {
    if (a.hasNoRecords) return 'No records';
    if (a.isCritical) return 'Critical';
    if (a.isAtRisk) return 'At Risk';
    return 'Compliant';
  }

  Color _attendanceColor(AttendanceStats a) {
    if (a.hasNoRecords) return AppColors.outline;
    if (a.isCritical || a.isAtRisk) return AppColors.error;
    return AppColors.secondary;
  }

  @override
  Widget build(BuildContext context) {
    final pct = widget.dates.percentElapsed;
    final completed = widget.dates.daysCompleted;
    final total = widget.dates.totalDays;
    final remaining = widget.dates.daysRemaining;
    final hasData = total > 0;

    return Container(
      padding: const EdgeInsets.all(AppDimensions.spaceLg),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(10),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Card Header row
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: AppColors.primaryFixed,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.trending_up_rounded,
                    size: 18, color: AppColors.primary),
              ),
              const SizedBox(width: AppDimensions.spaceXs),
              Expanded(
                child: Text(
                  'Attachment Progress',
                  style: AppTypography.titleMd,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 4),
              // Status badge
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: _statusBgColor(),
                  borderRadius:
                      BorderRadius.circular(AppDimensions.radiusFull),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(
                        color: _statusDotColor(),
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      _statusLabel(),
                      maxLines: 1,
                      style: AppTypography.labelSm.copyWith(
                        color: _statusTextColor(),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: AppDimensions.spaceMd),

          // Big percentage + days remaining
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                hasData ? '$pct%' : '--',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 32,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                  letterSpacing: -0.5,
                  height: 1.2,
                ),
              ),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  'Overall Completion',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTypography.labelMd.copyWith(
                    color: AppColors.onSurfaceVariant,
                  ),
                ),
              ),
              if (hasData)
                Text(
                  '$remaining days left',
                  style: AppTypography.labelSm.copyWith(
                    color: AppColors.secondary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
            ],
          ),

          const SizedBox(height: 8),

          // Animated progress bar
          hasData
              ? AnimatedBuilder(
                  animation: _progressAnim,
                  builder: (_, _) => _ProgressTrack(
                    fraction: _progressAnim.value,
                  ),
                )
              : _EmptyProgressTrack(),

          const SizedBox(height: 6),

          // Caption
          Text(
            hasData
                ? '$completed of $total days elapsed in your attachment period'
                : 'Placement dates not yet configured.',
            style: AppTypography.bodySm,
          ),

          const SizedBox(height: AppDimensions.spaceXs),

          // Mini stats 3-column
          Row(
            children: [
              Expanded(
                child: _MiniStat(
                  icon: Icons.edit_note_rounded,
                  label: 'Logbook',
                  value:
                      '${widget.logbooks.approved}/${widget.logbooks.total}',
                  sub: '${widget.logbooks.total > 0 ? ((widget.logbooks.approved / widget.logbooks.total) * 100).round() : 0}% Done',
                  subColor: AppColors.secondary,
                ),
              ),
              const SizedBox(width: AppDimensions.spaceXs),
              Expanded(
                child: _MiniStat(
                  icon: Icons.how_to_reg_outlined,
                  label: 'Attendance',
                  value: widget.attendance.hasNoRecords
                      ? '--'
                      : '${widget.attendance.rate}%',
                  sub: _attendanceLabel(widget.attendance),
                  subColor: _attendanceColor(widget.attendance),
                ),
              ),
              const SizedBox(width: AppDimensions.spaceXs),
              Expanded(
                child: _MiniStat(
                  icon: Icons.verified_user_outlined,
                  label: 'Assessments',
                  value:
                      '${widget.assessments.total > 0 ? (widget.assessments.industrySubmitted ? 1 : 0) + (widget.assessments.universitySubmitted ? 1 : 0) : 0}/2',
                  sub: widget.assessments.total == 0
                      ? 'Pending'
                      : 'Submitted',
                  subColor: widget.assessments.total == 0
                      ? AppColors.outline
                      : AppColors.secondary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ProgressTrack extends StatelessWidget {
  final double fraction;
  const _ProgressTrack({required this.fraction});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (_, constraints) {
        final trackWidth = constraints.maxWidth;
        final filledWidth = (trackWidth * fraction).clamp(0.0, trackWidth);
        return Container(
          width: trackWidth,
          height: 12,
          decoration: BoxDecoration(
            color: AppColors.surfaceContainerHigh,
            borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
          ),
          child: Stack(
            children: [
              Container(
                width: filledWidth,
                decoration: BoxDecoration(
                  color: AppColors.primaryContainer,
                  borderRadius:
                      BorderRadius.circular(AppDimensions.radiusFull),
                ),
                child: Align(
                  alignment: Alignment.centerRight,
                  child: Container(
                    width: 10,
                    decoration: BoxDecoration(
                      color: AppColors.secondaryContainer,
                      borderRadius:
                          BorderRadius.circular(AppDimensions.radiusFull),
                      boxShadow: [
                        BoxShadow(
                          color:
                              AppColors.secondaryContainer.withAlpha(200),
                          blurRadius: 6,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _EmptyProgressTrack extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 12,
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerHigh,
        borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
      ),
    );
  }
}

class _MiniStat extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final String sub;
  final Color subColor;

  const _MiniStat({
    required this.icon,
    required this.label,
    required this.value,
    required this.sub,
    required this.subColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppDimensions.spaceXs),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 14, color: AppColors.primary),
              const SizedBox(width: 2),
              Flexible(
                child: Text(
                  label,
                  style: AppTypography.labelSm,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 2),
          RichText(
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            text: TextSpan(
              children: [
                TextSpan(
                  text: value.split('/').first,
                  style: AppTypography.titleMd.copyWith(height: 1.2),
                ),
                if (value.contains('/'))
                  TextSpan(
                    text: '/${value.split('/').last}',
                    style: AppTypography.bodySm,
                  ),
              ],
            ),
          ),
          Text(
            sub,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: AppTypography.labelSm.copyWith(
              color: subColor,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
