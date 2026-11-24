import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  GitMerge,
  FileText,
  Users,
  UserCheck,
  PhoneCall,
  Compass,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  Video,
  Bell,
} from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import api from '../services/api';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newLeadsCount, setNewLeadsCount] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Poll for new leads count every 8 seconds for real-time red notification badges
  useEffect(() => {
    let isMounted = true;
    const fetchLeadCount = async () => {
      try {
        const res = await api.get('/enquiries?status=New');
        if (isMounted) {
          const count = res.data.count ?? res.data.data?.length ?? 0;
          setNewLeadsCount(count);
        }
      } catch (err) {
        // silent fallback
      }
    };

    fetchLeadCount();
    const timer = setInterval(fetchLeadCount, 8000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { label: 'Analytics Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Hero Video & CMS', to: '/admin/cms', icon: Video },
    { label: 'Course Management', to: '/admin/courses', icon: GraduationCap },
    { label: 'University Directory', to: '/admin/universities', icon: Building2 },
    { label: 'Course-University Mapping', to: '/admin/mappings', icon: GitMerge },
    { label: 'Applications Management', to: '/admin/applications', icon: FileText },
    {
      label: 'Enquiries & Leads',
      to: '/admin/enquiries',
      icon: PhoneCall,
      badge: newLeadsCount > 0 ? `${newLeadsCount} NEW` : null,
    },
    { label: 'Student Directory', to: '/admin/students', icon: Users },
    { label: 'Counsellor Team', to: '/admin/counsellors', icon: UserCheck },
    { label: 'Admin Accounts & Access', to: '/admin/admins', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-brand-light flex">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
        ></div>
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="CaptonAdmission"
                className="w-9 h-9 rounded-full bg-white p-0.5"
              />
              <div>
                <span className="font-extrabold text-base tracking-tight text-white">
                  Capton<span className="text-brand-gold">Admission</span>
                </span>
                <span className="text-[10px] block uppercase text-brand-gold font-bold">
                  Admin Console
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User badge with 1-click Profile & Password link */}
          <Link
            to="/admin/admins?tab=profile"
            onClick={() => setSidebarOpen(false)}
            className="p-3.5 mx-3 my-3 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 flex items-center gap-3 transition-colors group cursor-pointer"
            title="Manage Admin ID & Password"
          >
            <div className="w-9 h-9 rounded-full bg-brand-royal text-white font-bold flex items-center justify-center uppercase text-xs group-hover:scale-105 transition-transform">
              {user?.name ? user.name[0] : 'A'}
            </div>
            <div className="flex-1 truncate">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Admin'}</p>
                <KeyRound className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-gold transition-colors" />
              </div>
              <span className="inline-block mt-0.5 text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-blue-900/60 text-brand-gold">
                {user?.role || 'Staff'}
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="px-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin/dashboard'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                      isActive
                        ? 'bg-brand-royal text-white font-bold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white animate-pulse shadow-md shadow-red-500/50">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-brand-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 hover:text-brand-royal lg:hidden cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-base font-extrabold text-brand-navy">
              Administration & Admission Control
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Real-time Notification Bell */}
            <Link
              to="/admin/enquiries"
              className="relative p-2 text-slate-500 hover:text-brand-navy rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              title="Admissions Inquiries"
            >
              <Bell className="w-5 h-5" />
              {newLeadsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center animate-bounce shadow-md shadow-red-500/50">
                  {newLeadsCount}
                </span>
              )}
            </Link>

            <span className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live System Active
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
