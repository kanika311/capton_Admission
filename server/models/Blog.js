const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide blog title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      default: 'Admission Guide',
    },
    excerpt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
      },
    ],
    author: {
      type: String,
      default: 'CaptonAdmission Editorial Team',
    },
    seoTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

BlogSchema.index({ slug: 1, isPublished: 1, category: 1 });

module.exports = mongoose.model('Blog', BlogSchema);
