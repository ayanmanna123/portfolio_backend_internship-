const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public endpoint for submitting contact form
router.post('/', sendMessage);

// Admin endpoints
router.get('/messages', protect, adminOnly, getMessages);
router.patch('/messages/:id/read', protect, adminOnly, markAsRead);
router.delete('/messages/:id', protect, adminOnly, deleteMessage);

module.exports = router;
