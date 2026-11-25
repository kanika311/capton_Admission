import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Building2,
  FileText,
  FileCheck,
  Bell,
  LogOut,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  MessageSquare,
  CheckCircle2,
  Compass,
  Headphones,
  Award,
  BookOpen,
  ArrowUpRight,
  Check,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import EnquiryModal from '../components/common/EnquiryModal';
import { logout } from '../redux/slices/authSlice';
import { openEnquiryModal } from '../redux/slices/enquiryModalSlice';
import api from '../services/api';

const StudentLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState({
    applications: 0,
    shortlists: 0,
    documents: 0,
    notifications: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCounts = async () => {
      try {
        setLoadingStats(true);
        const [profRes, appRes, shortRes, notifRes] = await Promise.all([
          api.get('/students/profile').catch(() => ({ data: { data: {} } })),
          api.get('/applications').catch(() => ({ data: { data: [] } })),
          api.get('/students/shortlists').catch(() => ({ data: { data: [] } })),
          api.get('/students/notifications').catch(() => ({ data: { data: [] } })),
        ]);

        if (isMounted) {
          const docs = profRes.data?.data?.documents || [];
          const apps = appRes.data?.data || [];
          const shorts = shortRes.data?.data || [];
          const notifs = notifRes.data?.data || [];
          const unreadNotifs = notifs.filter((n) => !n.isRead).length;

          setStats({
            applications: apps.length,
            shortlists: shorts.length,
            documents: docs.length,
            notifications: unreadNotifs,
          });
        }
      } catch (err) {
        // graceful silence
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    };

    fetchCounts();
    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { label: 'Overview', to: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Profile & Education', to: '/student/profile', icon: User },
    { label: 'My Applications', to: '/student/applications', icon: FileText, badge: stats.applications },
    { label: 'Uploaded Documents', to: '/student/documents', icon: FileCheck, badge: stats.documents },
    { label: 'Shortlisted Colleges', to: '/student/shortlists', icon: Building2, badge: stats.shortlists },
    { label: 'Notifications', to: '/student/notifications', icon: Bell, badge: stats.notifications > 0 ? stats.notifications : null, isAlert: stats.notifications > 0 },
  ];

  const recommendedPrograms = [
    { name: 'B.Tech in Artificial Intelligence', slug: 'btech-ai-machine-learning', tag: 'High Package' },
    { name: 'Bachelor of Business Administration (BBA)', slug: 'bachelor-of-business-administration', tag: 'Top Management' },
    { name: 'B.Sc Nursing Healthcare', slug: 'bsc-nursing', tag: 'Clinical Care' },
    { name: 'BA LLB (Integrated Law)', slug: 'ba-llb-integrated', tag: 'Bar Council' },
  ];

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-slate-100/90 text-brand-darkText">
      {/* 1. Main Website Navbar at the very top */}
      <Navbar />

      {/* 2. Sleek Sub-Header / Dashboard Strip (Inside Website) */}
      <div className="bg-gradient-to-r from-brand-navy via-brand-royal to-blue-900 text-white border-b border-blue-950/20 px-4 sm:px-6 py-2.5 shrink-0 shadow-sm">
        <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-brand-gold border border-white/20">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white">
                  Student Admission Portal
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden md:block">
                Unified dashboard to track applications, upload verified documents, and consult your assigned advisor.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick 3-panel course discovery link */}
            <Link
              to="/courses"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-lg border border-white/15"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>3-Panel Course Discovery</span>
              <ArrowUpRight className="w-3 h-3 opacity-70" />
            </Link>

            {/* Counsellor Quick Contact */}
            <button
              onClick={() => dispatch(openEnquiryModal({}))}
              className="bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Request Callback</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Three-Panel Dashboard Body */}
      <div className="flex-1 overflow-hidden flex max-w-[1720px] w-full mx-auto px-3 sm:px-6 py-4 gap-4 sm:gap-5">
        {/* ========================================================= */}
        {/* LEFT PANEL: Fixed / Sticky Profile & Menu (~280px)        */}
        {/* ========================================================= */}
        <aside className="w-72 shrink-0 h-full overflow-y-auto space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] hidden md:block">
          {/* Card 1: Student Profile Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100"></div>

            <div className="relative z-10 pt-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-navy to-brand-royal text-white font-extrabold text-xl flex items-center justify-center uppercase shadow-md border-4 border-white mb-2">
                {user?.name ? user.name[0] : 'S'}
              </div>

              <h3 className="font-extrabold text-sm text-brand-navy truncate max-w-[220px]">
                {user?.name || 'Student Account'}
              </h3>
              <p className="text-[11px] text-slate-500 truncate max-w-[220px] font-medium">
                {user?.email}
              </p>

              <div className="mt-2 inline-flex items-center gap-1 bg-blue-50 text-brand-royal border border-blue-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-brand-royal" />
                <span>Verified Student</span>
              </div>

              {/* 3 Mini Stats Grid (Reference Style) */}
              <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                <Link
                  to="/student/applications"
                  className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors border border-slate-100"
                >
                  <span className="block text-sm font-extrabold text-brand-navy">
                    {stats.applications}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold block leading-tight">
                    Applications
                  </span>
                </Link>

                <Link
                  to="/student/shortlists"
                  className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 transition-colors border border-slate-100"
                >
                  <span className="block text-sm font-extrabold text-brand-gold">
                    {stats.shortlists}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold block leading-tight">
                    Shortlisted
                  </span>
                </Link>

                <Link
                  to="/student/documents"
                  className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors border border-slate-100"
                >
                  <span className="block text-sm font-extrabold text-emerald-600">
                    {stats.documents}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold block leading-tight">
                    Documents
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Portal Navigation Menu Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3 py-1.5 block">
              Portal Directory
            </span>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/student/dashboard'}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-brand-royal text-white font-bold shadow-sm'
                          : 'text-slate-700 hover:bg-slate-100/80 hover:text-brand-navy'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-royal'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.badge !== null && item.badge !== undefined && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : item.isAlert
                                  ? 'bg-red-500 text-white animate-pulse'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isActive ? 'text-white translate-x-0.5' : 'text-slate-300 opacity-60'
                            }`}
                          />
                        </div>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <div className="pt-2 mt-2 border-t border-slate-100 space-y-1">
              <Link
                to="/courses"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-brand-royal hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-brand-gold" />
                  <span>3-Panel Course Directory</span>
                </div>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </div>
              </button>
            </div>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* CENTER PANEL: Scrollable Active Content (Flex-1)          */}
        {/* ========================================================= */}
        <main className="flex-1 h-full overflow-y-auto min-w-0 pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Mobile Tab Pill Scroller (Visible on small screens) */}
          <div className="md:hidden mb-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto flex gap-1.5 shrink-0 [&::-webkit-scrollbar]:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/student/dashboard'}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                      isActive
                        ? 'bg-brand-royal text-white font-bold'
                        : 'bg-slate-100 text-slate-700'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Active Route Content */}
          <Outlet />
        </main>

        {/* ========================================================= */}
        {/* RIGHT PANEL: Fixed / Sticky Suggestions & Counsellor      */}
        {/* ========================================================= */}
        <aside className="w-80 shrink-0 h-full overflow-y-auto space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] hidden xl:block">
          {/* Widget 1: Assigned Senior Academic Counsellor (Reference Card) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Assigned Counsellor
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop"
                  alt="Dr. Rajesh Sharma"
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-brand-royal/20"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white">
                  ✓
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-brand-navy">
                  Dr. Rajesh Sharma
                </h4>
                <p className="text-[11px] text-brand-royal font-semibold">
                  Senior Academic Advisor
                </p>
                <p className="text-[10px] text-slate-500">
                  Engineering, Medical & Management
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              "Need advice choosing between colleges, understanding cutoffs, or verifying scholarship quotas? Connect directly with me."
            </p>

            {/* Direct Connect Buttons */}
            <div className="mt-3.5 space-y-2">
              <a
                href="https://wa.me/917895726762?text=Hi%20Dr.%20Rajesh,%20I%20am%20registered%20on%20CaptonAdmission%20and%20need%20guidance%20for%20my%20college%20admissions."
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs py-2 px-3 rounded-xl shadow-sm transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>

              <button
                onClick={() => dispatch(openEnquiryModal({}))}
                className="w-full flex items-center justify-center gap-2 bg-brand-royal hover:bg-brand-navy text-white font-bold text-xs py-2 px-3 rounded-xl shadow-sm transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5 text-brand-gold" />
                <span>Request Free Callback</span>
              </button>
            </div>
          </div>

          {/* Widget 2: Admissions Checklist Tracker */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <h4 className="font-bold text-xs text-brand-navy flex items-center justify-between mb-3">
              <span>Admission Roadmap</span>
              <Award className="w-3.5 h-3.5 text-brand-royal" />
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-[11px]">Student Account Created</p>
                  <p className="text-[10px] text-slate-400">Verified credentials active</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-brand-royal flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  2
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-[11px]">Upload Marksheets & IDs</p>
                  <p className="text-[10px] text-slate-400">Class 10, 12 and entrance cards</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  3
                </div>
                <div>
                  <p className="font-bold text-slate-700 text-[11px]">Shortlist Target Colleges</p>
                  <p className="text-[10px] text-slate-400">Compare verified fees and ROI</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  4
                </div>
                <div>
                  <p className="font-bold text-slate-700 text-[11px]">Direct Seat Confirmation</p>
                  <p className="text-[10px] text-slate-400">Counselling fee & allotment letter</p>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 3: High Demand Degrees (Quick Apply) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="font-bold text-xs text-brand-navy flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span>Trending Degrees</span>
              </h4>
              <Link to="/courses" className="text-[11px] font-bold text-brand-royal hover:underline">
                View All &rarr;
              </Link>
            </div>

            <div className="space-y-2">
              {recommendedPrograms.map((prog, idx) => (
                <Link
                  key={idx}
                  to={`/courses/${prog.slug}`}
                  className="block p-2 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 bg-blue-100 text-brand-royal rounded">
                      {prog.tag}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </div>
                  <h5 className="font-bold text-xs text-brand-navy mt-1 truncate">
                    {prog.name}
                  </h5>
                </Link>
              ))}
            </div>
          </div>

          {/* Widget 4: CaptonAdmission Helpdesk Card */}
          <div className="bg-gradient-to-br from-slate-900 to-brand-navy text-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Headphones className="w-4 h-4 text-brand-gold" />
              <h5 className="font-bold text-xs text-white">Student Helpdesk</h5>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Have questions about registration, documents, or counselling? Our advisors are available 10:00 AM – 7:00 PM.
            </p>
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="font-mono text-brand-gold font-bold">+91 78957 26762</span>
              <a
                href="tel:07895726762"
                className="text-[11px] text-white hover:underline font-semibold"
              >
                Call Now
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Global Interactive Enquiry Modal */}
      <EnquiryModal />
    </div>
  );
};

export default StudentLayout;
