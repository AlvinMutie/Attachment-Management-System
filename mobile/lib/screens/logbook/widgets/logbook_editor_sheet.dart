import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../models/logbook_model.dart';
import '../../../providers/logbook_provider.dart';

/// Bottom sheet modal for creating, editing, and resubmitting a weekly logbook
class LogbookEditorSheet extends StatefulWidget {
  final LogbookModel? logbook;
  final int defaultWeekNumber;
  final String? initialDayToFocus;

  const LogbookEditorSheet({
    super.key,
    this.logbook,
    required this.defaultWeekNumber,
    this.initialDayToFocus,
  });

  static Future<bool?> show(
    BuildContext context, {
    LogbookModel? logbook,
    required int defaultWeekNumber,
    String? initialDayToFocus,
  }) {
    return showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => LogbookEditorSheet(
        logbook: logbook,
        defaultWeekNumber: defaultWeekNumber,
        initialDayToFocus: initialDayToFocus,
      ),
    );
  }

  @override
  State<LogbookEditorSheet> createState() => _LogbookEditorSheetState();
}

class _LogbookEditorSheetState extends State<LogbookEditorSheet> {
  final _formKey = GlobalKey<FormState>();
  late int _weekNumber;
  late TextEditingController _startDateController;
  late TextEditingController _endDateController;
  late TextEditingController _summaryController;

  // Day controllers
  final Map<String, TextEditingController> _dayControllers = {};
  final Map<String, double> _dayHours = {};

  String? _validationError;
  int _activeDayIndex = 0;

  static const List<String> _days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
  ];

  static const List<String> _dayLabels = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  @override
  void initState() {
    super.initState();
    final log = widget.logbook;
    _weekNumber = log?.weekNumber ?? widget.defaultWeekNumber;

    // Calculate dates if not existing
    final now = DateTime.now();
    final monday = now.subtract(Duration(days: now.weekday - 1));
    final friday = monday.add(const Duration(days: 4));
    final defaultStart = DateFormat('yyyy-MM-dd').format(monday);
    final defaultEnd = DateFormat('yyyy-MM-dd').format(friday);

    _startDateController = TextEditingController(
      text: log?.startDate.isNotEmpty == true ? log!.startDate : defaultStart,
    );
    _endDateController = TextEditingController(
      text: log?.endDate.isNotEmpty == true ? log!.endDate : defaultEnd,
    );
    _summaryController = TextEditingController(text: log?.summary ?? '');

    for (var i = 0; i < _days.length; i++) {
      final key = _days[i];
      final entry = log?.getDailyEntry(key);
      _dayControllers[key] = TextEditingController(text: entry?.title ?? '');
      _dayHours[key] = entry?.hours ?? 8.0;
    }

    if (widget.initialDayToFocus != null) {
      final idx = _days.indexOf(widget.initialDayToFocus!.toLowerCase());
      if (idx != -1) _activeDayIndex = idx;
    }
  }

  @override
  void dispose() {
    _startDateController.dispose();
    _endDateController.dispose();
    _summaryController.dispose();
    for (final c in _dayControllers.values) {
      c.dispose();
    }
    super.dispose();
  }

  bool get _isEditingExisting =>
      widget.logbook != null &&
      widget.logbook!.id.isNotEmpty &&
      !widget.logbook!.id.startsWith('draft_');

  bool get _isRejected => widget.logbook?.isRejected == true;

  bool get _isApproved => widget.logbook?.isApproved == true;

  Future<void> _handleSubmit() async {
    if (_isApproved) {
      Navigator.of(context).pop();
      return;
    }

    final summary = _summaryController.text.trim();
    if (summary.isEmpty) {
      setState(() {
        _validationError = 'Please provide a weekly summary/reflection.';
      });
      return;
    }

    // Check that at least one daily entry has content
    var hasAnyEntry = false;
    final dailyEntriesMap = <String, dynamic>{};
    for (final day in _days) {
      final text = _dayControllers[day]?.text.trim() ?? '';
      if (text.isNotEmpty) {
        hasAnyEntry = true;
      }
      dailyEntriesMap[day] = {
        'title': text,
        'description': text,
        'hours': _dayHours[day] ?? 8.0,
      };
    }

    if (!hasAnyEntry) {
      setState(() {
        _validationError = 'Please record tasks for at least one day.';
      });
      return;
    }

    setState(() {
      _validationError = null;
    });

    final provider = context.read<LogbookProvider>();
    bool success;

    if (_isEditingExisting) {
      success = await provider.updateLogbook(
        id: widget.logbook!.id,
        summary: summary,
        dailyEntries: dailyEntriesMap,
      );
    } else {
      success = await provider.createLogbook(
        weekNumber: _weekNumber,
        startDate: _startDateController.text.trim(),
        endDate: _endDateController.text.trim(),
        summary: summary,
        dailyEntries: dailyEntriesMap,
      );
    }

    if (mounted && success) {
      Navigator.of(context).pop(true);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            _isEditingExisting
                ? 'Logbook revised and resubmitted for supervisor review!'
                : 'Week $_weekNumber logbook submitted successfully!',
          ),
          backgroundColor: AppColors.secondary,
        ),
      );
    }
  }

  void _handleSaveDraft() {
    final summary = _summaryController.text.trim();
    final dailyEntriesMap = <String, dynamic>{};
    for (final day in _days) {
      final text = _dayControllers[day]?.text.trim() ?? '';
      dailyEntriesMap[day] = {
        'title': text,
        'description': text,
        'hours': _dayHours[day] ?? 8.0,
      };
    }

    context.read<LogbookProvider>().saveLocalDraft(
          weekNumber: _weekNumber,
          startDate: _startDateController.text.trim(),
          endDate: _endDateController.text.trim(),
          summary: summary,
          dailyEntries: dailyEntriesMap,
        );

    Navigator.of(context).pop(false);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Draft saved locally.'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;
    final isSubmitting = context.watch<LogbookProvider>().isSubmitting;
    final submissionError = context.watch<LogbookProvider>().submissionError;

    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.90,
      ),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        children: [
          // Header Drag Handle
          const SizedBox(height: 8),
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: AppColors.outline.withAlpha(80),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 8),

          // Modal Title Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppDimensions.margin),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _isRejected
                            ? 'REVISION & RESUBMISSION'
                            : _isEditingExisting
                                ? 'EDIT LOGBOOK'
                                : 'NEW LOGBOOK ENTRY',
                        style: AppTypography.labelSm.copyWith(
                          color: _isRejected ? AppColors.error : AppColors.primary,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.8,
                        ),
                      ),
                      Text(
                        'Week $_weekNumber Logbook',
                        style: AppTypography.headlineSm,
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          // Scrollable Form Body
          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsets.fromLTRB(
                AppDimensions.margin,
                AppDimensions.spaceSm,
                AppDimensions.margin,
                bottomInset + AppDimensions.spaceMd,
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Supervisor feedback alert if rejected
                    if (_isRejected && widget.logbook?.hasSupervisorFeedback == true) ...[
                      Container(
                        padding: const EdgeInsets.all(AppDimensions.spaceSm),
                        decoration: BoxDecoration(
                          color: AppColors.errorContainer,
                          borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Icon(Icons.feedback_outlined,
                                    size: 16, color: AppColors.error),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    'Supervisor Revision Request',
                                    style: AppTypography.labelMd.copyWith(
                                      color: AppColors.onErrorContainer,
                                      fontWeight: FontWeight.w700,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '"${widget.logbook!.supervisorComment}"',
                              style: AppTypography.bodySm.copyWith(
                                color: AppColors.onErrorContainer,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: AppDimensions.spaceMd),
                    ],

                    // Read-only notice if approved
                    if (_isApproved) ...[
                      Container(
                        padding: const EdgeInsets.all(AppDimensions.spaceSm),
                        decoration: BoxDecoration(
                          color: AppColors.tertiaryFixed,
                          borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.verified,
                                size: 18, color: AppColors.onTertiaryFixed),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                'This logbook is finalized and approved. Modifying approved records is restricted.',
                                style: AppTypography.bodySm.copyWith(
                                  color: AppColors.onTertiaryFixed,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: AppDimensions.spaceMd),
                    ],

                    // Dates row
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: _startDateController,
                            readOnly: _isApproved,
                            decoration: InputDecoration(
                              labelText: 'Start Date (Mon)',
                              hintText: 'YYYY-MM-DD',
                              prefixIcon: const Icon(Icons.calendar_today, size: 16),
                              filled: true,
                              fillColor: AppColors.surfaceContainerLowest,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                              contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 10),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextFormField(
                            controller: _endDateController,
                            readOnly: _isApproved,
                            decoration: InputDecoration(
                              labelText: 'End Date (Fri)',
                              hintText: 'YYYY-MM-DD',
                              prefixIcon: const Icon(Icons.calendar_today, size: 16),
                              filled: true,
                              fillColor: AppColors.surfaceContainerLowest,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                              contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 10),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppDimensions.spaceMd),

                    // Weekly Summary / Reflection
                    Text(
                      'Weekly Summary & Outcomes',
                      style: AppTypography.titleMd,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Summarize core engineering tasks and key learnings gained this week.',
                      style: AppTypography.bodySm.copyWith(
                        color: AppColors.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _summaryController,
                      readOnly: _isApproved,
                      maxLines: 3,
                      decoration: InputDecoration(
                        hintText:
                            'e.g., Conducted circuit testing, calibrated multimeters, and participated in sprint review...',
                        filled: true,
                        fillColor: AppColors.surfaceContainerLowest,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                    const SizedBox(height: AppDimensions.spaceMd),

                    // Day Tabs for Daily Entries
                    Text(
                      'Daily Log Entries (Monday – Friday)',
                      style: AppTypography.titleMd,
                    ),
                    const SizedBox(height: 8),

                    // Day pills row
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: List.generate(_days.length, (i) {
                          final isSelected = i == _activeDayIndex;
                          final hasText =
                              _dayControllers[_days[i]]?.text.trim().isNotEmpty ==
                                  true;

                          return Padding(
                            padding: const EdgeInsets.only(right: 6),
                            child: ChoiceChip(
                              label: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  if (hasText) ...[
                                    const Icon(Icons.check, size: 14),
                                    const SizedBox(width: 4),
                                  ],
                                  Text(_dayLabels[i]),
                                ],
                              ),
                              selected: isSelected,
                              onSelected: (_) => setState(() => _activeDayIndex = i),
                              selectedColor: AppColors.primaryContainer,
                              labelStyle: AppTypography.labelMd.copyWith(
                                color: isSelected
                                    ? AppColors.onPrimary
                                    : AppColors.onSurfaceVariant,
                                fontWeight: isSelected
                                    ? FontWeight.w700
                                    : FontWeight.w500,
                              ),
                              backgroundColor: AppColors.surfaceContainerLow,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                          );
                        }),
                      ),
                    ),
                    const SizedBox(height: 10),

                    // Active day task editor
                    Container(
                      padding: const EdgeInsets.all(AppDimensions.spaceSm),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceContainerLowest,
                        borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
                        border: Border.all(
                          color: AppColors.outlineVariant.withAlpha(120),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  '${_dayLabels[_activeDayIndex]} Tasks',
                                  style: AppTypography.labelLg,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Row(
                                children: [
                                  const Icon(Icons.schedule,
                                      size: 14, color: AppColors.secondary),
                                  const SizedBox(width: 4),
                                  Text(
                                    '${_dayHours[_days[_activeDayIndex]]?.toStringAsFixed(1)} hrs',
                                    style: AppTypography.labelMd.copyWith(
                                      color: AppColors.secondary,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          TextFormField(
                            controller: _dayControllers[_days[_activeDayIndex]],
                            readOnly: _isApproved,
                            maxLines: 3,
                            decoration: InputDecoration(
                              hintText:
                                  'Record tasks completed and engineering skills applied on ${_dayLabels[_activeDayIndex]}...',
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                              filled: true,
                              fillColor: AppColors.surfaceContainerLow,
                            ),
                            onChanged: (_) => setState(() {}),
                          ),
                        ],
                      ),
                    ),

                    if (_validationError != null) ...[
                      const SizedBox(height: 10),
                      Text(
                        _validationError!,
                        style: AppTypography.bodySm.copyWith(
                          color: AppColors.error,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],

                    if (submissionError != null) ...[
                      const SizedBox(height: 10),
                      Text(
                        submissionError,
                        style: AppTypography.bodySm.copyWith(
                          color: AppColors.error,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],

                    const SizedBox(height: AppDimensions.spaceLg),

                    // Bottom Action Buttons
                    if (!_isApproved)
                      Row(
                        children: [
                          OutlinedButton(
                            onPressed: isSubmitting ? null : _handleSaveDraft,
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            child: const Text('Save Draft'),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: isSubmitting ? null : _handleSubmit,
                              icon: isSubmitting
                                  ? const SizedBox(
                                      width: 16,
                                      height: 16,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: Colors.white,
                                      ),
                                    )
                                  : Icon(
                                      _isRejected
                                          ? Icons.send_rounded
                                          : Icons.check_circle_outline,
                                      size: 18,
                                    ),
                              label: Text(
                                isSubmitting
                                    ? 'Submitting...'
                                    : _isRejected
                                        ? 'Resubmit for Review'
                                        : 'Submit Logbook',
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primary,
                                foregroundColor: AppColors.onPrimary,
                                padding:
                                    const EdgeInsets.symmetric(vertical: 12),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
