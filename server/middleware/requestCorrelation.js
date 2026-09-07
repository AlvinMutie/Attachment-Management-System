const crypto = require('crypto');

/**
 * Request Correlation Middleware
 * Injects a unique X-Request-ID header into incoming requests and propagates it in responses.
 */
const requestCorrelation = (req, res, next) => {
    const incomingId = req.headers['x-request-id'];
    const requestId = incomingId && typeof incomingId === 'string' && incomingId.trim()
        ? incomingId.trim().slice(0, 64)
        : crypto.randomUUID();

    req.id = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
};

module.exports = { requestCorrelation };
