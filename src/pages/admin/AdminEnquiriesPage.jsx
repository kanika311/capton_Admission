import React, { useState, useEffect } from 'react';
import { Search, PhoneCall, Check, X, MessageSquare } from 'lucide-react';
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

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'All') params.append('status', statusFilter);

      const res = await api.get(`/enquiries?${params.toString()}`);
      setEnquiries(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
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
      fetchEnquiries();
    } catch (err) {
      toast.error('Failed to update lead');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-extrabold text-brand-navy">Admissions Leads & Enquiries</h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage prospective student inquiries, follow-up statuses, and conversion tracking.
        </p>
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
                enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-brand-light/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-royal">{enq.enquiryNumber}</td>
                    <td className="p-4 font-bold text-brand-navy">{enq.name}</td>
                    <td className="p-4">
                      <span className="block text-brand-darkText">{enq.phone}</span>
                      <span className="text-[11px] text-slate-400">{enq.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="block font-semibold text-brand-navy">
                        {enq.courseName || enq.course?.name || 'Course Inquiry'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {enq.universityName || enq.university?.name || ''}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                          enq.status === 'Converted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : enq.status === 'New'
                            ? 'bg-blue-100 text-brand-royal'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenModal(enq)}
                        className="px-3 py-1.5 bg-brand-royal hover:bg-brand-navy text-white rounded-lg font-bold text-xs"
                      >
                        Follow Up
                      </button>
                    </td>
                  </tr>
                ))
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
              <button onClick={() => setSelectedEnquiry(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p><strong>Candidate:</strong> {selectedEnquiry.name} ({selectedEnquiry.phone})</p>
                <p><strong>Message:</strong> {selectedEnquiry.message || 'No specific note'}</p>
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
                <label className="block font-semibold text-slate-700 mb-1">Add Follow-up Note</label>
                <textarea
                  rows={3}
                  placeholder="Record counsellor interaction summary..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-royal hover:bg-brand-navy text-white font-bold rounded-xl shadow transition-colors"
              >
                Save Follow-Up
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiriesPage;
