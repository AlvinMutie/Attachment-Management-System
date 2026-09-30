import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

/// Inter typography scales matching Stitch Tailwind configuration
class AppTypography {
  AppTypography._();

  static TextStyle get displayLg => GoogleFonts.inter(
        fontSize: 32,
        height: 40 / 32,
        letterSpacing: -0.02 * 32,
        fontWeight: FontWeight.w700,
        color: AppColors.onSurface,
      );

  static TextStyle get headlineLg => GoogleFonts.inter(
        fontSize: 26,
        height: 32 / 26,
        letterSpacing: -0.015 * 26,
        fontWeight: FontWeight.w600,
        color: AppColors.onSurface,
      );

  static TextStyle get headlineMd => GoogleFonts.inter(
        fontSize: 20,
        height: 26 / 20,
        letterSpacing: -0.01 * 20,
        fontWeight: FontWeight.w600,
        color: AppColors.onSurface,
      );

  static TextStyle get headlineSm => GoogleFonts.inter(
        fontSize: 18,
        height: 24 / 18,
        letterSpacing: -0.005 * 18,
        fontWeight: FontWeight.w600,
        color: AppColors.onSurface,
      );

  static TextStyle get titleMd => GoogleFonts.inter(
        fontSize: 16,
        height: 22 / 16,
        letterSpacing: 0.0,
        fontWeight: FontWeight.w600,
        color: AppColors.onSurface,
      );

  static TextStyle get bodyLg => GoogleFonts.inter(
        fontSize: 15,
        height: 22 / 15,
        letterSpacing: 0.005 * 15,
        fontWeight: FontWeight.w400,
        color: AppColors.onSurface,
      );

  static TextStyle get bodyMd => GoogleFonts.inter(
        fontSize: 14,
        height: 20 / 14,
        letterSpacing: 0.01 * 14,
        fontWeight: FontWeight.w400,
        color: AppColors.onSurface,
      );

  static TextStyle get bodySm => GoogleFonts.inter(
        fontSize: 13,
        height: 18 / 13,
        letterSpacing: 0.01 * 13,
        fontWeight: FontWeight.w400,
        color: AppColors.onSurfaceVariant,
      );

  static TextStyle get labelLg => GoogleFonts.inter(
        fontSize: 14,
        height: 20 / 14,
        letterSpacing: 0.01 * 14,
        fontWeight: FontWeight.w600,
        color: AppColors.onSurface,
      );

  static TextStyle get labelMd => GoogleFonts.inter(
        fontSize: 12,
        height: 16 / 12,
        letterSpacing: 0.02 * 12,
        fontWeight: FontWeight.w600,
        color: AppColors.onSurface,
      );

  static TextStyle get labelSm => GoogleFonts.inter(
        fontSize: 11,
        height: 14 / 11,
        letterSpacing: 0.025 * 11,
        fontWeight: FontWeight.w500,
        color: AppColors.onSurfaceVariant,
      );
}
