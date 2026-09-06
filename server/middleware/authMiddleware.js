const jwt = require('jsonwebtoken');
const { User, School } = require('../models');
const { logAudit } = require('../utils/auditLogger');

/**
 * Protect routes: Authenticate JWT Bearer token and attach active user
 */
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            if (!token || token === 'undefined' || token === 'null') {
                return res.status(401).json({ success: false, message: 'Not authorized, invalid token format' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpiry'] },
                include: [{ model: School, as: 'school', attributes: ['id', 'name', 'status'] }]
            });

            if (!user) {
                return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists' });
            }

            // Check if account is locked or deactivated
            if (user.status === 'locked') {
                return res.status(403).json({ success: false, message: 'Account is locked. Contact administrator.' });
            }

            // Bind authoritative database context
            req.user = user;
            req.schoolId = user.schoolId;

            return next();
        } catch (error) {
            console.error('Auth verification failed:', error.message);
            return res.status(401).json({
                success: false,
                message: error.name === 'TokenExpiredError'
                    ? 'Session expired. Please log in again.'
                    : 'Not authorized, token failed'
            });
        }
    }

    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
};

/**
 * Authorize specific roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Role '${req.user?.role || 'unauthenticated'}' is not authorized to access this resource`,
            });
        }
        next();
    };
};

/**
 * Middleware to require super_admin role
 */
const requireSuperAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'super_admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Super admin privileges required.',
        });
    }
    next();
};

/**
 * Middleware to audit critical actions
 */
const auditAction = (action) => {
    return async (req, res, next) => {
        const originalSend = res.send;

        res.send = function (data) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                logAudit({
                    userId: req.user?.id,
                    action,
                    targetType: req.params.id ? req.baseUrl.split('/').pop() : null,
                    targetId: req.params.id || null,
                    metadata: {
                        method: req.method,
                        path: req.path,
                        body: req.body
                    },
                    ipAddress: req.ip,
                    userAgent: req.get('user-agent')
                }).catch(err => console.error('Audit log error:', err));
            }

            originalSend.call(this, data);
        };

        next();
    };
};

module.exports = { protect, authorize, requireSuperAdmin, auditAction };
