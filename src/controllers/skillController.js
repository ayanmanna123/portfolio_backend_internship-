const Skill = require('../models/Skill');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
exports.getSkills = asyncHandler(async (req, res) => {
  const { category, featured } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (featured === 'true') filter.isFeatured = true;

  const skills = await Skill.find(filter).sort({ order: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: skills.length,
    data: skills
  });
});

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
exports.getSkillById = asyncHandler(async (req, res, next) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) return next(new AppError('Skill not found', 404));

  res.status(200).json({
    success: true,
    data: skill
  });
});

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private (Admin)
exports.createSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Skill created successfully',
    data: skill
  });
});

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private (Admin)
exports.updateSkill = asyncHandler(async (req, res, next) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!skill) return next(new AppError('Skill not found', 404));

  res.status(200).json({
    success: true,
    message: 'Skill updated successfully',
    data: skill
  });
});

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private (Admin)
exports.deleteSkill = asyncHandler(async (req, res, next) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) return next(new AppError('Skill not found', 404));

  res.status(200).json({
    success: true,
    message: 'Skill deleted successfully'
  });
});
