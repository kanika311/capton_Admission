const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide exam name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    conductingBody: {
      type: String,
      default: '',
    },
    examLevel: {
      type: String,
      enum: ['National', 'State', 'University'],
      default: 'National',
    },
    stream: {
      type: String, // e.g. Engineering, Medical, Management, Law
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    eligibility: {
      type: String,
      default: '',
    },
    importantDates: [
      {
        title: String,
        date: String,
        description: String,
      },
    ],
    examPattern: {
      mode: { type: String, default: 'Computer Based Test (CBT)' },
      duration: { type: String, default: '3 Hours' },
      totalQuestions: { type: String, default: '90 Questions' },
      markingScheme: { type: String, default: '+4 for correct, -1 for incorrect' },
    },
    syllabus: {
      type: String,
      default: '',
    },
    applicationProcess: {
      type: String,
      default: '',
    },
    participatingUniversities: [
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
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exam', ExamSchema);
