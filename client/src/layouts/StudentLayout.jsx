import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
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
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { logout } from '../redux/slices/authSlice';

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { label: 'Overview', to: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Profile & Education', to: '/student/profile', icon: User },
    { label: 'My Applications', to: '/student/applications', icon: FileText },
    { label: 'Uploaded Documents', to: '/student/documents', icon: FileCheck },
    { label: 'Shortlisted Colleges', to: '/student/shortlists', icon: Building2 },
    { label: 'Notifications', to: '/student/notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-brand-light flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-brand-navy text-white flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="CaptonAdmission"
                className="w-9 h-9 rounded-full bg-white p-0.5"
              />
              <div>
                <span className="font-extrabold text-base tracking-tight text-white">
                  Capton<span className="text-brand-gold">Admission</span>
                </span>
                <span className="text-[10px] block uppercase text-slate-400 font-semibold">
                  Student Portal
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User profile preview badge */}
          <div className="p-4 mx-3 my-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-royal text-white font-bold flex items-center justify-center uppercase text-sm border border-brand-gold/40">
              {user?.name ? user.name[0] : 'S'}
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Student'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/student/dashboard'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-royal text-white font-bold shadow-sm'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/courses"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-brand-gold font-bold hover:bg-white/5"
          >
            <span>3-Panel Course Discovery</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-brand-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 hover:text-brand-royal lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-base font-extrabold text-brand-navy">
              Student Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/student/notifications"
              className="p-2 text-slate-500 hover:text-brand-royal rounded-full hover:bg-slate-100 relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </Link>

            <Link
              to="/"
              className="text-xs font-bold text-brand-royal hover:underline hidden sm:block"
            >
              Browse Public Site &rarr;
            </Link>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
