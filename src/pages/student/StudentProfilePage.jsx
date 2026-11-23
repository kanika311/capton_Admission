import React, { useState, useEffect } from 'react';
import { User, BookOpen, Save, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StudentProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    gender: 'Male',
    address: '',
    city: '',
    state: '',
    pincode: '',
    tenthQualification: {
      board: '',
      school: '',
      percentage: '',
      year: '',
    },
    twelfthQualification: {
      stream: '',
      board: '',
      school: '',
      percentage: '',
      year: '',
    },
    graduationDetails: {
      degree: '',
      university: '',
      percentage: '',
      year: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/students/profile');
        const p = res.data.data;
        setProfile(p);

        setFormData({
          name: p.user?.name || '',
          phone: p.user?.phone || '',
          dob: p.dob ? new Date(p.dob).toISOString().split('T')[0] : '',
          gender: p.gender || 'Male',
          address: p.address || '',
          city: p.city || '',
          state: p.state || '',
          pincode: p.pincode || '',
          tenthQualification: {
            board: p.tenthQualification?.board || '',
            school: p.tenthQualification?.school || '',
            percentage: p.tenthQualification?.percentage || '',
            year: p.tenthQualification?.year || '',
          },
          twelfthQualification: {
            stream: p.twelfthQualification?.stream || '',
            board: p.twelfthQualification?.board || '',
            school: p.twelfthQualification?.school || '',
            percentage: p.twelfthQualification?.percentage || '',
            year: p.twelfthQualification?.year || '',
          },
          graduationDetails: {
            degree: p.graduationDetails?.degree || '',
            university: p.graduationDetails?.university || '',
            percentage: p.graduationDetails?.percentage || '',
            year: p.graduationDetails?.year || '',
          },
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/students/profile', {
        name: formData.name,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      });
      toast.success('Personal profile details saved!');
    } catch (err) {
      toast.error('Failed to save profile details');
    } finally {
      setSaving(false);
    }
  };

  const handleEducationSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/students/education', {
        tenthQualification: formData.tenthQualification,
        twelfthQualification: formData.twelfthQualification,
        graduationDetails: formData.graduationDetails,
      });
      toast.success('Academic qualifications updated successfully!');
    } catch (err) {
      toast.error('Failed to update education details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-royal mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div>
        <h2 className="text-xl font-extrabold text-brand-navy">Student Profile & Education</h2>
        <p className="text-xs text-slate-500 mt-1">
          Provide accurate demographic and educational credentials for swift application verification.
        </p>
      </div>

      {/* 1. Personal Information */}
      <form onSubmit={handlePersonalSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card space-y-6">
        <h3 className="font-bold text-base text-brand-navy border-b border-slate-100 pb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-brand-royal" />
          1. Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-royal focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-royal focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-royal focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-royal focus:outline-none bg-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-royal focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-royal focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-royal focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-brand-royal hover:bg-brand-navy text-white font-bold rounded-xl text-xs shadow flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Personal Details</span>
        </button>
      </form>

      {/* 2. Educational Credentials */}
      <form onSubmit={handleEducationSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card space-y-6">
        <h3 className="font-bold text-base text-brand-navy border-b border-slate-100 pb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-gold" />
          2. Academic History
        </h3>

        {/* 10th Standard */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Class 10th Qualification
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 mb-1">Board (e.g. CBSE)</label>
              <input
                type="text"
                value={formData.tenthQualification.board}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tenthQualification: { ...formData.tenthQualification, board: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">School Name</label>
              <input
                type="text"
                value={formData.tenthQualification.school}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tenthQualification: { ...formData.tenthQualification, school: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Percentage %</label>
              <input
                type="number"
                step="0.01"
                value={formData.tenthQualification.percentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tenthQualification: { ...formData.tenthQualification, percentage: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Passing Year</label>
              <input
                type="number"
                value={formData.tenthQualification.year}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tenthQualification: { ...formData.tenthQualification, year: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* 12th Standard */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Class 12th Qualification
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 mb-1">Stream (PCM/PCB/Comm)</label>
              <input
                type="text"
                value={formData.twelfthQualification.stream}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    twelfthQualification: { ...formData.twelfthQualification, stream: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Board</label>
              <input
                type="text"
                value={formData.twelfthQualification.board}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    twelfthQualification: { ...formData.twelfthQualification, board: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">School</label>
              <input
                type="text"
                value={formData.twelfthQualification.school}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    twelfthQualification: { ...formData.twelfthQualification, school: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Percentage %</label>
              <input
                type="number"
                step="0.01"
                value={formData.twelfthQualification.percentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    twelfthQualification: { ...formData.twelfthQualification, percentage: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Passing Year</label>
              <input
                type="number"
                value={formData.twelfthQualification.year}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    twelfthQualification: { ...formData.twelfthQualification, year: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-brand-royal hover:bg-brand-navy text-white font-bold rounded-xl text-xs shadow flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Academic Credentials</span>
        </button>
      </form>
    </div>
  );
};

export default StudentProfilePage;
