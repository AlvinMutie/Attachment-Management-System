const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { serveDocument } = require('../controllers/documentController');

// All document routes require authentication and authorization
router.use(protect);

router.get('/:category/:filename', serveDocument);

module.exports = router;
