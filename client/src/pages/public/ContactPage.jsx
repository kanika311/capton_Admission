import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/contact', formData);
      setSent(true);
      toast.success('Message sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light pb-20">
      <div className="bg-brand-navy text-white py-12 px-4 border-b border-brand-border">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Contact CaptonAdmission
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Have questions about college admissions, fee structures, or our services? Our team is here to assist.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card space-y-6">
              <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-3">
                Headquarters & Helpline
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-royal mt-1 shrink-0" />
                  <div>
                    <strong className="block text-brand-darkText">Main Office</strong>
                    CaptonAdmission Tower, Knowledge Park, New Delhi, India - 110001
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-brand-gold shrink-0" />
                  <div>
                    <strong className="block text-brand-darkText">Admissions Helpline</strong>
                    +91 98765 43210 (Toll Free: 1800-11-2026)
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-brand-royal shrink-0" />
                  <div>
                    <strong className="block text-brand-darkText">General Inquiries</strong>
                    admissions@captonadmission.com
                  </div>
                </div>
              </div>

              <div className="p-4 bg-brand-light rounded-xl border border-brand-border text-xs text-slate-500">
                <strong>Working Hours:</strong> Monday – Saturday: 9:00 AM – 7:00 PM (IST)
              </div>
            </div>
          </div>

          {/* Working Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card">
              {sent ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-darkText">Thank You For Writing to Us!</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Your inquiry has been stored securely and dispatched to our student counseling desk. An advisor will contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    className="px-6 py-2.5 bg-brand-royal text-white font-bold text-xs rounded-xl"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-3">
                    Send Us an Inquiry
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-royal focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-royal focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-royal focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-royal focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-royal focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-brand-royal hover:bg-brand-navy text-white font-bold rounded-xl text-xs shadow transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Sending...' : 'Submit Contact Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
