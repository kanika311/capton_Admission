import React, { useState, useEffect } from 'react';
import { Search, UserCheck, Shield, Check, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/students?search=${encodeURIComponent(search)}`);
      setStudents(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.put(`/admin/students/${id}/toggle-status`);
      setStudents(
        students.map((s) => (s._id === id ? { ...s, isActive: res.data.data.isActive } : s))
      );
      toast.success('Student account status updated');
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-extrabold text-brand-navy">Registered Students Directory</h2>
        <p className="text-xs text-slate-500 mt-1">
          View all registered candidate accounts and maintain security credentials.
        </p>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-brand-border flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by student name, email, or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs focus:outline-none"
        />
      </div>

      <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-brand-border text-slate-500 uppercase text-[10px] tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Loading students...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">No students found.</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-brand-light/50 transition-colors">
                    <td className="p-4 font-bold text-brand-navy">{student.name}</td>
                    <td className="p-4 text-slate-600">{student.email}</td>
                    <td className="p-4 text-slate-600">{student.phone || 'N/A'}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          student.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {student.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(student._id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          student.isActive
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {student.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentsPage;
