const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectByIdOrSlug,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProjects)
  .post(protect, adminOnly, createProject);

router.route('/:idOrSlug')
  .get(getProjectByIdOrSlug);

router.route('/:id')
  .put(protect, adminOnly, updateProject)
  .delete(protect, adminOnly, deleteProject);

module.exports = router;
