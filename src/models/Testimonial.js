const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true
    },
    position: {
      type: String,
      default: ''
    },
    company: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    quote: {
      type: String,
      required: [true, 'Quote is required']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    projectLink: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
