import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Building2,
  MapPin,
  ArrowLeft,
  Save,
  Globe,
  Award,
  TrendingUp,
  Sparkles,
  FileText,
  GraduationCap,
  Download,
  ExternalLink,
  CheckCircle,
  BookOpen,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminUniversitiesPage = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  // View state: 'list' | 'editor'
  const [viewMode, setViewMode] = useState('list');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    universityType: 'Private',
    establishedYear: 2000,
    website: '',
    brochureUrl: '',
    rating: 4.5,
    accreditation: 'NAAC A++, NIRF Ranked',
    about: '',
    averagePackage: '₹ 8.5 LPA',
    highestPackage: '₹ 45 LPA',
    isFeatured: false,
  });

  // University Courses Offered State
  const [universityCourses, setUniversityCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [mappingModalOpen, setMappingModalOpen] = useState(false);
  const [savingMapping, setSavingMapping] = useState(false);
  const [mappingForm, setMappingForm] = useState({
    course: '',
    specialization: 'General',
    duration: '4 Years',
    eligibility: '10+2 with minimum 60% aggregate',
    totalFees: 500000,
    applicationFees: 1200,
    admissionStatus: 'Open',
    brochureUrl: '',
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

  const fetchAvailableCourses = async () => {
    try {
      const res = await api.get('/courses?limit=100');
      const list = res.data.data || [];
      setAvailableCourses(list);
      if (list.length > 0 && !mappingForm.course) {
        setMappingForm((prev) => ({ ...prev, course: list[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load courses for mapping:', err);
    }
  };

  const fetchUniversityCourses = async (uniId) => {
    try {
      setLoadingCourses(true);
      const res = await api.get(`/course-universities?universityId=${uniId}`);
      setUniversityCourses(res.data.data || []);
    } catch (err) {
      console.error('Failed to load university courses:', err);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
    fetchAvailableCourses();
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
      brochureUrl: '',
      rating: 4.5,
      accreditation: 'NAAC A++, NIRF Ranked',
      about: '',
      averagePackage: '₹ 8.5 LPA',
      highestPackage: '₹ 45 LPA',
      isFeatured: false,
    });
    setUniversityCourses([]);
    setViewMode('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      brochureUrl: uni.brochureUrl || uni.brochure || '',
      rating: uni.rating || 4.5,
      accreditation: (uni.accreditation || []).join(', '),
      about: uni.about || '',
      averagePackage: uni.placementOverview?.averagePackage || '',
      highestPackage: uni.placementOverview?.highestPackage || '',
      isFeatured: uni.isFeatured || false,
    });
    fetchUniversityCourses(uni._id);
    setViewMode('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setViewMode('list');
    setEditingId(null);
  };

  // Add course to this university
  const handleOpenAddCourse = () => {
    setMappingForm({
      course: availableCourses[0]?._id || '',
      specialization: 'General',
      duration: '4 Years',
      eligibility: '10+2 with minimum 60% aggregate',
      totalFees: 500000,
      applicationFees: 1200,
      admissionStatus: 'Open',
      brochureUrl: formData.brochureUrl || '',
    });
    setMappingModalOpen(true);
  };

  const handleSaveCourseMapping = async (e) => {
    e.preventDefault();
    if (!editingId) {
      toast.error('Please save the university first before adding courses.');
      return;
    }
    if (!mappingForm.course) {
      toast.error('Please select a course to map');
      return;
    }

    try {
      setSavingMapping(true);
      const payload = {
        course: mappingForm.course,
        university: editingId,
        specialization: mappingForm.specialization || 'General',
        duration: mappingForm.duration || '4 Years',
        eligibility: mappingForm.eligibility || '10+2 with minimum 60% aggregate',
        totalFees: Number(mappingForm.totalFees),
        applicationFees: Number(mappingForm.applicationFees) || 1000,
        admissionStatus: mappingForm.admissionStatus || 'Open',
        brochureUrl: mappingForm.brochureUrl || formData.brochureUrl || '',
        brochure: mappingForm.brochureUrl || formData.brochureUrl || '',
      };

      await api.post('/course-universities', payload);
      toast.success('Course linked to this university successfully!');
      setMappingModalOpen(false);
      fetchUniversityCourses(editingId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to link course to university');
    } finally {
      setSavingMapping(false);
    }
  };

  const handleDeleteCourseMapping = async (mappingId) => {
    if (!window.confirm('Are you sure you want to unlink this course from the university?')) return;
    try {
      await api.delete(`/course-universities/${mappingId}`);
      toast.success('Course removed from this university');
      setUniversityCourses((prev) => prev.filter((m) => m._id !== mappingId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove course');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter university name');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: formData.name.trim(),
        location: {
          city: formData.city,
          state: formData.state,
          country: 'India',
        },
        universityType: formData.universityType,
        establishedYear: Number(formData.establishedYear),
        website: formData.website,
        brochureUrl: formData.brochureUrl,
        brochure: formData.brochureUrl,
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

      setViewMode('list');
      setEditingId(null);
      fetchUniversities();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save university');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this university?')) return;
    try {
      await api.delete(`/universities/${id}`);
      setUniversities((prev) => prev.filter((u) => u._id !== id));
      toast.success('University removed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete university');
    }
  };

  // FULL PAGE UNIVERSITY EDITOR VIEW
  if (viewMode === 'editor') {
    return (
      <div className="space-y-6 animate-fadeIn pb-12">
        {/* Top Header Bar */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToList}
              type="button"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Back to universities list"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Universities /</span>
                <span className="text-xs font-bold text-brand-royal uppercase tracking-wider">
                  {editingId ? 'Edit Campus Profile' : 'New Institution'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight mt-0.5">
                {editingId ? `Edit: ${formData.name || 'University'}` : 'Add New University'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBackToList}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="uniForm"
              disabled={saving}
              className="px-6 py-2.5 bg-brand-royal hover:bg-brand-navy active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : editingId ? 'Update University' : 'Create University'}</span>
            </button>
          </div>
        </div>

        {/* The University Editor Form */}
        <form id="uniForm" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column (8 cols): Campus Info */}
          <div className="lg:col-span-8 space-y-6">
            {/* Campus Identity */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Building2 className="w-4 h-4 text-brand-royal" />
                <h3 className="text-sm font-bold text-brand-navy">Institution Overview</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  University / College Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delhi Technological University (DTU)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Delhi"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Delhi"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Official Website URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    placeholder="https://www.dtu.ac.in"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
                  />
                </div>
              </div>

              {/* Official Campus Brochure URL */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-brand-royal" />
                    <span>Official Brochure / Prospectus URL (PDF Link)</span>
                  </label>
                  {formData.brochureUrl && (
                    <a
                      href={formData.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-bold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Test / View Brochure</span>
                    </a>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Download className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    placeholder="https://example.com/brochures/dtu-official-prospectus.pdf"
                    value={formData.brochureUrl}
                    onChange={(e) => setFormData({ ...formData, brochureUrl: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Students can download this official brochure directly while selecting this university and its courses.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  About University & Campus Highlights <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Campus history, academic excellence, accreditation badges, and research infrastructure..."
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all resize-y"
                ></textarea>
              </div>
            </div>

            {/* Accreditations & Badges */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Award className="w-4 h-4 text-brand-royal" />
                <h3 className="text-sm font-bold text-brand-navy">Accreditations & Recognitions</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Accreditations (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. NAAC A++, NIRF Ranked #29, AICTE Approved, UGC Recognized"
                  value={formData.accreditation}
                  onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
                />
              </div>
            </div>

            {/* Degree Programs Offered by this Campus */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-royal/10 text-brand-royal flex items-center justify-center font-bold">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-navy">Courses Offered by this Institution</h3>
                    <p className="text-xs text-slate-400">
                      Manage programs, specializations, tuition fees, and course-specific brochures
                    </p>
                  </div>
                </div>

                {editingId ? (
                  <button
                    type="button"
                    onClick={handleOpenAddCourse}
                    className="px-3.5 py-2 bg-brand-royal hover:bg-brand-navy text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Map / Add Course</span>
                  </button>
                ) : (
                  <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-semibold">
                    Save university profile first to link courses
                  </span>
                )}
              </div>

              {loadingCourses ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  <div className="animate-spin w-5 h-5 border-2 border-brand-royal border-t-transparent rounded-full mx-auto mb-2"></div>
                  Loading offered courses...
                </div>
              ) : universityCourses.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                  <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">No courses mapped to this university yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click &ldquo;Map / Add Course&rdquo; above to select which degrees this campus offers.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {universityCourses.map((cu) => {
                    const c = cu.course;
                    return (
                      <div key={cu._id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2.5 rounded-xl transition-colors">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-brand-royal rounded-md">
                              {c?.level || 'Undergraduate'}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                              {cu.specialization || 'General'}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                              Status: {cu.admissionStatus || 'Open'}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                            {c?.name || 'Course Name'}
                          </h4>
                          <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-1 flex-wrap">
                            <span>Duration: <strong>{cu.duration || c?.duration || '4 Years'}</strong></span>
                            <span>Total Fees: <strong className="text-emerald-700">₹ {(Number(cu.totalFees || 0) / 100000).toFixed(2)} Lakh</strong></span>
                            <span>Eligibility: <strong>{cu.eligibility || c?.eligibility || '10+2'}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {cu.brochureUrl && (
                            <a
                              href={cu.brochureUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 text-slate-600 hover:text-brand-royal hover:bg-blue-50 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="Download Course Brochure"
                            >
                              <FileText className="w-3.5 h-3.5 text-brand-royal" />
                              <span>Brochure</span>
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteCourseMapping(cu._id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Unlink course from this campus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column (4 cols): Classification & Placements */}
          <div className="lg:col-span-4 space-y-6">
            {/* Classification */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Building2 className="w-4 h-4 text-brand-royal" />
                <h3 className="text-sm font-bold text-brand-navy">Campus Classification</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Institution Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.universityType}
                  onChange={(e) => setFormData({ ...formData, universityType: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
                >
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                  <option value="Deemed">Deemed</option>
                  <option value="Autonomous">Autonomous</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Est. Year</label>
                  <input
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                  />
                </div>
              </div>
            </div>

            {/* Placement Records */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-brand-navy">Placement Statistics</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Average Package</label>
                <input
                  type="text"
                  placeholder="e.g. ₹ 15.6 LPA"
                  value={formData.averagePackage}
                  onChange={(e) => setFormData({ ...formData, averagePackage: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Highest Package</label>
                <input
                  type="text"
                  placeholder="e.g. ₹ 1.2 CPA"
                  value={formData.highestPackage}
                  onChange={(e) => setFormData({ ...formData, highestPackage: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                />
              </div>
            </div>

            {/* Visibility Card */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <h3 className="text-sm font-bold text-brand-navy">Promotions & Visibility</h3>
              </div>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  id="uniFeaturedCheck"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-brand-royal rounded border-slate-300 focus:ring-brand-royal"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Feature on Homepage
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Showcases in the Top Universities & Accredited Colleges carousel.
                  </span>
                </div>
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-brand-royal hover:bg-brand-navy active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : editingId ? 'Update University' : 'Create University'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Modal to Link/Add Course to this University */}
        {mappingModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-royal/10 text-brand-royal flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-brand-navy">Add Course to Campus</h3>
                    <p className="text-xs text-slate-400">{formData.name || 'University'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMappingModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCourseMapping} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Degree / Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={mappingForm.course}
                    onChange={(e) => setMappingForm({ ...mappingForm, course: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                  >
                    {availableCourses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Specialization</label>
                    <input
                      type="text"
                      placeholder="e.g. Artificial Intelligence"
                      value={mappingForm.specialization}
                      onChange={(e) => setMappingForm({ ...mappingForm, specialization: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 4 Years"
                      value={mappingForm.duration}
                      onChange={(e) => setMappingForm({ ...mappingForm, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Total Course Fee (INR) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 500000"
                      value={mappingForm.totalFees}
                      onChange={(e) => setMappingForm({ ...mappingForm, totalFees: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Admission Status</label>
                    <select
                      value={mappingForm.admissionStatus}
                      onChange={(e) => setMappingForm({ ...mappingForm, admissionStatus: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                    >
                      <option value="Open">Open</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Eligibility Criteria</label>
                  <input
                    type="text"
                    placeholder="e.g. 10+2 with PCM (Min 60%) + JEE Main"
                    value={mappingForm.eligibility}
                    onChange={(e) => setMappingForm({ ...mappingForm, eligibility: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Course Brochure / Syllabus URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/syllabus/btech-ai.pdf"
                    value={mappingForm.brochureUrl}
                    onChange={(e) => setMappingForm({ ...mappingForm, brochureUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setMappingModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingMapping}
                    className="px-5 py-2 bg-brand-royal hover:bg-brand-navy text-white rounded-xl text-xs font-bold transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {savingMapping ? 'Linking...' : 'Link Course to Campus'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // DEFAULT LIST VIEW
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
          className="px-4 py-2.5 bg-brand-royal hover:bg-brand-navy text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 shrink-0 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add University</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-3 rounded-2xl border border-brand-border flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter by university name, city or state..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs focus:outline-none"
        />
      </div>

      {/* Universities Table */}
      <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-brand-border text-slate-500 uppercase text-[10px] tracking-wider">
                <th className="p-4">Campus / Institution</th>
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
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Loading universities...
                  </td>
                </tr>
              ) : universities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No universities found.
                  </td>
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
                        className="p-1.5 text-slate-500 hover:text-brand-royal rounded hover:bg-slate-100 cursor-pointer"
                        title="Edit University Profile in dedicated page"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(uni._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                        title="Delete University"
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

export default AdminUniversitiesPage;
