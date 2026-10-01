const Service = require('../models/Service');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = asyncHandler(async (req, res) => {
  const { featured } = req.query;
  const filter = {};
  if (featured === 'true') filter.isFeatured = true;

  const services = await Service.find(filter).sort({ order: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: services.length,
    data: services
  });
});

// @desc    Create service
// @route   POST /api/services
// @access  Private (Admin)
exports.createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Service created successfully',
    data: service
  });
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Admin)
exports.updateService = asyncHandler(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!service) return next(new AppError('Service not found', 404));

  res.status(200).json({
    success: true,
    message: 'Service updated successfully',
    data: service
  });
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
exports.deleteService = asyncHandler(async (req, res, next) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) return next(new AppError('Service not found', 404));

  res.status(200).json({
    success: true,
    message: 'Service deleted successfully'
  });
});
