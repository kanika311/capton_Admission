import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Check, X, GraduationCap } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: 'Undergraduate',
    duration: '4 Years',
    eligibility: '',
    overview: '',
    specializations: '',
    averageFeeMin: 80000,
    averageFeeMax: 300000,
    isFeatured: false,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cRes, catRes] = await Promise.all([
        api.get(`/courses?limit=100&search=${encodeURIComponent(search)}`),
        api.get('/courses/categories'),
      ]);
      setCourses(cRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: categories[0]?._id || '',
      level: 'Undergraduate',
      duration: '4 Years',
      eligibility: '10+2 with relevant subjects (Min 50%)',
      overview: '',
      specializations: '',
      averageFeeMin: 80000,
      averageFeeMax: 300000,
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingId(course._id);
    setFormData({
      name: course.name,
      category: course.category?._id || course.category,
      level: course.level,
      duration: course.duration,
      eligibility: course.eligibility,
      overview: course.overview,
      specializations: (course.specializations || []).join(', '),
      averageFeeMin: course.averageFeeRange?.min || 80000,
      averageFeeMax: course.averageFeeRange?.max || 300000,
      isFeatured: course.isFeatured || false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        level: formData.level,
        duration: formData.duration,
        eligibility: formData.eligibility,
        overview: formData.overview,
        specializations: formData.specializations
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        averageFeeRange: {
          min: Number(formData.averageFeeMin),
          max: Number(formData.averageFeeMax),
          currency: 'INR',
        },
        isFeatured: formData.isFeatured,
      };

      if (editingId) {
        await api.put(`/courses/${editingId}`, payload);
        toast.success('Course updated successfully');
      } else {
        await api.post('/courses', payload);
        toast.success('Course created successfully');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save course');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter((c) => c._id !== id));
      toast.success('Course deleted');
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-brand-navy">Course Catalog Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, update, and manage all degree programs and streams.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-brand-royal hover:bg-brand-navy text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-brand-border flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter courses by name or stream..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs focus:outline-none"
        />
      </div>

      {/* Courses Data Table */}
      <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-brand-border text-slate-500 uppercase text-[10px] tracking-wider">
                <th className="p-4">Degree Name</th>
                <th className="p-4">Stream / Category</th>
                <th className="p-4">Level</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Avg Annual Fees</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Loading courses...
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No courses found.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course._id} className="hover:bg-brand-light/50 transition-colors">
                    <td className="p-4 font-bold text-brand-navy max-w-xs">
                      {course.name}
                      {course.isFeatured && (
                        <span className="ml-2 text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-extrabold uppercase">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-600">
                      {course.category?.name || 'General'}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-brand-royal font-semibold text-[11px]">
                        {course.level}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{course.duration}</td>
                    <td className="p-4 font-semibold text-brand-darkText">
                      ₹ {(course.averageFeeRange?.min / 1000).toFixed(0)}k - {(course.averageFeeRange?.max / 1000).toFixed(0)}k
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(course)}
                        className="p-1.5 text-slate-500 hover:text-brand-royal rounded hover:bg-slate-100"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
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

      {/* Add / Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-brand-border overflow-hidden animate-scaleUp">
            <div className="bg-brand-navy text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingId ? 'Edit Course Details' : 'Add New Course'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech in Artificial Intelligence"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-royal focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Level *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Doctoral">Doctoral</option>
                    <option value="Certificate">Certificate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    placeholder="4 Years"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Eligibility *</label>
                  <input
                    type="text"
                    required
                    placeholder="10+2 with PCM"
                    value={formData.eligibility}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specializations (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Machine Learning, Cloud Computing, Cyber Security"
                  value={formData.specializations}
                  onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Avg Fee (INR)</label>
                  <input
                    type="number"
                    value={formData.averageFeeMin}
                    onChange={(e) => setFormData({ ...formData, averageFeeMin: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Avg Fee (INR)</label>
                  <input
                    type="number"
                    value={formData.averageFeeMax}
                    onChange={(e) => setFormData({ ...formData, averageFeeMax: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Overview *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summary of course scope and opportunities..."
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-brand-royal"
                />
                <label htmlFor="featuredCheck" className="font-semibold text-slate-700">
                  Feature this course on homepage
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-royal hover:bg-brand-navy text-white font-bold rounded-xl shadow transition-colors"
              >
                {editingId ? 'Update Course' : 'Create Course'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoursesPage;
