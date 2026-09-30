import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_dimensions.dart';
import '../core/constants/app_typography.dart';

/// Reusable styled input field matching Stitch design with icon prefix, error, and suffix slot
class AppTextField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final String placeholder;
  final IconData prefixIcon;
  final Widget? suffixWidget;
  final bool obscureText;
  final String? errorText;
  final String? Function(String?)? validator;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final FocusNode? focusNode;
  final void Function(String)? onChanged;
  final void Function(String)? onSubmitted;
  final bool enabled;
  final String? semanticLabel;
  final String? autocompleteHint;

  const AppTextField({
    super.key,
    required this.controller,
    required this.label,
    required this.placeholder,
    required this.prefixIcon,
    this.suffixWidget,
    this.obscureText = false,
    this.errorText,
    this.validator,
    this.keyboardType,
    this.textInputAction,
    this.focusNode,
    this.onChanged,
    this.onSubmitted,
    this.enabled = true,
    this.semanticLabel,
    this.autocompleteHint,
  });

  @override
  Widget build(BuildContext context) {
    final bool hasError = errorText != null && errorText!.isNotEmpty;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 6),
          child: Text(
            label,
            style: AppTypography.labelMd.copyWith(
              color: hasError ? AppColors.error : AppColors.onSurface,
            ),
          ),
        ),
        Semantics(
          label: semanticLabel ?? label,
          textField: true,
          child: TextFormField(
            controller: controller,
            obscureText: obscureText,
            keyboardType: keyboardType,
            textInputAction: textInputAction,
            focusNode: focusNode,
            enabled: enabled,
            onChanged: onChanged,
            onFieldSubmitted: onSubmitted,
            validator: validator,
            autocorrect: false,
            style: AppTypography.bodyMd.copyWith(
              color: AppColors.onSurface,
            ),
            decoration: InputDecoration(
              hintText: placeholder,
              hintStyle: AppTypography.bodyMd.copyWith(
                color: AppColors.outline,
              ),
              prefixIcon: Padding(
                padding: const EdgeInsets.only(left: 14, right: 8),
                child: Icon(
                  prefixIcon,
                  size: 22,
                  color: hasError ? AppColors.error : AppColors.onSurfaceVariant,
                ),
              ),
              prefixIconConstraints: const BoxConstraints(minWidth: 52),
              suffixIcon: suffixWidget,
              errorText: errorText,
              errorStyle: AppTypography.labelSm.copyWith(color: AppColors.error),
              filled: true,
              fillColor: enabled
                  ? AppColors.surfaceContainerLowest
                  : AppColors.surfaceContainerLow,
              contentPadding: const EdgeInsets.symmetric(
                horizontal: AppDimensions.gutter,
                vertical: AppDimensions.spaceMd,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                borderSide: BorderSide(
                  color: AppColors.outlineVariant.withAlpha(100),
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                borderSide: BorderSide(
                  color: hasError
                      ? AppColors.error
                      : AppColors.outlineVariant.withAlpha(100),
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                borderSide: BorderSide(
                  color: hasError ? AppColors.error : AppColors.primaryContainer,
                  width: 2,
                ),
              ),
              errorBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                borderSide: const BorderSide(color: AppColors.error, width: 1.5),
              ),
              focusedErrorBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                borderSide: const BorderSide(color: AppColors.error, width: 2),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
