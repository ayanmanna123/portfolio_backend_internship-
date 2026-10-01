const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    companyUrl: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
      default: 'full-time'
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: String,
      default: 'Present'
    },
    current: {
      type: Boolean,
      default: false
    },
    description: [{ type: String }],
    skillsUsed: [{ type: String }],
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Experience', experienceSchema);
