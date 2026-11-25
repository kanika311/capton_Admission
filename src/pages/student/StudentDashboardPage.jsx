import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FileText,
  Building2,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  UserCheck,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';

const StudentDashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [shortlists, setShortlists] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [profRes, appRes, shortRes, notifRes] = await Promise.all([
          api.get('/students/profile'),
          api.get('/applications'),
          api.get('/students/shortlists'),
          api.get('/students/notifications'),
        ]);

        setProfile(profRes.data.data);
        setApplications(appRes.data.data || []);
        setShortlists(shortRes.data.data || []);
        setNotifications((notifRes.data.data || []).slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const completionPct = profile?.completionPercentage || 60;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-royal text-white rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[10px] font-extrabold text-brand-gold uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
            Student Overview
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1.5">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
          </h2>
          <p className="text-slate-200 text-xs mt-1 leading-relaxed">
            Monitor your college applications, explore course eligibility, and check counsellor follow-up updates in real time.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <Link
              to="/courses"
              className="bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-bold px-3.5 py-1.5 rounded-xl text-xs shadow transition-all flex items-center gap-1.5"
            >
              <span>Explore More Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/student/profile"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-3.5 py-1.5 rounded-xl text-xs transition-all"
            >
              Complete My Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Completion Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5 text-xs font-bold">
            <span className="text-brand-navy">Profile Readiness</span>
            <span className="text-brand-royal font-extrabold">{completionPct}% Completed</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-royal h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            ></div>
          </div>
        </div>

        <Link
          to="/student/profile"
          className="text-xs font-bold text-brand-royal hover:underline shrink-0"
        >
          Update Academic Details &rarr;
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-royal flex items-center justify-center mb-2">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
            Submitted Applications
          </span>
          <strong className="text-xl font-extrabold text-brand-navy mt-0.5 block">
            {applications.length}
          </strong>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-brand-gold flex items-center justify-center mb-2">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
            Shortlisted Colleges
          </span>
          <strong className="text-xl font-extrabold text-brand-navy mt-0.5 block">
            {shortlists.length}
          </strong>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <FileCheck className="w-4 h-4" />
          </div>
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
            Uploaded Documents
          </span>
          <strong className="text-xl font-extrabold text-brand-navy mt-0.5 block">
            {profile?.documents?.length || 0}
          </strong>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
            <UserCheck className="w-4 h-4" />
          </div>
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
            Assigned Counsellor
          </span>
          <strong className="text-xs font-bold text-brand-navy mt-1.5 block truncate">
            Dr. Rajesh Sharma
          </strong>
        </div>
      </div>

      {/* Recent Applications & Updates */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Applications table (7 cols) */}
        <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-sm text-brand-navy">
              Recent Applications
            </h3>
            <Link
              to="/student/applications"
              className="text-xs font-bold text-brand-royal hover:underline"
            >
              View All &rarr;
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              You haven't submitted any university applications yet.
              <div className="mt-3">
                <Link
                  to="/courses"
                  className="px-4 py-2 bg-brand-royal text-white rounded-lg font-bold text-xs"
                >
                  Explore Courses & Apply
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 4).map((app) => (
                <div
                  key={app._id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={app.university?.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=50&h=50&fit=crop'}
                      alt={app.university?.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-brand-navy">{app.university?.name}</h4>
                      <p className="text-slate-500 font-medium">
                        {app.course?.name} ({app.specialization})
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {app.applicationNumber}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                        app.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Under Review'
                          ? 'bg-blue-100 text-brand-royal'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.status}
                    </span>
                    <Link
                      to="/student/applications"
                      className="block text-[11px] text-brand-royal hover:underline font-semibold mt-1"
                    >
                      View Timeline &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications & Announcements (5 cols) */}
        <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <h3 className="font-bold text-sm text-brand-navy border-b border-slate-100 pb-2.5">
            Recent Notifications
          </h3>

          {notifications.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No new alerts or messages.
            </p>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n._id} className="p-3 rounded-xl bg-brand-light border border-brand-border text-xs">
                  <h5 className="font-bold text-brand-navy">{n.title}</h5>
                  <p className="text-slate-600 text-[11px] mt-1">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
