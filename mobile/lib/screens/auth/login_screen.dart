import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import '../../core/constants/app_typography.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/app_text_field.dart';
import '../../widgets/app_buttons.dart';

/// AttachPro Student Login Screen matching Stitch design exactly
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _identifierController = TextEditingController();
  final _passwordController = TextEditingController();
  final _identifierFocus = FocusNode();
  final _passwordFocus = FocusNode();

  bool _obscurePassword = true;
  bool _rememberDevice = true;
  String? _identifierError;
  String? _passwordError;

  @override
  void dispose() {
    _identifierController.dispose();
    _passwordController.dispose();
    _identifierFocus.dispose();
    _passwordFocus.dispose();
    super.dispose();
  }

  void _clearFieldErrors() {
    if (_identifierError != null || _passwordError != null) {
      setState(() {
        _identifierError = null;
        _passwordError = null;
      });
    }
  }

  Future<void> _handleLogin() async {
    // Clear prior field errors
    setState(() {
      _identifierError = null;
      _passwordError = null;
    });

    final identifier = _identifierController.text.trim();
    final password = _passwordController.text;

    // Client-side validation
    bool hasError = false;
    if (identifier.isEmpty) {
      setState(() => _identifierError = 'Please enter your email or registration number.');
      hasError = true;
    }
    if (password.isEmpty) {
      setState(() => _passwordError = 'Please enter your password.');
      hasError = true;
    } else if (password.length < 6) {
      setState(() => _passwordError = 'Password must be at least 6 characters.');
      hasError = true;
    }
    if (hasError) return;

    final auth = context.read<AuthProvider>();
    auth.clearError();

    final success = await auth.login(
      identifier: identifier,
      password: password,
    );

    if (!mounted) return;

    if (!success) {
      final errorMsg = auth.errorMessage ?? 'Sign-in failed. Please try again.';
      // Show API error in snackbar
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(errorMsg),
          behavior: SnackBarBehavior.floating,
          backgroundColor: AppColors.error,
          margin: const EdgeInsets.all(AppDimensions.spaceMd),
        ),
      );
    }
    // If success, AuthGate rebuilds automatically via ChangeNotifier
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final isLoading = auth.status == AuthStatus.authenticating;

    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(
            horizontal: AppDimensions.margin,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 32),

              // ── Brand & Identity ────────────────────────────────────
              _BrandSection()
                  .animate()
                  .fadeIn(duration: 500.ms)
                  .slideY(begin: -0.12, duration: 500.ms, curve: Curves.easeOut),

              const SizedBox(height: 32),

              // ── Login Form ──────────────────────────────────────────
              Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Identifier field
                    AppTextField(
                      controller: _identifierController,
                      label: 'Student Email / Reg No',
                      placeholder: 'e.g. SC211/0458/2022 or you@uni.ac.ke',
                      prefixIcon: Icons.badge_outlined,
                      errorText: _identifierError,
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      focusNode: _identifierFocus,
                      enabled: !isLoading,
                      semanticLabel: 'Student email or registration number input',
                      onChanged: (_) => _clearFieldErrors(),
                      onSubmitted: (_) =>
                          FocusScope.of(context).requestFocus(_passwordFocus),
                    ),

                    const SizedBox(height: 16),

                    // Password field
                    AppTextField(
                      controller: _passwordController,
                      label: 'Password',
                      placeholder: 'Enter your password',
                      prefixIcon: Icons.lock_outline,
                      obscureText: _obscurePassword,
                      errorText: _passwordError,
                      keyboardType: TextInputType.visiblePassword,
                      textInputAction: TextInputAction.done,
                      focusNode: _passwordFocus,
                      enabled: !isLoading,
                      semanticLabel: 'Password input',
                      onChanged: (_) => _clearFieldErrors(),
                      onSubmitted: (_) => _handleLogin(),
                      suffixWidget: IconButton(
                        icon: Icon(
                          _obscurePassword
                              ? Icons.visibility_off_outlined
                              : Icons.visibility_outlined,
                          size: 20,
                          color: AppColors.onSurfaceVariant,
                        ),
                        onPressed: isLoading
                            ? null
                            : () => setState(
                                  () => _obscurePassword = !_obscurePassword,
                                ),
                        tooltip: _obscurePassword ? 'Show password' : 'Hide password',
                      ),
                    ),

                    const SizedBox(height: 12),

                    // Options row: remember device + forgot password
                    _OptionsRow(
                      rememberDevice: _rememberDevice,
                      enabled: !isLoading,
                      onRememberChanged: (v) =>
                          setState(() => _rememberDevice = v ?? true),
                    ),

                    const SizedBox(height: 20),

                    // Primary sign-in button
                    PrimaryButton(
                      label: isLoading ? 'Signing In...' : 'Sign In',
                      trailingIcon: isLoading ? null : Icons.arrow_forward,
                      isLoading: isLoading,
                      onPressed: isLoading ? null : _handleLogin,
                      semanticLabel: 'Sign in button',
                    ),
                  ],
                ),
              )
                  .animate()
                  .fadeIn(delay: 200.ms, duration: 500.ms)
                  .slideY(begin: 0.08, delay: 200.ms, duration: 500.ms, curve: Curves.easeOut),

              const SizedBox(height: 28),

              // ── Divider ─────────────────────────────────────────────
              _OrDivider(),

              const SizedBox(height: 20),

              // ── University Portal SSO (display only, no backend) ────
              SecondaryButton(
                label: 'University Portal Single Sign-On (SSO)',
                leadingIcon: Icons.school_outlined,
                onPressed: isLoading
                    ? null
                    : () => ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('SSO is not yet configured for your institution.'),
                            behavior: SnackBarBehavior.floating,
                          ),
                        ),
                semanticLabel: 'University SSO login button',
              ),

              const SizedBox(height: 24),

              // ── Help callout ─────────────────────────────────────────
              _HelpCallout()
                  .animate()
                  .fadeIn(delay: 400.ms, duration: 500.ms),

              const SizedBox(height: 32),

              // ── Micro footer ─────────────────────────────────────────
              _MicroFooter(),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Sub-Widgets ────────────────────────────────────────────────────────────

class _BrandSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Logo container with online indicator dot
        Stack(
          clipBehavior: Clip.none,
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: AppColors.surfaceContainer,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withAlpha(15),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: const Icon(
                Icons.work_outline_rounded,
                size: 36,
                color: AppColors.primary,
              ),
            ),
            // Pulsing online indicator
            Positioned(
              right: -4,
              bottom: -4,
              child: _PulsingDot(),
            ),
          ],
        ),
        const SizedBox(height: 12),

        // AttachPro + Student Portal badge row
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'AttachPro',
              style: AppTypography.headlineLg.copyWith(
                color: AppColors.primary,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(width: 8),
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
              decoration: BoxDecoration(
                color: AppColors.secondaryFixed,
                borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
              ),
              child: Text(
                'STUDENT PORTAL',
                style: AppTypography.labelSm.copyWith(
                  color: AppColors.onSecondaryFixed,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.8,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),

        Text(
          'Welcome back',
          style: AppTypography.headlineMd,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 6),
        Text(
          'Sign in to manage your industrial attachment\nand logbook submissions.',
          style: AppTypography.bodyMd.copyWith(
            color: AppColors.onSurfaceVariant,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}

class _PulsingDot extends StatefulWidget {
  @override
  State<_PulsingDot> createState() => _PulsingDotState();
}

class _PulsingDotState extends State<_PulsingDot> // ignore: unnecessary_underscores
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnim;
  late Animation<double> _opacityAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();
    _scaleAnim = Tween<double>(begin: 1, end: 2.2).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    _opacityAnim = Tween<double>(begin: 0.75, end: 0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 14,
      height: 14,
      child: Stack(
        alignment: Alignment.center,
        children: [
          AnimatedBuilder(
            animation: _controller,
            builder: (_, __) => Transform.scale(
              scale: _scaleAnim.value,
              child: Opacity(
                opacity: _opacityAnim.value,
                child: Container(
                  width: 14,
                  height: 14,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColors.secondary,
                  ),
                ),
              ),
            ),
          ),
          Container(
            width: 10,
            height: 10,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.secondary,
            ),
          ),
        ],
      ),
    );
  }
}

class _OptionsRow extends StatelessWidget {
  final bool rememberDevice;
  final bool enabled;
  final ValueChanged<bool?> onRememberChanged;

  const _OptionsRow({
    required this.rememberDevice,
    required this.enabled,
    required this.onRememberChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Remember device checkbox
        GestureDetector(
          onTap: enabled ? () => onRememberChanged(!rememberDevice) : null,
          child: Row(
            children: [
              SizedBox(
                width: 20,
                height: 20,
                child: Checkbox(
                  value: rememberDevice,
                  onChanged: enabled ? onRememberChanged : null,
                  activeColor: AppColors.primaryContainer,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(4),
                  ),
                  side: BorderSide(
                    color: AppColors.outlineVariant.withAlpha(180),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                'Remember this device',
                style: AppTypography.labelMd.copyWith(
                  fontWeight: FontWeight.w400,
                  color: enabled
                      ? AppColors.onSurface
                      : AppColors.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),

        // Forgot password link
        TextButton(
          onPressed: enabled
              ? () => ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Please contact your institution administrator to reset your password.'),
                      behavior: SnackBarBehavior.floating,
                    ),
                  )
              : null,
          style: TextButton.styleFrom(
            padding: EdgeInsets.zero,
            minimumSize: Size.zero,
            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
          ),
          child: Text(
            'Forgot password?',
            style: AppTypography.labelMd.copyWith(
              color: AppColors.primary,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }
}

class _OrDivider extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Divider(
            color: AppColors.outlineVariant.withAlpha(150),
            thickness: 1,
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Text(
            'OR SIGN IN WITH',
            style: AppTypography.labelSm.copyWith(
              color: AppColors.onSurfaceVariant,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.8,
            ),
          ),
        ),
        Expanded(
          child: Divider(
            color: AppColors.outlineVariant.withAlpha(150),
            thickness: 1,
          ),
        ),
      ],
    );
  }
}

class _HelpCallout extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppDimensions.spaceMd),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(8),
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(
            Icons.info_rounded,
            color: AppColors.secondary,
            size: 22,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'First time accessing attachment?',
                  style: AppTypography.labelMd.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Use your accredited university admission credentials or activate your student logbook account through your department administrator.',
                  style: AppTypography.bodySm,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _MicroFooter extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _FooterLink(label: 'Help Desk'),
            _dot(),
            _FooterLink(label: 'Security Protocol'),
            _dot(),
            _FooterLink(label: 'Privacy'),
          ],
        ),
        const SizedBox(height: 4),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.lock_clock_outlined, size: 14, color: AppColors.onSurfaceVariant),
            const SizedBox(width: 4),
            Text(
              'Encrypted Industrial Attachment Tracking System',
              style: AppTypography.labelSm.copyWith(
                color: AppColors.onSurfaceVariant.withAlpha(160),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _dot() => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 6),
        child: Text('•', style: AppTypography.labelSm.copyWith(color: AppColors.onSurfaceVariant)),
      );
}

class _FooterLink extends StatelessWidget {
  final String label;
  const _FooterLink({required this.label});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {},
      child: Text(
        label,
        style: AppTypography.labelSm.copyWith(
          color: AppColors.onSurfaceVariant,
        ),
      ),
    );
  }
}
