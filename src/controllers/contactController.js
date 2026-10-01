const Message = require('../models/Message');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { sendContactEmail } = require('../config/mailer');

// @desc    Submit Contact Form Message (Public)
// @route   POST /api/contact
// @access  Public
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return next(new AppError('Name, email, and message content are required', 400));
  }

  // 1. Save to Database
  const newMessage = await Message.create({
    name,
    email,
    subject: subject || 'Portfolio Contact Form Inquiry',
    message
  });

  // 2. Trigger Email Notification
  await sendContactEmail({
    name,
    email,
    subject,
    message
  });

  res.status(201).json({
    success: true,
    message: 'Thank you! Your message has been sent successfully.',
    data: {
      id: newMessage._id,
      createdAt: newMessage.createdAt
    }
  });
});

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact/messages
// @access  Private (Admin)
exports.getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  const unreadCount = await Message.countDocuments({ isRead: false });

  res.status(200).json({
    success: true,
    count: messages.length,
    unreadCount,
    data: messages
  });
});

// @desc    Mark message as read (Admin)
// @route   PATCH /api/contact/messages/:id/read
// @access  Private (Admin)
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  if (!message) return next(new AppError('Message not found', 404));

  res.status(200).json({
    success: true,
    message: 'Message marked as read',
    data: message
  });
});

// @desc    Delete message (Admin)
// @route   DELETE /api/contact/messages/:id
// @access  Private (Admin)
exports.deleteMessage = asyncHandler(async (req, res, next) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) return next(new AppError('Message not found', 404));

  res.status(200).json({
    success: true,
    message: 'Message deleted successfully'
  });
});
