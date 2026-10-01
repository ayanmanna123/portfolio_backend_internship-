const express = require('express');
const router = express.Router();
const { login, refreshToken, getMe, changePassword, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// Protected Auth Routes
router.get('/me', protect, getMe);
router.post('/change-password', protect, changePassword);

module.exports = router;
