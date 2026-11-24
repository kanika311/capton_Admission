import React, { useState, useEffect } from 'react';
import { Search, PhoneCall, Check, X, MessageSquare, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const leadStatuses = [
  'New',
  'Contacted',
  'Interested',
  'Counselling Scheduled',
  'Follow-up Required',
  'Converted',
  'Not Interested',
];

const AdminEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');

  const fetchEnquiries = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'All') params.append('status', statusFilter);

      const res = await api.get(`/enquiries?${params.toString()}`);
      setEnquiries(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
    // Auto-poll every 8 seconds for real-time lead detection
    const timer = setInterval(() => {
      fetchEnquiries(true);
    }, 8000);
    return () => clearInterval(timer);
  }, [search, statusFilter]);

  const handleOpenModal = (enq) => {
    setSelectedEnquiry(enq);
    setNewStatus(enq.status);
    setNote('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    try {
      await api.put(`/enquiries/${selectedEnquiry._id}/status`, {
        status: newStatus,
        note,
      });
      toast.success('Lead updated successfully');
      setSelectedEnquiry(null);
      fetchEnquiries(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update lead');
    }
  };

  const newLeadsCount = enquiries.filter((e) => e.status === 'New').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-extrabold text-brand-navy">Admissions Leads & Enquiries</h2>
            {newLeadsCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-red-600 text-white animate-pulse shadow-sm shadow-red-500/50">
                {newLeadsCount} New
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time prospective student inquiries, follow-up statuses, and conversion tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Auto-Sync Active
          </span>
          <button
            onClick={() => fetchEnquiries()}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Refresh Leads Now"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-brand-border flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by name, email or mobile..."
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
          <option value="All">All Lead Statuses</option>
          {leadStatuses.map((ls) => (
            <option key={ls} value={ls}>{ls}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-brand-border text-slate-500 uppercase text-[10px] tracking-wider">
                <th className="p-4">Enquiry ID</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Target Course / College</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Loading leads...</td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">No leads found.</td>
                </tr>
              ) : (
                enquiries.map((enq) => {
                  const isNew = enq.status === 'New';
                  return (
                    <tr
                      key={enq._id}
                      className={`transition-colors ${
                        isNew
                          ? 'bg-red-50/50 hover:bg-red-50 border-l-4 border-l-red-500'
                          : 'hover:bg-brand-light/50'
                      }`}
                    >
                      <td className="p-4 font-mono font-bold text-brand-royal">
                        {enq.enquiryNumber}
                      </td>
                      <td className="p-4 font-bold text-brand-navy">
                        <div className="flex items-center">
                          <span>{enq.name}</span>
                          {isNew && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-red-600 text-white shadow-xs">
                              NEW
                            </span>
                          )}
                        </div>
                        {enq.city && (
                          <span className="text-[10px] text-slate-400 block font-normal">
                            📍 {enq.city} {enq.state ? `(${enq.state})` : ''}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="block font-semibold text-brand-darkText">{enq.phone}</span>
                        <span className="text-[11px] text-slate-400">{enq.email}</span>
                      </td>
                      <td className="p-4">
                        <span className="block font-semibold text-brand-navy">
                          {enq.courseName || enq.course?.name || 'General Admission Enquiry'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {enq.universityName || enq.university?.name || ''}
                        </span>
                      </td>
                      <td className="p-4">
                        {isNew ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-sm shadow-red-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                            NEW LEAD
                          </span>
                        ) : enq.status === 'Converted' ? (
                          <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            {enq.status}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                            {enq.status}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOpenModal(enq)}
                          className="px-3 py-1.5 bg-brand-royal hover:bg-brand-navy active:scale-95 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs transition-all"
                        >
                          Follow Up
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Follow Up Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-brand-border overflow-hidden animate-scaleUp">
            <div className="bg-brand-navy text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Lead Details</h3>
                <p className="text-[11px] text-slate-300 font-mono">{selectedEnquiry.enquiryNumber}</p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p><strong>Candidate:</strong> {selectedEnquiry.name} ({selectedEnquiry.phone})</p>
                <p><strong>Email:</strong> {selectedEnquiry.email}</p>
                <p><strong>Target Program:</strong> {selectedEnquiry.courseName || 'General Inquiry'}</p>
                <p><strong>City:</strong> {selectedEnquiry.city || 'India'}</p>
                {selectedEnquiry.interestedInAbroad && (
                  <span className="inline-block px-2 py-0.5 bg-purple-50 text-purple-700 font-bold text-[10px] rounded mr-2">
                    ✈️ Interested in Abroad
                  </span>
                )}
                {selectedEnquiry.interestedInOnline && (
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded">
                    💻 Online Degree
                  </span>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Update Lead Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {leadStatuses.map((ls) => (
                    <option key={ls} value={ls}>{ls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Counsellor Call Note</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Spoke with candidate, shared scholarship eligibility..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-royal hover:bg-brand-navy text-white rounded-lg font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiriesPage;
