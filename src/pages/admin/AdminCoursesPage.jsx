import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  GraduationCap,
  ArrowLeft,
  Save,
  BookOpen,
  DollarSign,
  Sparkles,
  Layers,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  // View state: 'list' | 'editor'
  const [viewMode, setViewMode] = useState('list');
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
    setViewMode('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setViewMode('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setViewMode('list');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter course name');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: formData.name.trim(),
        category: formData.category || categories[0]?._id,
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

      setViewMode('list');
      setEditingId(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save course');
    } finally {
      setSaving(false);
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

  // FULL PAGE EDITOR VIEW
  if (viewMode === 'editor') {
    return (
      <div className="space-y-6 animate-fadeIn pb-12">
        {/* Header with Navigation & Primary Action Buttons */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToList}
              type="button"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Back to course catalog"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Course Catalog /</span>
                <span className="text-xs font-bold text-brand-royal uppercase tracking-wider">
                  {editingId ? 'Edit Mode' : 'New Degree Program'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight mt-0.5">
                {editingId ? `Edit: ${formData.name || 'Course'}` : 'Add New Course'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBackToList}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="courseForm"
              disabled={saving}
              className="px-6 py-2.5 bg-brand-royal hover:bg-brand-navy active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : editingId ? 'Update Course' : 'Create Course'}</span>
            </button>
          </div>
        </div>

        {/* The Course Editor Form */}
        <form id="courseForm" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column (8 cols): Academic Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* General Info Card */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <BookOpen className="w-4 h-4 text-brand-royal" />
                <h3 className="text-sm font-bold text-brand-navy">Program Details</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech in Computer Science & Engineering"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Specializations (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Artificial Intelligence, Data Science, Cybersecurity, Cloud Computing"
                  value={formData.specializations}
                  onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Separate multiple stream concentrations with commas.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Overview & Scope <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Comprehensive degree program providing rigorous foundations in computer architecture, algorithmic engineering, software development, and artificial intelligence..."
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all resize-y"
                ></textarea>
              </div>
            </div>

            {/* Admission & Eligibility Card */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <GraduationCap className="w-4 h-4 text-brand-royal" />
                <h3 className="text-sm font-bold text-brand-navy">Eligibility & Academic Requirements</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Minimum Eligibility Criteria <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. 10+2 with Physics, Mathematics & Chemistry (Min 60% aggregate)"
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all resize-y"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Sidebar Column (4 cols): Classification & Tuition */}
          <div className="lg:col-span-4 space-y-6">
            {/* Stream & Category Card */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Layers className="w-4 h-4 text-brand-royal" />
                <h3 className="text-sm font-bold text-brand-navy">Classification</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Stream Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Degree Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
                >
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Doctoral">Doctoral</option>
                  <option value="Certificate">Certificate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Program Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 4 Years"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
                />
              </div>
            </div>

            {/* Tuition Fees Card */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <DollarSign className="w-4 h-4 text-brand-royal" />
                <h3 className="text-sm font-bold text-brand-navy">Tuition & Fee Range</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Min Avg Fee (₹)</label>
                  <input
                    type="number"
                    value={formData.averageFeeMin}
                    onChange={(e) => setFormData({ ...formData, averageFeeMin: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Avg Fee (₹)</label>
                  <input
                    type="number"
                    value={formData.averageFeeMax}
                    onChange={(e) => setFormData({ ...formData, averageFeeMax: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                  />
                </div>
              </div>
            </div>

            {/* Visibility & Publishing Card */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <h3 className="text-sm font-bold text-brand-navy">Promotions & Visibility</h3>
              </div>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-brand-royal rounded border-slate-300 focus:ring-brand-royal"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Feature this course on homepage
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Highlighted prominently under the Featured Courses carousel.
                  </span>
                </div>
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-brand-royal hover:bg-brand-navy active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Changes...' : editingId ? 'Update Course' : 'Create Course'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // DEFAULT LIST VIEW
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
          className="px-4 py-2.5 bg-brand-royal hover:bg-brand-navy text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 shrink-0 cursor-pointer transition-all"
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
                      ₹ {((course.averageFeeRange?.min || 0) / 1000).toFixed(0)}k - {((course.averageFeeRange?.max || 0) / 1000).toFixed(0)}k
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(course)}
                        className="p-1.5 text-slate-500 hover:text-brand-royal rounded hover:bg-slate-100 cursor-pointer"
                        title="Edit Course in dedicated page"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                        title="Delete Course"
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
    </div>
  );
};

export default AdminCoursesPage;
