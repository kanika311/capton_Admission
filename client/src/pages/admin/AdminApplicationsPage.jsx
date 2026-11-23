import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, MessageSquare, Check, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const statuses = [
  'Submitted',
  'Under Review',
  'Counselling Scheduled',
  'Documents Pending',
  'Shortlisted',
  'Approved',
  'Rejected',
  'Admission Confirmed',
];

const AdminApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Status Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [remarkNote, setRemarkNote] = useState('');
  const [assignedCounsellor, setAssignedCounsellor] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'All') params.append('status', statusFilter);

      const [appRes, counsRes] = await Promise.all([
        api.get(`/applications?${params.toString()}`),
        api.get('/admin/counsellors'),
      ]);

      setApplications(appRes.data.data || []);
      setCounsellors(counsRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter]);

  const handleOpenStatusModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setRemarkNote('');
    setAssignedCounsellor(app.counsellorAssigned?._id || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      // Update status
      if (newStatus !== selectedApp.status) {
        await api.put(`/applications/${selectedApp._id}/status`, {
          status: newStatus,
          comment: remarkNote || `Status changed to ${newStatus}`,
        });
      }

      // Add remark note if provided
      if (remarkNote) {
        await api.post(`/applications/${selectedApp._id}/remarks`, { note: remarkNote });
      }

      // Assign counsellor if changed
      if (assignedCounsellor && assignedCounsellor !== selectedApp.counsellorAssigned?._id) {
        await api.put(`/applications/${selectedApp._id}/assign`, {
          counsellorId: assignedCounsellor,
        });
      }

      toast.success('Application updated successfully');
      setSelectedApp(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to update application');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-extrabold text-brand-navy">Application Management</h2>
        <p className="text-xs text-slate-500 mt-1">
          Review candidate submissions, update admission pipeline statuses, and assign counsellors.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-brand-border flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by candidate name or application ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700"
        >
          <option value="All">All Statuses</option>
          {statuses.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-brand-border text-slate-500 uppercase text-[10px] tracking-wider">
                <th className="p-4">App ID</th>
                <th className="p-4">Student</th>
                <th className="p-4">University & Course</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned Counsellor</th>
                <th className="p-4">Applied Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Loading applications...</td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No applications found.</td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-brand-light/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-royal">{app.applicationNumber}</td>
                    <td className="p-4">
                      <span className="font-bold text-brand-navy block">{app.student?.name}</span>
                      <span className="text-[11px] text-slate-400">{app.student?.email}</span>
                    </td>
                    <td className="p-4">
                      <strong className="text-brand-darkText block">{app.university?.name}</strong>
                      <span className="text-[11px] text-slate-500">{app.course?.name} ({app.specialization})</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                          app.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Under Review'
                            ? 'bg-blue-100 text-brand-royal'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">
                      {app.counsellorAssigned?.name || <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="p-4 text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenStatusModal(app)}
                        className="px-3 py-1.5 bg-brand-royal hover:bg-brand-navy text-white rounded-lg font-bold text-xs"
                      >
                        Manage Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Status Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-brand-border overflow-hidden animate-scaleUp">
            <div className="bg-brand-navy text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Update Application</h3>
                <p className="text-[11px] text-slate-300 font-mono">{selectedApp.applicationNumber}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Admission Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign Counsellor</label>
                <select
                  value={assignedCounsellor}
                  onChange={(e) => setAssignedCounsellor(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">Leave Unassigned</option>
                  {counsellors.map((c) => (
                    <option key={c.user?._id || c._id} value={c.user?._id || c._id}>
                      {c.user?.name || 'Counsellor'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Add Internal Remark / Note</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Documents verified; student invited for counselling call..."
                  value={remarkNote}
                  onChange={(e) => setRemarkNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-royal hover:bg-brand-navy text-white font-bold rounded-xl shadow transition-colors"
              >
                Save Updates
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplicationsPage;
