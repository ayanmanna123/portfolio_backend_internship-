const About = require('../models/About');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// @desc    Get About info
// @route   GET /api/about
// @access  Public
exports.getAbout = asyncHandler(async (req, res) => {
  let about = await About.findOne();
  if (!about) {
    about = await About.create({
      name: 'Alex Rivera',
      title: 'Full Stack Engineer & Custom CMS Architect',
      bio: 'Passionate full stack software engineer specializing in web application development and bespoke CMS engines.'
    });
  }

  res.status(200).json({
    success: true,
    data: about
  });
});

// @desc    Update About info (Upsert)
// @route   PUT /api/about
// @access  Private (Admin)
exports.updateAbout = asyncHandler(async (req, res) => {
  let about = await About.findOne();

  if (about) {
    about = await About.findByIdAndUpdate(about._id, req.body, {
      new: true,
      runValidators: true
    });
  } else {
    about = await About.create(req.body);
  }

  res.status(200).json({
    success: true,
    message: 'About information updated successfully',
    data: about
  });
});
