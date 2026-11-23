import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Building2, MapPin } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminUniversitiesPage = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    universityType: 'Private',
    establishedYear: 2000,
    website: '',
    rating: 4.5,
    accreditation: 'NAAC A++, NIRF Ranked',
    about: '',
    averagePackage: '₹ 8.5 LPA',
    highestPackage: '₹ 45 LPA',
    isFeatured: false,
  });

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/universities?limit=100&search=${encodeURIComponent(search)}`);
      setUniversities(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, [search]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      city: '',
      state: 'Delhi',
      universityType: 'Private',
      establishedYear: 2005,
      website: '',
      rating: 4.5,
      accreditation: 'NAAC A++, NIRF Ranked',
      about: '',
      averagePackage: '₹ 8.5 LPA',
      highestPackage: '₹ 45 LPA',
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (uni) => {
    setEditingId(uni._id);
    setFormData({
      name: uni.name,
      city: uni.location?.city || '',
      state: uni.location?.state || '',
      universityType: uni.universityType || 'Private',
      establishedYear: uni.establishedYear || 2000,
      website: uni.website || '',
      rating: uni.rating || 4.5,
      accreditation: (uni.accreditation || []).join(', '),
      about: uni.about || '',
      averagePackage: uni.placementOverview?.averagePackage || '',
      highestPackage: uni.placementOverview?.highestPackage || '',
      isFeatured: uni.isFeatured || false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        location: {
          city: formData.city,
          state: formData.state,
          country: 'India',
        },
        universityType: formData.universityType,
        establishedYear: Number(formData.establishedYear),
        website: formData.website,
        rating: Number(formData.rating),
        accreditation: formData.accreditation
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean),
        about: formData.about,
        placementOverview: {
          averagePackage: formData.averagePackage,
          highestPackage: formData.highestPackage,
        },
        isFeatured: formData.isFeatured,
      };

      if (editingId) {
        await api.put(`/universities/${editingId}`, payload);
        toast.success('University updated successfully');
      } else {
        await api.post('/universities', payload);
        toast.success('University created successfully');
      }

      setIsModalOpen(false);
      fetchUniversities();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save university');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this university?')) return;
    try {
      await api.delete(`/universities/${id}`);
      setUniversities(universities.filter((u) => u._id !== id));
      toast.success('University removed');
    } catch (err) {
      toast.error('Failed to delete university');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-brand-navy">University Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Maintain verified institution profiles, accreditation, and placement statistics.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-brand-royal hover:bg-brand-navy text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add University</span>
        </button>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-brand-border flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter colleges by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs focus:outline-none"
        />
      </div>

      <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-brand-border text-slate-500 uppercase text-[10px] tracking-wider">
                <th className="p-4">University Name</th>
                <th className="p-4">Location</th>
                <th className="p-4">Type</th>
                <th className="p-4">Accreditation</th>
                <th className="p-4">Avg Package</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Loading...</td>
                </tr>
              ) : universities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">No universities found.</td>
                </tr>
              ) : (
                universities.map((uni) => (
                  <tr key={uni._id} className="hover:bg-brand-light/50 transition-colors">
                    <td className="p-4 font-bold text-brand-navy max-w-xs">
                      {uni.name}
                      {uni.isFeatured && (
                        <span className="ml-2 text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-extrabold uppercase">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-600">
                      {uni.location?.city}, {uni.location?.state}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-[11px] text-slate-700">
                        {uni.universityType}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 max-w-xs truncate">
                      {(uni.accreditation || []).slice(0, 2).join(', ')}
                    </td>
                    <td className="p-4 font-bold text-emerald-700">
                      {uni.placementOverview?.averagePackage || 'Verified'}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(uni)}
                        className="p-1.5 text-slate-500 hover:text-brand-royal rounded hover:bg-slate-100"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(uni._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit University Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-brand-border overflow-hidden animate-scaleUp">
            <div className="bg-brand-navy text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingId ? 'Edit University' : 'Add New University'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">University Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delhi Technological University"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-royal focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Delhi"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Delhi"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Institution Type *</label>
                  <select
                    value={formData.universityType}
                    onChange={(e) => setFormData({ ...formData, universityType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Deemed">Deemed</option>
                    <option value="Autonomous">Autonomous</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Accreditations (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. NAAC A++, NIRF Ranked #29"
                  value={formData.accreditation}
                  onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Average Package</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹ 15.6 LPA"
                    value={formData.averagePackage}
                    onChange={(e) => setFormData({ ...formData, averagePackage: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Highest Package</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹ 1.2 CPA"
                    value={formData.highestPackage}
                    onChange={(e) => setFormData({ ...formData, highestPackage: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">About University *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Campus culture, research facilities, and achievements..."
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-royal hover:bg-brand-navy text-white font-bold rounded-xl shadow transition-colors"
              >
                {editingId ? 'Update University' : 'Create University'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUniversitiesPage;
