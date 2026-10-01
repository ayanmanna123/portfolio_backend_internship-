const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  uploadSingle,
  uploadMultiple,
  getImageKitAuth,
  getMediaList,
  deleteMedia
} = require('../controllers/uploadController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/image', protect, adminOnly, upload.single('file'), uploadSingle);
router.post('/file', protect, adminOnly, upload.single('file'), uploadSingle);
router.post('/multiple', protect, adminOnly, upload.array('files', 10), uploadMultiple);
router.get('/imagekit-auth', protect, adminOnly, getImageKitAuth);

router.get('/media', protect, adminOnly, getMediaList);
router.delete('/media/:id', protect, adminOnly, deleteMedia);

module.exports = router;
