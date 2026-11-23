import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  Building2,
  FileText,
  PhoneCall,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '../../services/api';

const COLORS = ['#1746A2', '#E5A900', '#10b981', '#6366f1', '#f59e0b', '#ef4444'];

const AdminDashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching dashboard analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-royal mx-auto"></div>
        <p className="text-xs text-slate-400 mt-3">Aggregating live platform metrics...</p>
      </div>
    );
  }

  const s = stats?.stats || {};
  const monthlyTrend = stats?.monthlyTrend || [];
  const appStatuses = (stats?.applicationStatuses || []).map((item) => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl font-extrabold text-brand-navy">Platform Overview & Analytics</h2>
        <p className="text-xs text-slate-500 mt-1">
          Real-time aggregated admissions, student leads, and university catalog performance.
        </p>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-card">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-royal flex items-center justify-center mb-2">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Students
          </span>
          <strong className="text-xl font-extrabold text-brand-navy mt-1 block">
            {s.totalStudents ?? 0}
          </strong>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-card">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-brand-gold flex items-center justify-center mb-2">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Universities
          </span>
          <strong className="text-xl font-extrabold text-brand-navy mt-1 block">
            {s.totalUniversities ?? 0}
          </strong>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-card">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Courses
          </span>
          <strong className="text-xl font-extrabold text-brand-navy mt-1 block">
            {s.totalCourses ?? 0}
          </strong>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-card">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Applications
          </span>
          <strong className="text-xl font-extrabold text-brand-navy mt-1 block">
            {s.totalApplications ?? 0}
          </strong>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-card">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
            <PhoneCall className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Student Leads
          </span>
          <strong className="text-xl font-extrabold text-brand-navy mt-1 block">
            {s.totalEnquiries ?? 0}
          </strong>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-card">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Counselling Done
          </span>
          <strong className="text-xl font-extrabold text-brand-navy mt-1 block">
            {s.totalCounselling ?? 0}
          </strong>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Trend Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-brand-border shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-brand-navy">
                Monthly Admissions & Application Volume
              </h3>
              <p className="text-xs text-slate-500">Student enrollment flow over the last 6 months</p>
            </div>
            <span className="text-xs font-bold text-brand-royal bg-blue-50 px-2.5 py-1 rounded-md">
              Live Aggregate
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#102B59',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="applications" fill="#1746A2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Status Breakdown Pie Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-brand-border shadow-card space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-brand-navy">Application Status Distribution</h3>
            <p className="text-xs text-slate-500">Breakdown of stages in admission pipeline</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {appStatuses.length === 0 ? (
              <p className="text-xs text-slate-400">No application distribution data</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appStatuses}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {appStatuses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
            {appStatuses.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                ></span>
                <span className="truncate text-slate-600 font-medium">
                  {item.name}: <strong>{item.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
