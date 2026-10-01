const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required']
    },
    content: {
      type: String,
      required: [true, 'Blog content is required']
    },
    coverImage: {
      type: String,
      default: ''
    },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    views: {
      type: Number,
      default: 0
    },
    publishedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

blogSchema.pre('validate', function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Math.floor(Math.random() * 10000);
  }
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
