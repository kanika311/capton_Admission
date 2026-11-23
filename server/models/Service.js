const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide service title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    icon: {
      type: String,
      default: 'Compass',
    },
    shortDescription: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
      default: '',
    },
    benefits: [
      {
        type: String,
      },
    ],
    processSteps: [
      {
        stepNumber: Number,
        title: String,
        description: String,
      },
    ],
    whoCanUse: [
      {
        type: String,
      },
    ],
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
    image: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', ServiceSchema);
