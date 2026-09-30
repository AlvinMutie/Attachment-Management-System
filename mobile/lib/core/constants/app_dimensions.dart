import 'package:flutter/material.dart';

/// Spacing, radius, and layout dimension tokens matching Stitch designs
class AppDimensions {
  AppDimensions._();

  // Spacing Tokens (from Stitch Tailwind spacing)
  static const double space2xs = 4.0;
  static const double spaceXs = 8.0;
  static const double spaceSm = 12.0;
  static const double spaceMd = 16.0;
  static const double spaceLg = 20.0;
  static const double spaceXl = 24.0;
  static const double space2xl = 32.0;
  static const double space3xl = 40.0;

  static const double margin = 20.0;
  static const double gutter = 16.0;

  // Border Radius Tokens
  static const double radiusXs = 4.0;
  static const double radiusSm = 6.0;
  static const double radiusMd = 8.0;
  static const double radiusLg = 12.0;
  static const double radiusXl = 16.0;
  static const double radius2xl = 24.0;
  static const double radiusFull = 9999.0;

  static const BorderRadius roundedDefault = BorderRadius.all(Radius.circular(radiusXs));
  static const BorderRadius roundedSm = BorderRadius.all(Radius.circular(radiusSm));
  static const BorderRadius roundedMd = BorderRadius.all(Radius.circular(radiusMd));
  static const BorderRadius roundedLg = BorderRadius.all(Radius.circular(radiusLg));
  static const BorderRadius roundedXl = BorderRadius.all(Radius.circular(radiusXl));
  static const BorderRadius rounded2xl = BorderRadius.all(Radius.circular(radius2xl));
  static const BorderRadius roundedFull = BorderRadius.all(Radius.circular(radiusFull));

  // Component Heights
  static const double buttonHeight = 48.0;
  static const double inputHeight = 48.0;
  static const double bottomNavHeight = 72.0;
  static const double headerHeight = 56.0;

  // Reference Target Frame
  static const double referenceWidth = 412.0;
  static const double referenceHeight = 917.0;
}
