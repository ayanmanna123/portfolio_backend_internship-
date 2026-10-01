const express = require('express');
const router = express.Router();
const {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience
} = require('../controllers/experienceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getExperiences)
  .post(protect, adminOnly, createExperience);

router.route('/:id')
  .put(protect, adminOnly, updateExperience)
  .delete(protect, adminOnly, deleteExperience);

module.exports = router;
