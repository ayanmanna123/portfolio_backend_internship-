const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Frontend', 'Backend', 'Database', 'DevOps & Tools', 'Design & Other'],
      default: 'Frontend'
    },
    level: {
      type: Number,
      min: 1,
      max: 100,
      default: 85
    },
    icon: {
      type: String,
      default: 'code' // Lucide / SimpleIcon name or SVG / URL
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
