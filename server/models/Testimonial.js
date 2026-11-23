const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Please provide student name'],
      trim: true,
    },
    course: {
      type: String,
      required: true,
    },
    university: {
      type: String,
      required: true,
    },
    quote: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', TestimonialSchema);
