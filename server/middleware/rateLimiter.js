/**
 * Lightweight in-memory rate limiter with profiles for auth, API, and document streaming
 */
const ipStore = new Map();

const createRateLimiter = ({
    windowMs = 15 * 60 * 1000,
    maxAttempts = 25,
    message = 'Too many requests. Please try again later.'
} = {}) => {
    return (req, res, next) => {
        if (process.env.NODE_ENV === 'test') {
            return next();
        }
        const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        const key = `${req.baseUrl || req.path}:${clientIp}`;
        const now = Date.now();

        const record = ipStore.get(key) || { count: 0, resetTime: now + windowMs };

        if (now > record.resetTime) {
            record.count = 0;
            record.resetTime = now + windowMs;
        }

        record.count += 1;
        ipStore.set(key, record);

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

const authRateLimiter = (options) => createRateLimiter({
    windowMs: 15 * 60 * 1000,
    maxAttempts: 25,
    message: 'Too many authentication attempts from this IP. Please try again later.',
    ...options
});

const apiRateLimiter = (options) => createRateLimiter({
    windowMs: 60 * 1000,
    maxAttempts: 120,
    message: 'API rate limit exceeded. Please throttle requests.',
    ...options
});

const documentRateLimiter = (options) => createRateLimiter({
    windowMs: 5 * 60 * 1000,
    maxAttempts: 60,
    message: 'Document download limit reached. Please wait before streaming additional files.',
    ...options
});

// Periodic cleanup of stale IP entries every 10 minutes (unref so it doesn't block clean shutdown)
const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of ipStore.entries()) {
        if (now > record.resetTime) {
            ipStore.delete(key);
        }
    }
}, 10 * 60 * 1000);

if (cleanupTimer.unref) {
    cleanupTimer.unref();
}

module.exports = {
    createRateLimiter,
    authRateLimiter,
    apiRateLimiter,
    documentRateLimiter
};
