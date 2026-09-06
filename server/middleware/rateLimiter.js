/**
 * Lightweight in-memory rate limiter for authentication endpoints
 */
const ipStore = new Map();

const authRateLimiter = ({
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxAttempts = 25,
    message = 'Too many requests from this IP. Please try again later.'
} = {}) => {
    return (req, res, next) => {
        const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        const now = Date.now();

        const record = ipStore.get(clientIp) || { count: 0, resetTime: now + windowMs };

        if (now > record.resetTime) {
            record.count = 0;
            record.resetTime = now + windowMs;
        }

        record.count += 1;
        ipStore.set(clientIp, record);

        res.setHeader('X-RateLimit-Limit', maxAttempts);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, maxAttempts - record.count));
        res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

        if (record.count > maxAttempts) {
            return res.status(429).json({
                success: false,
                message,
                retryAfter: Math.ceil((record.resetTime - now) / 1000)
            });
        }

        next();
    };
};

// Periodic cleanup of stale IP entries every 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipStore.entries()) {
        if (now > record.resetTime) {
            ipStore.delete(ip);
        }
    }
}, 10 * 60 * 1000);

module.exports = { authRateLimiter };
