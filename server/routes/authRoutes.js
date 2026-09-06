const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authRateLimiter } = require('../middleware/rateLimiter');

// Rate-limited public authentication entry points
router.post('/register', authRateLimiter({ maxAttempts: 15 }), register);
router.post('/login', authRateLimiter({ maxAttempts: 25 }), login);

// Authenticated current-user identity resolution
router.get('/me', protect, getMe);

module.exports = router;
