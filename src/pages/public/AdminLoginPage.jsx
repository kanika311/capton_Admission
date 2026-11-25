import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Terminal,
} from 'lucide-react';
import { login, logout } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const AdminLoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanId = identifier.trim();
    if (!cleanId || !password) {
      toast.error('Please enter your Administrator ID / Phone / Email and password');
      return;
    }

    const res = await dispatch(login({ email: cleanId, password, portal: 'admin' }));

    if (res.meta.requestStatus === 'fulfilled') {
      const role = res.payload.user?.role;
      if (role === 'admin' || role === 'superadmin') {
        toast.success(`Access Granted. Welcome, ${res.payload.user.name}`);
        navigate('/admin/dashboard');
      } else {
        dispatch(logout());
        toast.error('Access Denied: Administrator clearance required.');
      }
    } else {
      toast.error(res.payload || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Security Grid & Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,116,144,0.25),rgba(255,255,255,0))]"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Terminal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl mb-4 relative group">
            <div className="absolute inset-0 rounded-2xl bg-brand-royal/20 blur-md group-hover:bg-brand-royal/30 transition-all"></div>
            <ShieldAlert className="w-8 h-8 text-brand-gold relative z-10" />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>CaptonAdmission</span>
            <span className="text-[11px] font-mono uppercase bg-blue-500/20 text-blue-400 border border-blue-400/30 px-2 py-0.5 rounded-full font-bold">
              ADMIN GATE
            </span>
          </h1>

          <p className="text-xs text-slate-400 mt-1.5 font-medium">
            Restricted Security Console &bull; Private Administrator Access
          </p>
        </div>

        {/* Security Notice Pill */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 mb-4 backdrop-blur-xl shadow-xl flex items-start gap-3">
          <KeyRound className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-300 leading-relaxed">
            This administrative terminal is non-public and strictly monitored. Unauthorized access attempts are logged and flagged with source IP verification.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input: Text (Allows Email, Phone 07895726762, or Admin ID) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Administrator Identifier
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="admin@captonadmission.com or 07895726762"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-royal focus:border-brand-royal transition-all"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Enter registered administrator email address, username, or phone number.
              </span>
            </div>

            {/* Input: Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Administrator Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-royal focus:border-brand-royal transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-brand-gold" />
              <span>{loading ? 'Verifying Credentials...' : 'Authenticate & Enter Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Security Badges */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-mono">
              <Terminal className="w-3 h-3 text-emerald-400" />
              TLS 256-Bit Secure
            </span>
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-slate-300 transition-colors text-slate-400"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Site</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
