import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_dimensions.dart';
import '../constants/app_typography.dart';

/// Centralized Material 3 Theme definition aligned with Stitch Design System
class AppTheme {
  AppTheme._();

  static ThemeData get lightTheme {
    final colorScheme = ColorScheme(
      brightness: Brightness.light,
      primary: AppColors.primary,
      onPrimary: AppColors.onPrimary,
      primaryContainer: AppColors.primaryContainer,
      onPrimaryContainer: AppColors.onPrimaryContainer,
      secondary: AppColors.secondary,
      onSecondary: AppColors.onSecondary,
      secondaryContainer: AppColors.secondaryContainer,
      onSecondaryContainer: AppColors.onSecondaryContainer,
      tertiary: AppColors.tertiary,
      onTertiary: AppColors.onTertiary,
      tertiaryContainer: AppColors.tertiaryContainer,
      onTertiaryContainer: AppColors.onTertiaryContainer,
      error: AppColors.error,
      onError: AppColors.onError,
      errorContainer: AppColors.errorContainer,
      onErrorContainer: AppColors.onErrorContainer,
      surface: AppColors.surface,
      onSurface: AppColors.onSurface,
      surfaceContainerLowest: AppColors.surfaceContainerLowest,
      surfaceContainerLow: AppColors.surfaceContainerLow,
      surfaceContainer: AppColors.surfaceContainer,
      surfaceContainerHigh: AppColors.surfaceContainerHigh,
      surfaceContainerHighest: AppColors.surfaceContainerHighest,
      onSurfaceVariant: AppColors.onSurfaceVariant,
      outline: AppColors.outline,
      outlineVariant: AppColors.outlineVariant,
      inverseSurface: AppColors.inverseSurface,
      onInverseSurface: AppColors.inverseOnSurface,
      inversePrimary: AppColors.inversePrimary,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: AppColors.surface,
      canvasColor: AppColors.surface,
      
      // Typography
      fontFamily: 'Inter',
      textTheme: TextTheme(
        displayLarge: AppTypography.displayLg,
        headlineLarge: AppTypography.headlineLg,
        headlineMedium: AppTypography.headlineMd,
        headlineSmall: AppTypography.headlineSm,
        titleMedium: AppTypography.titleMd,
        bodyLarge: AppTypography.bodyLg,
        bodyMedium: AppTypography.bodyMd,
        bodySmall: AppTypography.bodySm,
        labelLarge: AppTypography.labelLg,
        labelMedium: AppTypography.labelMd,
        labelSmall: AppTypography.labelSm,
      ),

      // App Bar
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.onSurface,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: AppTypography.headlineSmall,
        iconTheme: const IconThemeData(color: AppColors.onSurface),
      ),

      // Input Decoration Theme
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surfaceContainerLowest,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppDimensions.gutter,
          vertical: AppDimensions.spaceSm,
        ),
        hintStyle: AppTypography.bodyMd.copyWith(
          color: AppColors.outline,
        ),
        labelStyle: AppTypography.labelMd.copyWith(
          color: AppColors.onSurfaceVariant,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
          borderSide: BorderSide(
            color: AppColors.outlineVariant.withAlpha(100),
            width: 1.0,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
          borderSide: BorderSide(
            color: AppColors.outlineVariant.withAlpha(100),
            width: 1.0,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
          borderSide: const BorderSide(
            color: AppColors.primaryContainer,
            width: 2.0,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
          borderSide: const BorderSide(
            color: AppColors.error,
            width: 1.5,
          ),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
          borderSide: const BorderSide(
            color: AppColors.error,
            width: 2.0,
          ),
        ),
      ),

      // Elevated Button Theme (Stitch Pill-shaped buttons)
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          elevation: 1,
          backgroundColor: AppColors.primaryContainer,
          foregroundColor: AppColors.onPrimary,
          disabledBackgroundColor: AppColors.primaryContainer.withAlpha(130),
          disabledForegroundColor: AppColors.onPrimary.withAlpha(180),
          minimumSize: const Size.fromHeight(AppDimensions.buttonHeight),
          shape: const StadiumBorder(),
          textStyle: AppTypography.labelLg,
          padding: const EdgeInsets.symmetric(horizontal: AppDimensions.spaceLg),
        ),
      ),

      // Text Button Theme
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primary,
          textStyle: AppTypography.labelMd.copyWith(fontWeight: FontWeight.w600),
          padding: const EdgeInsets.symmetric(horizontal: AppDimensions.spaceSm),
        ),
      ),

      // Navigation Bar Theme (Stitch Bottom Navigation Bar)
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: AppColors.surface,
        elevation: 0,
        height: AppDimensions.bottomNavHeight,
        indicatorColor: AppColors.surfaceVariant,
        iconTheme: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const IconThemeData(color: AppColors.primary, size: 24);
          }
          return const IconThemeData(color: AppColors.onSurfaceVariant, size: 24);
        }),
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return AppTypography.labelSm.copyWith(
              color: AppColors.primary,
              fontWeight: FontWeight.w600,
            );
          }
          return AppTypography.labelSm.copyWith(
            color: AppColors.onSurfaceVariant,
            fontWeight: FontWeight.w500,
          );
        }),
      ),

      // Card Theme
      cardTheme: CardThemeData(
        color: AppColors.surfaceContainerLowest,
        elevation: 1,
        shadowColor: Colors.black.withAlpha(15),
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
        ),
      ),

      // Dialog Theme
      dialogTheme: DialogThemeData(
        backgroundColor: AppColors.surfaceContainerLowest,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusXl),
        ),
        titleTextStyle: AppTypography.headlineSmall,
        contentTextStyle: AppTypography.bodyMd,
      ),

      // SnackBar Theme
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        backgroundColor: AppColors.inverseSurface,
        contentTextStyle: AppTypography.bodyMd.copyWith(color: AppColors.inverseOnSurface),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
        ),
      ),
    );
  }
}
