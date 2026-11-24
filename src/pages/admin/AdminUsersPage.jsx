import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShieldCheck,
  UserCheck,
  UserPlus,
  KeyRound,
  Mail,
  Lock,
  Phone,
  User,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Search,
  Shield,
  RefreshCw,
  Check,
  X,
} from 'lucide-react';
import api from '../../services/api';
import { setUser } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const initialTab = searchParams.get('tab') === 'profile' ? 'profile' : 'admins';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Admins state
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingAdmin, setDeletingAdmin] = useState(null);

  // Forms state
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'admin',
  });
  const [showCreatePass, setShowCreatePass] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin',
    isActive: true,
    newPassword: '',
  });
  const [showEditPass, setShowEditPass] = useState(false);

  // Self-profile update form state
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Sync profile form when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileForm((prev) => ({
        ...prev,
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
      }));
    }
  }, [currentUser]);

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/admins');
      setAdmins(res.data.data || []);
    } catch (err) {
      console.error('Error fetching admins:', err);
      toast.error('Failed to load administrator accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Filtered admins
  const filteredAdmins = admins.filter((adm) => {
    const matchesSearch =
      !search ||
      adm.name?.toLowerCase().includes(search.toLowerCase()) ||
      adm.email?.toLowerCase().includes(search.toLowerCase()) ||
      adm.phone?.includes(search);

    const matchesRole = roleFilter === 'All' || adm.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Handle Create Admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!createForm.name || !createForm.email || !createForm.password) {
      toast.error('Please enter name, email and password');
      return;
    }
    if (createForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await api.post('/admin/admins', createForm);
      toast.success('New administrator created successfully!');
      setCreateModalOpen(false);
      setCreateForm({ name: '', email: '', password: '', phone: '', role: 'admin' });
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create admin');
    }
  };

  // Open Edit Admin Modal
  const openEditModal = (adm) => {
    setEditingAdmin(adm);
    setEditForm({
      name: adm.name || '',
      email: adm.email || '',
      phone: adm.phone || '',
      role: adm.role || 'admin',
      isActive: adm.isActive !== false,
      newPassword: '',
    });
    setEditModalOpen(true);
  };

  // Handle Update Admin
  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    if (!editingAdmin) return;
    if (editForm.newPassword && editForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    try {
      const payload = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        role: editForm.role,
        isActive: editForm.isActive,
      };
      if (editForm.newPassword) {
        payload.password = editForm.newPassword;
      }

      await api.put(`/admin/admins/${editingAdmin._id}`, payload);
      toast.success('Admin updated successfully!');
      setEditModalOpen(false);
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update admin');
    }
  };

  // Handle Delete Admin
  const handleDeleteAdmin = async () => {
    if (!deletingAdmin) return;
    try {
      await api.delete(`/admin/admins/${deletingAdmin._id}`);
      toast.success('Admin account deleted successfully!');
      setDeleteModalOpen(false);
      setDeletingAdmin(null);
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete admin');
    }
  };

  // Handle Self-Profile & Credentials Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.email) {
      toast.error('Name and Admin ID/Email are required');
      return;
    }

    if (profileForm.newPassword) {
      if (!profileForm.currentPassword) {
        toast.error('Current password is required to change password');
        return;
      }
      if (profileForm.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters');
        return;
      }
      if (profileForm.newPassword !== profileForm.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
    }

    try {
      setSavingProfile(true);
      const payload = {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
      };
      if (profileForm.newPassword) {
        payload.currentPassword = profileForm.currentPassword;
        payload.newPassword = profileForm.newPassword;
      }

      const res = await api.put('/auth/profile', payload);
      const updated = res.data.data;
      if (updated) {
        dispatch(setUser(updated));
        localStorage.setItem('user', JSON.stringify(updated));
      }

      toast.success('Admin ID & credentials updated successfully!');
      setProfileForm((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-brand-royal flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Admin Management & Access Control
              </h1>
              <p className="text-xs text-slate-500">
                Change Admin ID, passwords, and manage permissions for all administrative accounts.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => {
              setActiveTab('admins');
              setSearchParams({});
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'admins'
                ? 'bg-white text-brand-navy shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Admins ({admins.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('profile');
              setSearchParams({ tab: 'profile' });
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-white text-brand-navy shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-brand-royal" />
            <span>My ID & Password</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: ALL ADMIN USERS DIRECTORY
         ========================================================================= */}
      {activeTab === 'admins' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-royal flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total Admins
                </span>
                <p className="text-xl font-black text-slate-900">{admins.length}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Super Administrators
                </span>
                <p className="text-xl font-black text-slate-900">
                  {admins.filter((a) => a.role === 'superadmin').length}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Active Status
                </span>
                <p className="text-xl font-black text-emerald-700">
                  {admins.filter((a) => a.isActive !== false).length} Active
                </p>
              </div>
            </div>
          </div>

          {/* Search, Filter & Add Admin Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2.5 w-full sm:w-auto flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search admin by name, ID or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Roles</option>
                <option value="superadmin">Superadmin</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-brand-royal hover:bg-brand-navy active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Create New Admin</span>
            </button>
          </div>

          {/* Admins Table / List */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-400 space-y-2">
                <div className="animate-spin w-6 h-6 border-2 border-brand-royal border-t-transparent rounded-full mx-auto"></div>
                <p>Loading administrators...</p>
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No administrative accounts found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Administrator Name</th>
                      <th className="px-5 py-3">Admin ID / Email</th>
                      <th className="px-5 py-3">Phone</th>
                      <th className="px-5 py-3">Role</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredAdmins.map((adm) => {
                      const isMe = adm._id === currentUser?._id || adm.email === currentUser?.email;
                      return (
                        <tr key={adm._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs uppercase shadow-xs">
                                {adm.name ? adm.name[0] : 'A'}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block">{adm.name}</span>
                                {isMe && (
                                  <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                    You (Logged In)
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-slate-900 font-mono text-[11px]">
                            {adm.email}
                          </td>
                          <td className="px-5 py-3.5 text-slate-600">
                            {adm.phone || '—'}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                adm.role === 'superadmin'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : 'bg-blue-100 text-brand-royal border border-blue-200'
                              }`}
                            >
                              {adm.role}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                adm.isActive !== false
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {adm.isActive !== false ? 'Active' : 'Deactivated'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditModal(adm)}
                                className="p-1.5 text-slate-500 hover:text-brand-royal hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="Edit admin & password"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (isMe) {
                                    toast.error('You cannot delete your own logged-in account');
                                    return;
                                  }
                                  setDeletingAdmin(adm);
                                  setDeleteModalOpen(true);
                                }}
                                disabled={isMe}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  isMe
                                    ? 'text-slate-300 cursor-not-allowed'
                                    : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                                }`}
                                title={isMe ? 'Cannot delete yourself' : 'Delete admin account'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: MY ID & PASSWORD (SELF-SERVICE UPDATE)
         ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
          {/* Identity Card */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-royal text-white font-extrabold text-xl flex items-center justify-center uppercase shadow-md border-2 border-white/20">
                {currentUser?.name ? currentUser.name[0] : 'A'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{currentUser?.name}</h2>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-brand-gold text-brand-navy">
                    {currentUser?.role || 'Admin'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono mt-0.5">{currentUser?.email}</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Active Session & System Permissions Granted
                </p>
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full">
                ● Live & Verified
              </span>
            </div>
          </div>

          {/* Profile & Credentials Form */}
          <form
            onSubmit={handleUpdateProfile}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6"
          >
            {/* Section 1: Basic Admin Details */}
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-royal" />
                <span>Admin Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Admin ID / Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal font-semibold text-slate-800"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    This email is used to log in to the admin console.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp Contact
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal font-semibold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Password Update */}
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-royal" />
                <span>Change Password (Optional)</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Leave these fields blank if you do not want to change your password.
              </p>

              <div className="space-y-3.5 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      value={profileForm.currentPassword}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, currentPassword: e.target.value })
                      }
                      placeholder="Enter current password to verify"
                      className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal font-semibold text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={profileForm.newPassword}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, newPassword: e.target.value })
                        }
                        placeholder="At least 6 characters"
                        className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal font-semibold text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={profileForm.confirmPassword}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, confirmPassword: e.target.value })
                      }
                      placeholder="Repeat new password"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 bg-brand-royal hover:bg-brand-navy active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {savingProfile ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Changes & Update Credentials</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          CREATE ADMIN MODAL
         ========================================================================= */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-brand-royal flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">Create New Administrator</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Singhania"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admin ID / Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. vikram@captonadmission.com"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Login Password *
                </label>
                <div className="relative">
                  <input
                    type={showCreatePass ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePass(!showCreatePass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCreatePass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Role *
                  </label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91..."
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-royal hover:bg-brand-navy active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          EDIT ADMIN MODAL
         ========================================================================= */}
      {editModalOpen && editingAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-brand-royal flex items-center justify-center font-bold">
                  <Edit className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">Edit Administrator Details</h3>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAdmin} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admin ID / Email *
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Role *
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Account Status
                  </label>
                  <select
                    value={editForm.isActive ? 'active' : 'inactive'}
                    onChange={(e) =>
                      setEditForm({ ...editForm, isActive: e.target.value === 'active' })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Deactivated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reset Password (Leave blank to keep unchanged)
                </label>
                <div className="relative">
                  <input
                    type={showEditPass ? 'text' : 'password'}
                    placeholder="New password (optional)"
                    value={editForm.newPassword}
                    onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                    className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPass(!showEditPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showEditPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-royal hover:bg-brand-navy active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          DELETE CONFIRMATION MODAL
         ========================================================================= */}
      {deleteModalOpen && deletingAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Delete Administrator?</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Are you sure you want to permanently remove{' '}
              <strong className="text-slate-800">{deletingAdmin.name}</strong> (
              <span className="font-mono">{deletingAdmin.email}</span>)? This action cannot be
              undone.
            </p>

            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAdmin}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Yes, Delete Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
