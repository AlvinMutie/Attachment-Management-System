/**
 * Production-Safe Structured Request Logger
 * Sanitizes headers, passwords, and sensitive fields while logging request metrics.
 */

const sanitizeUrl = (url) => {
    try {
        const parsed = new URL(url, 'http://localhost');
        if (parsed.searchParams.has('token')) parsed.searchParams.set('token', '[REDACTED]');
        if (parsed.searchParams.has('password')) parsed.searchParams.set('password', '[REDACTED]');
        return parsed.pathname + (parsed.search ? parsed.search : '');
    } catch (e) {
        return url;
    }
};

const requestLogger = (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        return next();
    }

    const startTime = Date.now();
    const { method, originalUrl } = req;

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;
        const requestId = req.id || '-';
        const sanitizedPath = sanitizeUrl(originalUrl);

        const logPayload = {
            timestamp: new Date().toISOString(),
            requestId,
            method,
            path: sanitizedPath,
            statusCode,
            durationMs: duration,
            ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '-'
        };

        if (statusCode >= 500) {
            console.error(JSON.stringify({ level: 'ERROR', ...logPayload }));
        } else if (statusCode >= 400) {
            console.warn(JSON.stringify({ level: 'WARN', ...logPayload }));
        } else if (process.env.LOG_LEVEL === 'debug' || process.env.NODE_ENV !== 'production') {
            console.log(JSON.stringify({ level: 'INFO', ...logPayload }));
        }
    });

    next();
};

module.exports = { requestLogger };
