const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Please provide subject'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide message'],
    },
    status: {
      type: String,
      enum: ['New', 'Read', 'Replied', 'Resolved'],
      default: 'New',
    },
    replyNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);
