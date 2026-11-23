const mongoose = require('mongoose');

const CounsellingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Please enter name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter email'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please enter phone'],
      trim: true,
    },
    preferredMode: {
      type: String,
      enum: ['Call', 'Video', 'In-Person'],
      default: 'Call',
    },
    preferredDate: {
      type: Date,
    },
    preferredTimeSlot: {
      type: String,
      default: '10:00 AM - 12:00 PM',
    },
    targetCourse: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Requested', 'Scheduled', 'Completed', 'Cancelled'],
      default: 'Requested',
    },
    counsellorAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    meetingLink: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Counselling', CounsellingSchema);
