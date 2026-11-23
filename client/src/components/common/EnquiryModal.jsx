import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Send, CheckCircle2, Shield, GraduationCap, Building2 } from 'lucide-react';
import { closeEnquiryModal } from '../../redux/slices/enquiryModalSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';

const EnquiryModal = () => {
  const dispatch = useDispatch();
  const { isOpen, prefillCourse, prefillUniversity, prefillSpecialization } = useSelector(
    (state) => state.enquiryModal
  );
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    qualification: '',
    specialization: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [enquiryId, setEnquiryId] = useState('');

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
    if (prefillSpecialization) {
      setFormData((prev) => ({ ...prev, specialization: prefillSpecialization }));
    }
  }, [user, prefillSpecialization]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in your name, email, and phone number');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        course: prefillCourse?._id || null,
        courseName: prefillCourse?.name || '',
        university: prefillUniversity?._id || null,
        universityName: prefillUniversity?.name || '',
        specialization: formData.specialization || prefillSpecialization || 'General',
      };

      const res = await api.post('/enquiries', payload);
      setEnquiryId(res.data.data?.enquiryNumber || 'ENQ-SUCCESS');
      setSubmitted(true);
      toast.success('Enquiry submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    dispatch(closeEnquiryModal());
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-brand-border overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-navy to-brand-royal text-white px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Get Free Admission Counselling</h3>
            <p className="text-xs text-slate-200 mt-0.5">
              Personalized guidance & fee breakdown from senior academic advisors
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-brand-darkText">Enquiry Received!</h4>
            <p className="text-sm text-slate-600 mt-2">
              Your application inquiry reference ID is{' '}
              <strong className="text-brand-royal font-mono">{enquiryId}</strong>.
            </p>
            <p className="text-xs text-slate-500 mt-2">
              A designated CaptonAdmission academic counsellor will call you shortly to assist with fees, scholarships, and admission procedures.
            </p>
            <button
              onClick={handleClose}
              className="mt-6 px-6 py-2.5 bg-brand-royal text-white font-bold rounded-lg text-sm hover:bg-brand-navy"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Context Pills if Course or University is prefilled */}
            {(prefillCourse || prefillUniversity) && (
              <div className="bg-brand-light p-3 rounded-xl border border-brand-border space-y-1.5 text-xs">
                {prefillCourse && (
                  <div className="flex items-center gap-1.5 text-brand-royal font-medium">
                    <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                    <span>Selected Course: <strong>{prefillCourse.name}</strong></span>
                  </div>
                )}
                {prefillUniversity && (
                  <div className="flex items-center gap-1.5 text-brand-darkText font-medium">
                    <Building2 className="w-3.5 h-3.5 shrink-0 text-brand-gold" />
                    <span>Target University: <strong>{prefillUniversity.name}</strong></span>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-royal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-royal focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-royal focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your State
                </label>
                <input
                  type="text"
                  placeholder="e.g. Delhi NCR, Maharashtra"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-royal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Highest Qualification
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12th Science / Graduate"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-royal focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Query / Notes for Counsellor
              </label>
              <textarea
                rows={2}
                placeholder="Ask about fee structures, entrance exams, or scholarship criteria..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-royal focus:outline-none resize-none"
              ></textarea>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100% confidential. No spam calls. Verified counsellors only.</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-bold rounded-lg shadow transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting Enquiry...' : 'Request Free Counselling'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EnquiryModal;
