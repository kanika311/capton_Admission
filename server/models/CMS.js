const mongoose = require('mongoose');

const CMSSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'homepage_settings',
    },
    heroHeading: {
      type: String,
      default: 'Find Your Dream Course & Discover Your Perfect University',
    },
    heroVideoUrl: {
      type: String,
      default: 'https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-campus-43387-large.mp4',
    },
    heroDescription: {
      type: String,
      default:
        'Explore top courses, compare universities, understand admission opportunities, and get personalized guidance with CaptonAdmission.',
    },
    heroImages: [
      {
        type: String,
      },
    ],
    banners: [
      {
        title: String,
        image: String,
        link: String,
      },
    ],
    popularCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    featuredUniversities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
      },
    ],
    contactDetails: {
      phone: { type: String, default: '+91 98765 43210' },
      email: { type: String, default: 'admissions@captonadmission.com' },
      address: { type: String, default: 'CaptonAdmission Tower, Knowledge Park, New Delhi, India' },
      workingHours: { type: String, default: 'Mon - Sat: 9:00 AM - 7:00 PM' },
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      instagram: { type: String, default: 'https://instagram.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      youtube: { type: String, default: 'https://youtube.com' },
    },
    footerLinks: [
      {
        section: String,
        title: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('CMS', CMSSchema);
