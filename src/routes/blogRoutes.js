const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogBySlugOrId,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getBlogs)
  .post(protect, adminOnly, createBlog);

router.route('/:slugOrId')
  .get(getBlogBySlugOrId);

router.route('/:id')
  .put(protect, adminOnly, updateBlog)
  .delete(protect, adminOnly, deleteBlog);

module.exports = router;
