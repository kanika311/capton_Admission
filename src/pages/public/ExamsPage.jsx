import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Building2,
  Sparkles,
  Share2,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Download,
  Award,
  TrendingUp,
  PhoneCall,
  ChevronRight,
  ShieldCheck,
  Layers,
  MapPin,
  Star,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
} from 'lucide-react';
import api from '../../services/api';
import { openEnquiryModal } from '../../redux/slices/enquiryModalSlice';
import toast from 'react-hot-toast';

const streamsList = [
  'All',
  'Engineering',
  'Medical',
  'Management',
  'Law',
  'Science / Arts / Commerce',
  'Design',
];

const levelsList = ['All', 'National', 'State', 'University'];

const streamBadgeColors = {
  Engineering: 'bg-blue-50 text-blue-700 border-blue-200',
  Medical: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Management: 'bg-purple-50 text-purple-700 border-purple-200',
  Law: 'bg-amber-50 text-amber-700 border-amber-200',
  'Science / Arts / Commerce': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Design: 'bg-rose-50 text-rose-700 border-rose-200',
};

const ExamsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const [exams, setExams] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active selection
  const [selectedExam, setSelectedExam] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [streamFilter, setStreamFilter] = useState(searchParams.get('stream') || 'All');
  const [levelFilter, setLevelFilter] = useState(searchParams.get('level') || 'All');

  // Mobile step switcher: 'list' | 'details' | 'colleges'
  const [mobileStep, setMobileStep] = useState('list');

  // Share menu state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch exams and universities
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [examRes, uniRes] = await Promise.all([
          api.get('/exams'),
          api.get('/universities?limit=50'),
        ]);

        const allExams = examRes.data.data || [];
        setExams(allExams);
        setUniversities(uniRes.data.data || []);

        // Pre-select exam if slug provided in URL, otherwise select the first
        const urlExamSlug = searchParams.get('exam');
        if (urlExamSlug) {
          const found = allExams.find((e) => e.slug === urlExamSlug);
          if (found) {
            setSelectedExam(found);
            return;
          }
        }
        if (allExams.length > 0) {
          setSelectedExam(allExams[0]);
        }
      } catch (err) {
        console.error('Error fetching exams discovery data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter exams based on search, stream, and level
  const filteredExams = useMemo(() => {
    return exams.filter((e) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        e.name.toLowerCase().includes(q) ||
        (e.conductingBody && e.conductingBody.toLowerCase().includes(q)) ||
        e.stream.toLowerCase().includes(q);

      const matchesStream =
        streamFilter === 'All' ||
        e.stream.toLowerCase().includes(streamFilter.toLowerCase()) ||
        e.stream === 'All Streams';

      const matchesLevel = levelFilter === 'All' || e.examLevel === levelFilter;

      return matchesSearch && matchesStream && matchesLevel;
    });
  }, [exams, search, streamFilter, levelFilter]);

  // Keep selected exam valid when filter changes
  useEffect(() => {
    if (filteredExams.length > 0) {
      if (!selectedExam || !filteredExams.some((e) => e._id === selectedExam._id)) {
        setSelectedExam(filteredExams[0]);
      }
    }
  }, [filteredExams, selectedExam]);

  // Handle selecting an exam
  const handleSelectExam = (exam) => {
    setSelectedExam(exam);
    setMobileStep('details');
    setSearchParams((prev) => {
      prev.set('exam', exam.slug);
      return prev;
    });
  };

  // WhatsApp Share Handler
  const handleWhatsAppShare = () => {
    if (!selectedExam) return;
    const shareUrl = `${window.location.origin}/exams?exam=${selectedExam.slug}`;
    const text = `Check out full exam pattern, eligibility & syllabus for *${selectedExam.name}* conducted by *${selectedExam.conductingBody || 'National Body'}* on CaptonAdmission: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    setIsShareOpen(false);
  };

  // Copy Link Handler
  const handleCopyLink = () => {
    if (!selectedExam) return;
    const shareUrl = `${window.location.origin}/exams?exam=${selectedExam.slug}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Exam share link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
    setIsShareOpen(false);
  };

  // Handle Counselling Assistance Click
  const handleCounselingClick = (exam = selectedExam) => {
    dispatch(
      openEnquiryModal({
        targetCourse: exam?.name || 'Entrance Examination Guidance',
        preferredCollege: exam?.conductingBody || '',
      })
    );
  };

  // Participating colleges matching this exam
  const acceptingColleges = useMemo(() => {
    if (!selectedExam) return universities.slice(0, 4);
    const names = selectedExam.participatingUniversities || [];
    const matched = universities.filter((u) =>
      names.some(
        (name) =>
          u.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(u.name.toLowerCase())
      )
    );
    return matched.length > 0 ? matched : universities.slice(0, 4);
  }, [selectedExam, universities]);

  // Related alternative exams in the same stream
  const relatedExams = useMemo(() => {
    if (!selectedExam) return [];
    return exams.filter((e) => e._id !== selectedExam._id && e.stream === selectedExam.stream).slice(0, 4);
  }, [selectedExam, exams]);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 overflow-hidden">
      {/* 1. TOP FIXED / STICKY SEARCH & ACTIONS BAR */}
      <div className="bg-white border-b border-brand-border px-4 lg:px-6 py-2.5 shrink-0 z-30 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand & Stats */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-royal/10 text-brand-royal flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-royal block leading-none">
                  Three-Panel Discovery
                </span>
                <h1 className="text-sm font-black text-slate-900 tracking-tight leading-snug">
                  Entrance Examinations
                </h1>
              </div>
            </div>

            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 shrink-0">
              <strong className="text-brand-navy font-extrabold">{filteredExams.length}</strong> Exams
            </span>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-2xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                placeholder="Search exam by name, stream, conducting agency..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
              />
            </div>

            {/* Stream Filter */}
            <select
              value={streamFilter}
              onChange={(e) => setStreamFilter(e.target.value)}
              className="py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal cursor-pointer shrink-0 max-w-[150px] truncate"
            >
              <option value="All">🎓 All Streams</option>
              {streamsList.filter((s) => s !== 'All').map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal cursor-pointer shrink-0"
            >
              <option value="All">🏛️ All Levels</option>
              {levelsList.filter((l) => l !== 'All').map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl} Level
                </option>
              ))}
            </select>
          </div>

          {/* Right Action: Share & Free Exam Guidance */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto relative">
            {/* Share Option Button */}
            <div className="relative">
              <button
                onClick={() => setIsShareOpen(!isShareOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                title="Share Exam Information"
              >
                <Share2 className="w-3.5 h-3.5 text-brand-royal" />
                <span>Share</span>
              </button>

              {/* Share Dropdown Menu */}
              {isShareOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-scaleUp">
                  <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-bold text-slate-500">
                    Share {selectedExam?.name || 'Exam'}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                    <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
                  </button>
                  <button
                    onClick={handleWhatsAppShare}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <span className="text-sm">💬</span>
                    <span>Share on WhatsApp</span>
                  </button>
                </div>
              )}
            </div>

            {/* Direct Free Exam Counselling */}
            <button
              onClick={() => handleCounselingClick()}
              className="px-4 py-2 bg-brand-royal hover:bg-brand-navy active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-brand-gold" />
              <span>Exam Guidance</span>
            </button>
          </div>
        </div>

        {/* Mobile Step Switcher Navigation (Small Screens only) */}
        <div className="md:hidden flex items-center justify-around mt-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setMobileStep('list')}
            className={`text-xs font-bold py-1.5 px-3 rounded-lg transition-colors ${
              mobileStep === 'list' ? 'bg-brand-royal text-white' : 'text-slate-600'
            }`}
          >
            1. Exams List ({filteredExams.length})
          </button>
          <button
            onClick={() => setMobileStep('details')}
            className={`text-xs font-bold py-1.5 px-3 rounded-lg transition-colors ${
              mobileStep === 'details' ? 'bg-brand-royal text-white' : 'text-slate-600'
            }`}
          >
            2. Exam Blueprint
          </button>
          <button
            onClick={() => setMobileStep('colleges')}
            className={`text-xs font-bold py-1.5 px-3 rounded-lg transition-colors ${
              mobileStep === 'colleges' ? 'bg-brand-royal text-white' : 'text-slate-600'
            }`}
          >
            3. Colleges & Cutoffs
          </button>
        </div>
      </div>

      {/* 2. MAIN THREE PANEL INTERACTIVE LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* =========================================================================
            PANEL 1 (LEFT): STICKY EXAM DIRECTORY & STREAM SWITCHER
            ========================================================================= */}
        <aside
          className={`w-full md:w-80 lg:w-96 border-r border-brand-border bg-white flex flex-col shrink-0 ${
            mobileStep === 'list' ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Quick Stream Badges Filter */}
          <div className="p-3 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-50/50">
            {streamsList.map((s) => (
              <button
                key={s}
                onClick={() => setStreamFilter(s)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  streamFilter === s
                    ? 'bg-brand-royal text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Exam Cards List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1.5 styled-scrollbar">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse bg-slate-100 h-24 rounded-xl border border-slate-200"></div>
                ))}
              </div>
            ) : filteredExams.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-semibold">No entrance exams found</p>
                <button
                  onClick={() => {
                    setSearch('');
                    setStreamFilter('All');
                    setLevelFilter('All');
                  }}
                  className="mt-2 text-xs font-bold text-brand-royal hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredExams.map((exam) => {
                const isSelected = selectedExam?._id === exam._id;
                const badgeStyle = streamBadgeColors[exam.stream] || 'bg-slate-100 text-slate-700 border-slate-200';

                return (
                  <div
                    key={exam._id}
                    onClick={() => handleSelectExam(exam)}
                    className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-blue-50/70 border-brand-royal shadow-sm ring-1 ring-brand-royal/20'
                        : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeStyle}`}>
                        {exam.stream}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {exam.examLevel}
                      </span>
                    </div>

                    <h3 className={`text-xs font-extrabold leading-snug line-clamp-1 ${
                      isSelected ? 'text-brand-royal' : 'text-brand-navy'
                    }`}>
                      {exam.name}
                    </h3>

                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {exam.conductingBody || 'National Agency'}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{exam.examPattern?.duration || '3 Hours'}</span>
                      </span>
                      <span className="text-brand-royal font-bold flex items-center gap-0.5">
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* =========================================================================
            PANEL 2 (CENTER): SCROLLABLE DETAILED EXAM BLUEPRINT
            ========================================================================= */}
        <main
          className={`flex-1 min-w-0 overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8 space-y-6 ${
            mobileStep === 'details' ? 'block' : 'hidden md:block'
          }`}
        >
          {selectedExam ? (
            <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
              {/* Top Hero Banner */}
              <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                        streamBadgeColors[selectedExam.stream] || 'bg-slate-100 text-slate-700'
                      }`}>
                        {selectedExam.stream}
                      </span>
                      <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                        {selectedExam.examLevel} Level
                      </span>
                      <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>{selectedExam.registrationStatus || 'Annual Examination'}</span>
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                      {selectedExam.name}
                    </h1>

                    <p className="text-xs sm:text-sm font-semibold text-slate-500">
                      Conducted By: <strong className="text-brand-navy">{selectedExam.conductingBody || 'National Agency'}</strong>
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                      {selectedExam.overview}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                    {selectedExam.website && (
                      <a
                        href={selectedExam.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-brand-royal" />
                        <span>Official Portal</span>
                      </a>
                    )}
                    <button
                      onClick={() => handleCounselingClick(selectedExam)}
                      className="px-4 py-2.5 bg-brand-royal hover:bg-brand-navy text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Free Exam Counselling</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Key Specs Metric Grid (6 Specs Cards) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                <div className="bg-white p-4 rounded-xl border border-brand-border shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Exam Mode</span>
                  <p className="text-xs sm:text-sm font-black text-brand-navy mt-0.5">
                    {selectedExam.examPattern?.mode || 'Computer Based Test (CBT)'}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-brand-border shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Test Duration</span>
                  <p className="text-xs sm:text-sm font-black text-brand-navy mt-0.5">
                    {selectedExam.examPattern?.duration || '3 Hours (180 mins)'}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-brand-border shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions & Marks</span>
                  <p className="text-xs sm:text-sm font-black text-brand-navy mt-0.5">
                    {selectedExam.examPattern?.totalQuestions || '100 Questions'}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-brand-border shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Marking Scheme</span>
                  <p className="text-xs sm:text-sm font-black text-emerald-700 mt-0.5">
                    {selectedExam.examPattern?.markingScheme || '+4 Correct / -1 Negative'}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-brand-border shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Application Fee</span>
                  <p className="text-xs sm:text-sm font-black text-brand-navy mt-0.5">
                    {selectedExam.applicationFee || '₹ 1,000 - ₹ 2,400'}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-brand-border shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Frequency / Language</span>
                  <p className="text-xs sm:text-sm font-black text-brand-navy mt-0.5">
                    Annual / English & Hindi
                  </p>
                </div>
              </div>

              {/* Important Dates Timeline */}
              <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Calendar className="w-4 h-4 text-brand-royal" />
                  <h3 className="text-sm font-bold text-brand-navy">Important Dates & Exam Schedule</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {(selectedExam.importantDates && selectedExam.importantDates.length > 0
                    ? selectedExam.importantDates
                    : [
                        { title: 'Information Notification', date: 'Announcement Month', description: 'Official notice released' },
                        { title: 'Application Closes', date: '4 Weeks post notice', description: 'Form submission deadline' },
                        { title: 'Admit Card Release', date: '10 Days prior', description: 'Download roll number' },
                        { title: 'Exam Date', date: 'Scheduled Date', description: 'Nationwide testing slots' },
                        { title: 'Result Declaration', date: '3 Weeks post exam', description: 'Scorecard & percentiles' },
                      ]
                  ).map((dateItem, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-royal block">
                          Milestone {idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-brand-navy mt-0.5">{dateItem.title}</h4>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/60">
                        <span className="text-xs font-black text-slate-800 block">{dateItem.date}</span>
                        {dateItem.description && (
                          <span className="text-[10px] text-slate-400 block mt-0.5">{dateItem.description}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility Criteria & Reservation */}
              <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-brand-royal" />
                  <h3 className="text-sm font-bold text-brand-navy">Eligibility Criteria & Qualifications</h3>
                </div>

                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
                  <h4 className="text-xs font-bold text-brand-navy">Academic Qualifications</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {selectedExam.eligibility || 'Candidates must have passed their qualifying examination with minimum prescribed aggregate percentage from an accredited board or recognized university.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Age Restrictions</span>
                    <strong className="text-slate-800 font-bold block mt-1">
                      As per standard regulatory guidelines (No upper age limit for most national level examinations).
                    </strong>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Category Concessions</span>
                    <strong className="text-slate-800 font-bold block mt-1">
                      5% marks relaxation and fee concessions applicable for OBC-NCL, SC, ST, and PwD categories.
                    </strong>
                  </div>
                </div>
              </div>

              {/* Syllabus & Core Domains */}
              <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Layers className="w-4 h-4 text-brand-royal" />
                  <h3 className="text-sm font-bold text-brand-navy">Exam Pattern & Syllabus Highlights</h3>
                </div>

                <div className="space-y-2.5">
                  {(selectedExam.syllabusTopics && selectedExam.syllabusTopics.length > 0
                    ? selectedExam.syllabusTopics
                    : [
                        'Section 1: Core Domain Fundamentals & Theoretical Principles',
                        'Section 2: Analytical Reasoning, Data Interpretation & Quantitative Applications',
                        'Section 3: Verbal Comprehension, Subject Terminology & Problem Solving',
                      ]
                  ).map((topic, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-brand-royal shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-800">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preparation Advice Banner */}
              <div className="bg-gradient-to-r from-brand-royal to-brand-navy rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-base font-bold">Confused about cutoff scores or form filling?</h4>
                  <p className="text-xs text-blue-100 max-w-xl">
                    Connect with senior educational advisors who specialize in {selectedExam.name} score counseling and university seat allotment.
                  </p>
                </div>
                <button
                  onClick={() => handleCounselingClick(selectedExam)}
                  className="px-5 py-2.5 bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-black text-xs rounded-xl shadow-lg shrink-0 cursor-pointer"
                >
                  Talk to Counsellor
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-center text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-600">Select an exam from the left panel</p>
            </div>
          )}
        </main>

        {/* =========================================================================
            PANEL 3 (RIGHT): STICKY PARTICIPATING COLLEGES, CUTOFFS & QUICK ACTIONS
            ========================================================================= */}
        <aside
          className={`w-full md:w-80 lg:w-96 border-l border-brand-border bg-white flex flex-col shrink-0 overflow-y-auto styled-scrollbar ${
            mobileStep === 'colleges' ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-brand-border flex items-center justify-between bg-slate-50/50">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-royal block">
                Colleges & Cutoffs
              </span>
              <h3 className="text-xs font-extrabold text-brand-navy">
                Accepting Institutions
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
              {acceptingColleges.length} Colleges
            </span>
          </div>

          <div className="p-4 space-y-5">
            {/* Participating Colleges List */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Top Participating Universities
              </h4>

              {acceptingColleges.map((uni) => (
                <div
                  key={uni._id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-brand-royal/50 hover:bg-blue-50/30 transition-all space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="text-xs font-bold text-brand-navy group-hover:text-brand-royal transition-colors line-clamp-1">
                        {uni.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{uni.location?.city}, {uni.location?.state}</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{uni.rating || 4.7}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-100">
                    <span className="font-semibold text-slate-600">
                      Avg: <strong className="text-emerald-700">{uni.placementOverview?.averagePackage || '₹ 12 LPA'}</strong>
                    </span>
                    <Link
                      to={`/universities/${uni.slug}`}
                      className="text-brand-royal hover:underline font-bold flex items-center gap-0.5"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Related Alternative Exams in this Stream */}
            {relatedExams.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Alternative Exams in {selectedExam?.stream}
                </h4>

                <div className="space-y-2">
                  {relatedExams.map((re) => (
                    <div
                      key={re._id}
                      onClick={() => handleSelectExam(re)}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-brand-royal border border-slate-200/70 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <h6 className="text-xs font-bold text-brand-navy truncate">{re.name}</h6>
                        <span className="text-[10px] text-slate-400 block">{re.conductingBody || 'National Body'}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick 1-Click WhatsApp Share Card */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-800">
                <span className="text-base">💬</span>
                <h4 className="text-xs font-bold">Share with Study Group</h4>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Send {selectedExam?.name} syllabus, eligibility, and dates directly to friends or mentors on WhatsApp.
              </p>
              <button
                onClick={handleWhatsAppShare}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Share via WhatsApp</span>
                <Share2 className="w-3 h-3" />
              </button>
            </div>

            {/* Free Counselling Box */}
            <div className="p-4 rounded-xl bg-brand-light border border-brand-border space-y-2.5">
              <div className="flex items-center gap-2 text-brand-navy">
                <GraduationCap className="w-4 h-4 text-brand-royal" />
                <h4 className="text-xs font-bold">Free Admissions Mentorship</h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Get 100% verified cutoff predictions and scholarship assistance for top colleges.
              </p>
              <button
                onClick={() => handleCounselingClick(selectedExam)}
                className="w-full py-2 bg-brand-royal hover:bg-brand-navy text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Connect with Expert
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ExamsPage;
