const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { logAudit } = require('../utils/auditLogger');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            // Check if account is locked
            if (req.user && req.user.status === 'locked') {
                return res.status(403).json({ message: 'Account is locked. Contact administrator.' });
            }

            // Attach school context for filtering
            req.schoolId = decoded.schoolId;

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`,
            });
        }
        next();
    };
};

/**
 * Middleware to require super_admin role
 */
const requireSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'super_admin') {
        return res.status(403).json({
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
        // Store original send function
        const originalSend = res.send;

        // Override send to capture response
        res.send = function (data) {
            // Only log if request was successful
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

            // Call original send
            originalSend.call(this, data);
        };

        next();
    };
};

module.exports = { protect, authorize, requireSuperAdmin, auditAction };
