import React, { useState, useEffect } from 'react';
import {
  Video,
  Type,
  Phone,
  Mail,
  MapPin,
  Clock,
  Save,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const videoPresets = [
  {
    name: 'CaptonAdmission Custom Video (Uploaded by You)',
    url: '/hero_video.mp4',
  },
  {
    name: 'University Campus Walk',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-campus-43387-large.mp4',
  },
  {
    name: 'University Library & Studying',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-studying-in-a-library-43384-large.mp4',
  },
];

const AdminCMSPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    heroHeading: 'Find Your Dream Course & Discover Your Perfect University',
    heroVideoUrl: '/hero_video.mp4',
    heroDescription:
      'Explore top courses, compare universities, understand admission opportunities, and get personalized guidance with CaptonAdmission.',
    contactDetails: {
      phone: '+91 98765 43210',
      email: 'admissions@captonadmission.com',
      address: 'CaptonAdmission Tower, Knowledge Park, New Delhi, India',
      workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    },
  });

  useEffect(() => {
    fetchCMS();
  }, []);

  const fetchCMS = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cms');
      if (res.data?.data) {
        const d = res.data.data;
        setFormData({
          heroHeading:
            d.heroHeading || 'Find Your Dream Course & Discover Your Perfect University',
          heroVideoUrl:
            d.heroVideoUrl ||
            'https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-campus-43387-large.mp4',
          heroDescription:
            d.heroDescription ||
            'Explore top courses, compare universities, understand admission opportunities, and get personalized guidance with CaptonAdmission.',
          contactDetails: {
            phone: d.contactDetails?.phone || '+91 98765 43210',
            email: d.contactDetails?.email || 'admissions@captonadmission.com',
            address:
              d.contactDetails?.address ||
              'CaptonAdmission Tower, Knowledge Park, New Delhi, India',
            workingHours: d.contactDetails?.workingHours || 'Mon - Sat: 9:00 AM - 7:00 PM',
          },
        });
      }
    } catch (err) {
      console.error('Error fetching CMS:', err);
      toast.error('Could not load current CMS settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/cms', formData);
      toast.success('Hero Banner & CMS settings saved successfully!');
    } catch (err) {
      console.error('Error saving CMS:', err);
      toast.error(err.response?.data?.message || 'Failed to update CMS settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-royal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-brand-navy tracking-tight">
            Hero Banner & CMS Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure the homepage video banner, single-line headline, and portal contact information.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-royal hover:bg-brand-navy text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm disabled:opacity-50 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Hero Banner Video & Headline Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-royal flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                Hero Video Banner Controls
              </h3>
            </div>

            {/* Banner Single-Line Headline */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-brand-royal" />
                  Single-Line Headline Text
                </label>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Must be 1 line on desktop
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.heroHeading}
                onChange={(e) =>
                  setFormData({ ...formData, heroHeading: e.target.value })
                }
                placeholder="Find Your Dream Course & Discover Your Perfect University"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal text-sm font-semibold text-slate-800"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Keep it concise so it stays cleanly on one single line across modern screens.
              </p>
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Hero Background Video URL (.mp4 / direct video URL)
              </label>
              <input
                type="url"
                required
                value={formData.heroVideoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, heroVideoUrl: e.target.value })
                }
                placeholder="https://.../video.mp4"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal text-sm text-slate-800 font-mono"
              />

              {/* Preset Video Shortcuts */}
              <div className="mt-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Quick Video Presets (Click to apply):
                </span>
                <div className="space-y-1.5">
                  {videoPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, heroVideoUrl: preset.url })
                      }
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center justify-between ${
                        formData.heroVideoUrl === preset.url
                          ? 'bg-blue-50 border-brand-royal text-brand-royal font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{preset.name}</span>
                      {formData.heroVideoUrl === preset.url && (
                        <CheckCircle className="w-3.5 h-3.5 text-brand-royal" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Short Subtitle */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Hero Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={formData.heroDescription}
                onChange={(e) =>
                  setFormData({ ...formData, heroDescription: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal text-sm text-slate-700"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                Helpline & Contact Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Helpline Phone
                </label>
                <input
                  type="text"
                  value={formData.contactDetails.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactDetails: { ...formData.contactDetails, phone: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={formData.contactDetails.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactDetails: { ...formData.contactDetails, email: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Office / Campus Address
                </label>
                <input
                  type="text"
                  value={formData.contactDetails.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactDetails: { ...formData.contactDetails, address: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                Live Banner Preview
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                Real-Time
              </span>
            </div>

            {/* Video Preview Box */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 shadow-inner flex items-center justify-center border border-slate-800">
              {formData.heroVideoUrl ? (
                <video
                  key={formData.heroVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src={formData.heroVideoUrl} type="video/mp4" />
                  Your browser does not support HTML video.
                </video>
              ) : null}

              {/* Clean Overlay */}
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center">
                <span className="inline-block text-[9px] font-bold text-brand-gold uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded-full mb-2 border border-white/20">
                  India's Verified Admission Platform
                </span>

                <h4 className="text-white font-extrabold text-sm sm:text-base leading-snug tracking-tight line-clamp-1">
                  {formData.heroHeading || 'Your Single-Line Heading Appears Here'}
                </h4>

                <p className="text-slate-300 text-[11px] mt-1 max-w-xs line-clamp-2">
                  {formData.heroDescription}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] bg-brand-gold text-brand-navy font-bold px-3 py-1 rounded-md">
                    Explore Courses
                  </span>
                  <span className="text-[10px] bg-white/20 text-white font-semibold px-2.5 py-1 rounded-md">
                    Talk to Counsellor
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <p className="font-semibold text-slate-800">Headline Check:</p>
              <p className="text-brand-royal font-medium italic">
                "{formData.heroHeading}"
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                The homepage automatically renders this video in full high definition with zero lag.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminCMSPage;
