const path = require('path');
const fs = require('fs');
const Media = require('../models/Media');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const {
  isImageKitConfigured,
  uploadToImageKit,
  deleteFromImageKit,
  getAuthenticationParameters
} = require('../config/imagekit');

// @desc    Upload Single Image / File (Supports ImageKit + Local Fallback)
// @route   POST /api/upload/image or POST /api/upload
// @access  Private (Admin)
exports.uploadSingle = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a file', 400));
  }

  let fileUrl;
  let fileId = null;
  let thumbnailUrl = null;

  // Check if ImageKit is configured
  if (isImageKitConfigured()) {
    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      const ikResult = await uploadToImageKit(
        fileBuffer,
        req.file.originalname || req.file.filename,
        '/portfolio'
      );
      fileUrl = ikResult.url;
      fileId = ikResult.fileId;
      thumbnailUrl = ikResult.thumbnailUrl;

      // Clean up local temporary file after uploading to cloud
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (ikErr) {
      console.warn('⚠️ ImageKit upload failed, falling back to local URL:', ikErr.message);
      fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
  } else {
    fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  const media = await Media.create({
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    url: fileUrl,
    path: fs.existsSync(req.file.path) ? req.file.path : '',
    fileId: fileId || '',
    thumbnailUrl: thumbnailUrl || fileUrl
  });

  res.status(201).json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      url: media.url,
      id: media._id,
      filename: media.filename,
      originalName: media.originalName,
      size: media.size,
      mimeType: media.mimeType,
      imageKitFileId: fileId,
      thumbnailUrl: media.thumbnailUrl
    }
  });
});

// @desc    Upload Multiple Files
// @route   POST /api/upload/multiple
// @access  Private (Admin)
exports.uploadMultiple = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError('Please upload at least one file', 400));
  }

  const uploadedMedia = [];

  for (const file of req.files) {
    let fileUrl;
    let fileId = null;
    let thumbnailUrl = null;

    if (isImageKitConfigured()) {
      try {
        const fileBuffer = fs.readFileSync(file.path);
        const ikResult = await uploadToImageKit(
          fileBuffer,
          file.originalname || file.filename,
          '/portfolio'
        );
        fileUrl = ikResult.url;
        fileId = ikResult.fileId;
        thumbnailUrl = ikResult.thumbnailUrl;
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      } catch (ikErr) {
        fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      }
    } else {
      fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    }

    const media = await Media.create({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: fileUrl,
      path: fs.existsSync(file.path) ? file.path : '',
      fileId: fileId || '',
      thumbnailUrl: thumbnailUrl || fileUrl
    });

    uploadedMedia.push({
      url: media.url,
      id: media._id,
      filename: media.filename,
      originalName: media.originalName,
      size: media.size,
      mimeType: media.mimeType,
      thumbnailUrl: media.thumbnailUrl,
      imageKitFileId: fileId
    });
  }

  res.status(201).json({
    success: true,
    message: `${uploadedMedia.length} files uploaded successfully`,
    data: uploadedMedia
  });
});

// @desc    Get ImageKit Auth Parameters (for client-side upload widget)
// @route   GET /api/upload/imagekit-auth
// @access  Private (Admin)
exports.getImageKitAuth = asyncHandler(async (req, res, next) => {
  if (!isImageKitConfigured()) {
    return res.status(200).json({
      success: false,
      configured: false,
      message: 'ImageKit is not configured in backend .env'
    });
  }

  const authParams = getAuthenticationParameters();
  res.status(200).json({
    success: true,
    configured: true,
    data: authParams
  });
});

// @desc    Get all media library items
// @route   GET /api/media or GET /api/upload/media
// @access  Private (Admin)
exports.getMediaList = asyncHandler(async (req, res) => {
  const media = await Media.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: media.length,
    data: media
  });
});

// @desc    Delete media file
// @route   DELETE /api/upload/media/:id
// @access  Private (Admin)
exports.deleteMedia = asyncHandler(async (req, res, next) => {
  const media = await Media.findById(req.params.id);

  if (!media) {
    return next(new AppError('Media file not found', 404));
  }

  // If stored in ImageKit, delete from cloud
  if (media.fileId) {
    await deleteFromImageKit(media.fileId);
  }

  // If local file exists, remove from disk
  if (media.path && fs.existsSync(media.path)) {
    fs.unlinkSync(media.path);
  }

  await Media.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Media file deleted successfully'
  });
});

