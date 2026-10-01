const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Alex Rivera'
    },
    title: {
      type: String,
      required: true,
      default: 'Full Stack Engineer & UI/UX Craftsman'
    },
    bio: {
      type: String,
      required: true,
      default: 'Passionate developer with 5+ years of experience building modern web applications, custom CMS engines, and interactive user experiences.'
    },
    avatarUrl: {
      type: String,
      default: ''
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: 'San Francisco, CA'
    },
    email: {
      type: String,
      default: 'alex@example.com'
    },
    phone: {
      type: String,
      default: '+1 (555) 019-2834'
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      instagram: { type: String, default: '' },
      website: { type: String, default: '' }
    },
    stats: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true }
      }
    ],
    highlights: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('About', aboutSchema);
