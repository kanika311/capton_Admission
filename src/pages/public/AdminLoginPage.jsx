import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';
import { login } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login({ email, password }));

    if (res.meta.requestStatus === 'fulfilled') {
      const role = res.payload.user?.role;
      if (role === 'admin' || role === 'superadmin' || role === 'counsellor') {
        toast.success(`Welcome, ${res.payload.user.name}`);
        navigate('/admin/dashboard');
      } else {
        toast.error('Unauthorized: Admin or Counsellor access required');
        navigate('/');
      }
    } else {
      toast.error(res.payload || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center py-16 px-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-brand-royal flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-8 h-8 text-brand-royal" />
          </div>
          <h2 className="text-2xl font-extrabold text-brand-navy">Staff & Admin Portal</h2>
          <p className="text-xs text-slate-500 mt-1">
            Restricted access for Administrators and Academic Counsellors
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Staff Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="admin@captonadmission.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-royal focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-royal focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-navy hover:bg-slate-900 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 space-y-1">
          <p>
            Demo Admin: <strong className="text-brand-navy">admin@captonadmission.com</strong> / <strong className="text-brand-navy">Admin@12345</strong>
          </p>
          <p>
            Demo Counsellor: <strong className="text-brand-navy">counsellor@captonadmission.com</strong> / <strong className="text-brand-navy">Counsellor@12345</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
