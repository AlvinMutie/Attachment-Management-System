/**
 * Production Environment Configuration Validator
 * Enforces fail-fast startup checks to prevent deployment with missing or insecure credentials.
 */

const validateEnv = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const errors = [];
    const warnings = [];

    // JWT Secret Validation
    if (!process.env.JWT_SECRET) {
        if (isProduction) {
            errors.push('JWT_SECRET is required in production environment.');
        } else {
            warnings.push('JWT_SECRET is not explicitly set; using default dev key.');
            process.env.JWT_SECRET = 'dev_jwt_secret_ams_2026_fallback';
        }
    } else if (isProduction && (process.env.JWT_SECRET === 'secret' || process.env.JWT_SECRET.length < 16)) {
        errors.push('JWT_SECRET must be at least 16 characters long and non-trivial in production.');
    }

    // Port Configuration
    if (!process.env.PORT) {
        warnings.push('PORT is not specified; defaulting to 5000.');
    }

    // CORS Origin Configuration in Production
    if (isProduction && !process.env.ALLOWED_ORIGINS) {
        warnings.push('ALLOWED_ORIGINS not set in production. Defaulting to strict same-origin policy.');
    }

    // Database Path
    if (!process.env.DATABASE_PATH) {
        warnings.push('DATABASE_PATH not set; defaulting to local ./database.sqlite');
    }

    if (warnings.length > 0 && process.env.NODE_ENV !== 'test') {
        console.warn('⚠️  Configuration Warnings:\n  - ' + warnings.join('\n  - '));
    }

    if (errors.length > 0) {
        console.error('❌ Fatal Configuration Errors:\n  - ' + errors.join('\n  - '));
        throw new Error('Environment configuration validation failed.');
    }

    return { isValid: true, isProduction };
};

module.exports = { validateEnv };
