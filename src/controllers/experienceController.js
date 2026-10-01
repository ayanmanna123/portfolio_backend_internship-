const Experience = require('../models/Experience');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// @desc    Get all experience items
// @route   GET /api/experience
// @access  Public
exports.getExperiences = asyncHandler(async (req, res) => {
  const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
  res.status(200).json({
    success: true,
    count: experiences.length,
    data: experiences
  });
});

// @desc    Create experience item
// @route   POST /api/experience
// @access  Private (Admin)
exports.createExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Experience item created successfully',
    data: experience
  });
});

// @desc    Update experience item
// @route   PUT /api/experience/:id
// @access  Private (Admin)
exports.updateExperience = asyncHandler(async (req, res, next) => {
  const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!experience) return next(new AppError('Experience item not found', 404));

  res.status(200).json({
    success: true,
    message: 'Experience item updated successfully',
    data: experience
  });
});

// @desc    Delete experience item
// @route   DELETE /api/experience/:id
// @access  Private (Admin)
exports.deleteExperience = asyncHandler(async (req, res, next) => {
  const experience = await Experience.findByIdAndDelete(req.params.id);
  if (!experience) return next(new AppError('Experience item not found', 404));

  res.status(200).json({
    success: true,
    message: 'Experience item deleted successfully'
  });
});
