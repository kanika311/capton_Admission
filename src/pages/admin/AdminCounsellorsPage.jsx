import React, { useState, useEffect } from 'react';
import { Plus, UserCheck, Star, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminCounsellorsPage = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specializations: 'Engineering, Management',
    bio: '',
  });

  const fetchCounsellors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/counsellors');
      setCounsellors(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounsellors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/counsellors', {
        name: formData.name,
        email: formData.email,
        password: formData.password || 'Counsellor@12345',
        phone: formData.phone,
        specializationAreas: formData.specializations
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        bio: formData.bio,
      });

      toast.success('New counsellor added successfully');
      setIsModalOpen(false);
      fetchCounsellors();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add counsellor');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-brand-navy">Academic Counsellor Team</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage certified counsellors and mentor capacity allocations.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-brand-royal hover:bg-brand-navy text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Counsellor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-xs text-slate-400 py-8 text-center col-span-3">Loading team...</p>
        ) : counsellors.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center col-span-3">No counsellors found.</p>
        ) : (
          counsellors.map((c) => (
            <div
              key={c._id}
              className="bg-white p-6 rounded-2xl border border-brand-border shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-brand-royal text-white font-bold flex items-center justify-center uppercase text-sm border-2 border-brand-gold">
                    {c.user?.name ? c.user.name[0] : 'C'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-navy">{c.user?.name}</h4>
                    <p className="text-xs text-slate-500">{c.user?.email}</p>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{c.rating || 4.9}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {c.bio}
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {(c.specializationAreas || []).map((area, i) => (
                    <span key={i} className="text-[10px] bg-blue-50 text-brand-royal px-2 py-0.5 rounded font-semibold">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Active Leads: <strong className="text-brand-navy">{c.assignedLeadsCount || 0}</strong></span>
                <span className="text-emerald-600 font-bold">Online</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Counsellor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-brand-border overflow-hidden animate-scaleUp">
            <div className="bg-brand-navy text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Counsellor</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Rajesh Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="counsellor@captonadmission.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Temporary Password</label>
                <input
                  type="password"
                  placeholder="Default: Counsellor@12345"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43211"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specialization Streams (Comma separated)</label>
                <input
                  type="text"
                  value={formData.specializations}
                  onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Bio</label>
                <textarea
                  rows={2}
                  placeholder="Senior counsellor credentials..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-royal hover:bg-brand-navy text-white font-bold rounded-xl shadow transition-colors"
              >
                Register Counsellor
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCounsellorsPage;
