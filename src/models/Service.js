const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true
    },
    icon: {
      type: String,
      default: 'layout'
    },
    description: {
      type: String,
      required: [true, 'Service description is required']
    },
    features: [{ type: String }],
    priceRange: {
      type: String,
      default: ''
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

module.exports = mongoose.model('Service', serviceSchema);
