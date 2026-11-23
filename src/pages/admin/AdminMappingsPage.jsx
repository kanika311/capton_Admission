import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, GitMerge, Search, Check, X, Building2, GraduationCap } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminMappingsPage = () => {
  const [mappings, setMappings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    course: '',
    university: '',
    specialization: 'General',
    duration: '4 Years',
    eligibility: '10+2 with PCM (Min 60%)',
    totalFees: 500000,
    applicationFees: 1000,
    admissionMode: 'Offline',
    admissionStatus: 'Open',
    averagePackage: '₹ 8 LPA',
    highestPackage: '₹ 40 LPA',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mRes, cRes, uRes] = await Promise.all([
        api.get('/course-universities'),
        api.get('/courses?limit=100'),
        api.get('/universities?limit=100'),
      ]);
      setMappings(mRes.data.data || []);
      setCourses(cRes.data.data || []);
      setUniversities(uRes.data.data || []);

      if (cRes.data.data?.length > 0 && uRes.data.data?.length > 0) {
        setFormData((prev) => ({
          ...prev,
          course: cRes.data.data[0]._id,
          university: uRes.data.data[0]._id,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      course: courses[0]?._id || '',
      university: universities[0]?._id || '',
      specialization: 'General',
      duration: '4 Years',
      eligibility: '10+2 with PCM (Min 60%)',
      totalFees: 500000,
      applicationFees: 1000,
      admissionMode: 'Offline',
      admissionStatus: 'Open',
      averagePackage: '₹ 8.5 LPA',
      highestPackage: '₹ 45 LPA',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        course: formData.course,
        university: formData.university,
        specialization: formData.specialization,
        duration: formData.duration,
        eligibility: formData.eligibility,
        totalFees: Number(formData.totalFees),
        applicationFees: Number(formData.applicationFees),
        admissionMode: formData.admissionMode,
        admissionStatus: formData.admissionStatus,
        placementInfo: {
          averagePackage: formData.averagePackage,
          highestPackage: formData.highestPackage,
        },
      };

      if (editingId) {
        await api.put(`/course-universities/${editingId}`, payload);
        toast.success('Mapping updated');
      } else {
        await api.post('/course-universities', payload);
        toast.success('Course mapped to university successfully');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save mapping');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course-university mapping?')) return;
    try {
      await api.delete(`/course-universities/${id}`);
      setMappings(mappings.filter((m) => m._id !== id));
      toast.success('Mapping removed');
    } catch (err) {
      toast.error('Failed to delete mapping');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-brand-navy">Course-University Mapping Engine</h2>
          <p className="text-xs text-slate-500 mt-1">
            Map degrees to accredited universities with specific fees, specializations, and admission statuses.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-brand-royal hover:bg-brand-navy text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Course Mapping</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-brand-border text-slate-500 uppercase text-[10px] tracking-wider">
                <th className="p-4">Course</th>
                <th className="p-4">University</th>
                <th className="p-4">Specialization</th>
                <th className="p-4">Total Tuition</th>
                <th className="p-4">Admission Status</th>
                <th className="p-4">Mode</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Loading mappings...</td>
                </tr>
              ) : mappings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No mappings created yet.</td>
                </tr>
              ) : (
                mappings.map((m) => (
                  <tr key={m._id} className="hover:bg-brand-light/50 transition-colors">
                    <td className="p-4 font-bold text-brand-navy">{m.course?.name}</td>
                    <td className="p-4 text-brand-darkText">{m.university?.name}</td>
                    <td className="p-4 text-slate-600">{m.specialization || 'General'}</td>
                    <td className="p-4 font-extrabold text-brand-royal">
                      ₹ {(m.totalFees / 100000).toFixed(2)} Lakh
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                        {m.admissionStatus || 'Open'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{m.admissionMode || 'Offline'}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(m._id)}
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

      {/* Add Mapping Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-brand-border overflow-hidden animate-scaleUp">
            <div className="bg-brand-navy text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Map Course to University</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select University *</label>
                <select
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {universities.map((u) => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Degree Course *</label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Course Fee (INR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.totalFees}
                    onChange={(e) => setFormData({ ...formData, totalFees: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Application Fee (INR)</label>
                  <input
                    type="number"
                    value={formData.applicationFees}
                    onChange={(e) => setFormData({ ...formData, applicationFees: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admission Status</label>
                  <select
                    value={formData.admissionStatus}
                    onChange={(e) => setFormData({ ...formData, admissionStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Open">Open</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admission Mode</label>
                  <select
                    value={formData.admissionMode}
                    onChange={(e) => setFormData({ ...formData, admissionMode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-royal hover:bg-brand-navy text-white font-bold rounded-xl shadow transition-colors"
              >
                Save Course-University Mapping
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMappingsPage;
