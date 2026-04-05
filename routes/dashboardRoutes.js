const express = require('express');
const { getSummary } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Explicit Middleware Chaining
router.get('/summary', protect, authorize('summary'), getSummary);

module.exports = router;
