import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';

/// Institutional regulatory documents section matching Stitch design
class InstitutionalDocumentsSection extends StatelessWidget {
  const InstitutionalDocumentsSection({super.key});

  static final List<_DocumentItem> _documents = [
    _DocumentItem(
      title: 'Industrial Attachment Policy & Regulatory Guidelines',
      category: 'Institutional Governance',
      issuedBy: 'Directorate of Industrial Linkages',
      edition: 'Academic Year 2026',
      format: 'PDF',
      fileSize: '2.4 MB',
      icon: Icons.policy_outlined,
      description:
          'Official guidelines covering student rights, workplace health & safety, supervisor allocation, attendance thresholds, and formal evaluation criteria.',
    ),
    _DocumentItem(
      title: 'Weekly Logbook Submission & Assessment Rubric',
      category: 'Academic Assessment',
      issuedBy: 'Faculty Board of Examiners',
      edition: 'Version 3.2',
      format: 'PDF',
      fileSize: '1.1 MB',
      icon: Icons.menu_book_outlined,
      description:
          'Detailed grading criteria for daily entries, technical skills documentation, supervisor reviews, and weekly hours targets.',
    ),
    _DocumentItem(
      title: 'Student Code of Conduct & Workplace Ethics Charter',
      category: 'Professional Standards',
      issuedBy: 'Dean of Students Office',
      edition: 'Statutory Code',
      format: 'PDF',
      fileSize: '850 KB',
      icon: Icons.gavel_outlined,
      description:
          'Mandatory professional ethics, confidentiality of host firm data, workplace non-disclosure agreements, and disciplinary regulations.',
    ),
    _DocumentItem(
      title: 'Group Personal Accident & Workplace Indemnity Notice',
      category: 'Insurance & Safety',
      issuedBy: 'University Legal Directorate',
      edition: 'Policy Insured 2026',
      format: 'PDF',
      fileSize: '620 KB',
      icon: Icons.health_and_safety_outlined,
      description:
          'Verification of active institutional insurance coverage for industrial trainees throughout the attachment duration.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Header
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(AppDimensions.spaceMd),
          decoration: BoxDecoration(
            color: AppColors.surfaceContainerLowest,
            borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
            boxShadow: const [
              BoxShadow(
                color: Color.fromRGBO(0, 0, 0, 0.03),
                blurRadius: 6,
                offset: Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(
                              Icons.folder_shared_outlined,
                              size: 16,
                              color: AppColors.primary,
                            ),
                            const SizedBox(width: 6),
                            Expanded(
                              child: Text(
                                'Institutional Documents',
                                style: AppTypography.titleMd.copyWith(
                                  color: AppColors.onSurface,
                                  fontWeight: FontWeight.w700,
                                  fontSize: 14,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Official academic guidelines & attachment policy resources',
                          style: AppTypography.bodySm.copyWith(
                            color: AppColors.onSurfaceVariant,
                            fontSize: 11,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceContainer,
                      borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
                    ),
                    child: Text(
                      '${_documents.length} Resources',
                      style: AppTypography.labelSm.copyWith(
                        color: AppColors.onSurfaceVariant,
                        fontWeight: FontWeight.w700,
                        fontSize: 10.5,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Divider(height: 1, thickness: 0.5),
              const SizedBox(height: 10),

              // Document Cards
              ..._documents.map((doc) => _buildDocTile(context, doc)),
            ],
          ),
        ),

        const SizedBox(height: 12),

        // Compliance notice footer card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(AppDimensions.spaceSm + 4),
          decoration: BoxDecoration(
            color: AppColors.surfaceContainerLow,
            borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(
                Icons.info_outline_rounded,
                size: 16,
                color: AppColors.secondary,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Physical signed copies of clearance certificates are issued directly by the University Coordinator upon final grading completion.',
                  style: AppTypography.bodySm.copyWith(
                    color: AppColors.onSurfaceVariant,
                    fontSize: 11,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDocTile(BuildContext context, _DocumentItem doc) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: InkWell(
        onTap: () => _showDocDetails(context, doc),
        borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
        child: Container(
          padding: const EdgeInsets.all(AppDimensions.spaceSm + 3),
          decoration: BoxDecoration(
            color: AppColors.surfaceContainerLow,
            borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
            border: Border.all(
              color: AppColors.surfaceContainerHigh,
              width: 0.6,
            ),
          ),
          child: Row(
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: AppColors.primaryContainer.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  doc.icon,
                  size: 20,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      doc.title,
                      style: AppTypography.labelLg.copyWith(
                        color: AppColors.onSurface,
                        fontWeight: FontWeight.w700,
                        fontSize: 12.5,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            doc.issuedBy,
                            style: AppTypography.bodySm.copyWith(
                              color: AppColors.onSurfaceVariant,
                              fontSize: 10.5,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 4),
                        const Text('•', style: TextStyle(color: AppColors.outline, fontSize: 10)),
                        const SizedBox(width: 4),
                        Text(
                          '${doc.format} (${doc.fileSize})',
                          style: AppTypography.bodySm.copyWith(
                            color: AppColors.onSurfaceVariant,
                            fontSize: 10,
                            fontFamily: 'monospace',
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 6),
              const Icon(
                Icons.chevron_right_rounded,
                size: 18,
                color: AppColors.outline,
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showDocDetails(BuildContext context, _DocumentItem doc) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surfaceContainerLowest,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(AppDimensions.margin),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 36,
                    height: 4,
                    decoration: BoxDecoration(
                      color: AppColors.outlineVariant,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppColors.primaryContainer.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(doc.icon, color: AppColors.primary, size: 24),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            doc.category,
                            style: AppTypography.labelSm.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w700,
                              fontSize: 10.5,
                            ),
                          ),
                          Text(
                            doc.title,
                            style: AppTypography.titleMd.copyWith(
                              fontWeight: FontWeight.w700,
                              fontSize: 14,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  'Institutional Overview',
                  style: AppTypography.labelMd.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppColors.onSurface,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  doc.description,
                  style: AppTypography.bodySm.copyWith(
                    color: AppColors.onSurfaceVariant,
                    fontSize: 12,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 14),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceContainerLow,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    children: [
                      _metaRow('Issuing Authority', doc.issuedBy),
                      const SizedBox(height: 4),
                      _metaRow('Official Edition', doc.edition),
                      const SizedBox(height: 4),
                      _metaRow('File Specifications', '${doc.format} • ${doc.fileSize}'),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: () => Navigator.pop(ctx),
                    style: FilledButton.styleFrom(
                      backgroundColor: AppColors.primaryContainer,
                      foregroundColor: AppColors.onPrimary,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
                      ),
                    ),
                    child: const Text('Close Overview'),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  static Widget _metaRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: AppTypography.bodySm.copyWith(
            color: AppColors.onSurfaceVariant,
            fontSize: 11,
          ),
        ),
        const SizedBox(width: 8),
        Flexible(
          child: Text(
            value,
            style: AppTypography.labelSm.copyWith(
              color: AppColors.onSurface,
              fontWeight: FontWeight.w700,
              fontSize: 11,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.end,
          ),
        ),
      ],
    );
  }
}

class _DocumentItem {
  final String title;
  final String category;
  final String issuedBy;
  final String edition;
  final String format;
  final String fileSize;
  final IconData icon;
  final String description;

  _DocumentItem({
    required this.title,
    required this.category,
    required this.issuedBy,
    required this.edition,
    required this.format,
    required this.fileSize,
    required this.icon,
    required this.description,
  });
}
