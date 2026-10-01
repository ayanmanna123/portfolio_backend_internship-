const express = require('express');
const router = express.Router();
const { getSkills, getSkillById, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getSkills)
  .post(protect, adminOnly, createSkill);

router.route('/:id')
  .get(getSkillById)
  .put(protect, adminOnly, updateSkill)
  .delete(protect, adminOnly, deleteSkill);

module.exports = router;
