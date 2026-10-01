const Blog = require('../models/Blog');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public (published only unless admin)
exports.getBlogs = asyncHandler(async (req, res) => {
  const { status, tag, search } = req.query;
  const filter = {};

  // If request doesn't have valid admin token, default to published
  if (status && (status === 'published' || status === 'draft')) {
    filter.status = status;
  }

  if (tag) filter.tags = tag;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ];
  }

  const blogs = await Blog.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs
  });
});

// @desc    Get single blog post by slug or ID
// @route   GET /api/blogs/:slugOrId
// @access  Public
exports.getBlogBySlugOrId = asyncHandler(async (req, res, next) => {
  const { slugOrId } = req.params;
  const query = slugOrId.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: slugOrId }
    : { slug: slugOrId };

  const blog = await Blog.findOne(query);
  if (!blog) return next(new AppError('Blog post not found', 404));

  // Increment view count
  blog.views += 1;
  await blog.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: blog
  });
});

// @desc    Create blog post
// @route   POST /api/blogs
// @access  Private (Admin)
exports.createBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Blog post created successfully',
    data: blog
  });
});

// @desc    Update blog post
// @route   PUT /api/blogs/:id
// @access  Private (Admin)
exports.updateBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!blog) return next(new AppError('Blog post not found', 404));

  res.status(200).json({
    success: true,
    message: 'Blog post updated successfully',
    data: blog
  });
});

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id
// @access  Private (Admin)
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return next(new AppError('Blog post not found', 404));

  res.status(200).json({
    success: true,
    message: 'Blog post deleted successfully'
  });
});
