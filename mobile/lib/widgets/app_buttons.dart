import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_typography.dart';
import '../core/constants/app_dimensions.dart';

/// Primary pill-shaped action button matching Stitch button style
class PrimaryButton extends StatelessWidget {
  final String label;
  final IconData? trailingIcon;
  final VoidCallback? onPressed;
  final bool isLoading;
  final double? height;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final String? semanticLabel;

  const PrimaryButton({
    super.key,
    required this.label,
    this.trailingIcon,
    this.onPressed,
    this.isLoading = false,
    this.height,
    this.backgroundColor,
    this.foregroundColor,
    this.semanticLabel,
  });

  @override
  Widget build(BuildContext context) {
    final bool disabled = onPressed == null || isLoading;

    return Semantics(
      label: semanticLabel ?? label,
      button: true,
      child: SizedBox(
        height: height ?? AppDimensions.buttonHeight,
        width: double.infinity,
        child: ElevatedButton(
          onPressed: disabled ? null : onPressed,
          style: ElevatedButton.styleFrom(
            elevation: disabled ? 0 : 1,
            backgroundColor: backgroundColor ?? AppColors.primaryContainer,
            foregroundColor: foregroundColor ?? AppColors.onPrimary,
            disabledBackgroundColor:
                (backgroundColor ?? AppColors.primaryContainer).withAlpha(160),
            disabledForegroundColor:
                (foregroundColor ?? AppColors.onPrimary).withAlpha(180),
            shape: const StadiumBorder(),
            textStyle: AppTypography.labelLg,
            padding: const EdgeInsets.symmetric(
              horizontal: AppDimensions.spaceLg,
            ),
          ),
          child: isLoading
              ? const SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(
                    strokeWidth: 2.5,
                    color: AppColors.onPrimary,
                  ),
                )
              : Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(label),
                    if (trailingIcon != null) ...[
                      const SizedBox(width: 8),
                      Icon(trailingIcon, size: 20),
                    ],
                  ],
                ),
        ),
      ),
    );
  }
}

/// Outlined / secondary pill-shaped button
class SecondaryButton extends StatelessWidget {
  final String label;
  final IconData? leadingIcon;
  final IconData? trailingIcon;
  final VoidCallback? onPressed;
  final bool isLoading;
  final double? height;
  final String? semanticLabel;

  const SecondaryButton({
    super.key,
    required this.label,
    this.leadingIcon,
    this.trailingIcon,
    this.onPressed,
    this.isLoading = false,
    this.height,
    this.semanticLabel,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: semanticLabel ?? label,
      button: true,
      child: SizedBox(
        height: height ?? AppDimensions.buttonHeight,
        width: double.infinity,
        child: OutlinedButton(
          onPressed: (onPressed == null || isLoading) ? null : onPressed,
          style: OutlinedButton.styleFrom(
            backgroundColor: AppColors.surfaceContainerLowest,
            foregroundColor: AppColors.onSurface,
            side: BorderSide(
              color: AppColors.outlineVariant.withAlpha(150),
            ),
            shape: const StadiumBorder(),
            textStyle: AppTypography.labelLg,
            padding: const EdgeInsets.symmetric(horizontal: AppDimensions.spaceLg),
          ),
          child: isLoading
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: AppColors.primary,
                  ),
                )
              : Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (leadingIcon != null) ...[
                      Icon(leadingIcon, size: 20),
                      const SizedBox(width: 8),
                    ],
                    Text(label),
                    if (trailingIcon != null) ...[
                      const SizedBox(width: 8),
                      Icon(trailingIcon, size: 20),
                    ],
                  ],
                ),
        ),
      ),
    );
  }
}
