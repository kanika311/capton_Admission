import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  MessageSquare,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import api from '../../services/api';

const statusSteps = [
  'Submitted',
  'Under Review',
  'Counselling Scheduled',
  'Documents Pending',
  'Shortlisted',
  'Approved',
  'Admission Confirmed',
];

const StudentApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const res = await api.get('/applications');
        const list = res.data.data || [];
        setApplications(list);
        if (list.length > 0) {
          setSelectedApp(list[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const getStepStatus = (stepName, currentStatus) => {
    const currentIndex = statusSteps.indexOf(currentStatus);
    const stepIndex = statusSteps.indexOf(stepName);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-extrabold text-brand-navy">My Admission Applications</h2>
        <p className="text-xs text-slate-500 mt-1">
          Track official application status updates and counselling correspondence in real time.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-royal mx-auto"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white p-16 rounded-2xl border border-brand-border text-center shadow-card">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-base text-brand-navy">No Applications Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            You haven't submitted any university applications yet.
          </p>
          <Link
            to="/courses"
            className="mt-5 inline-block px-5 py-2.5 bg-brand-royal text-white font-bold text-xs rounded-xl shadow"
          >
            Explore 3-Panel Course Discovery
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Applications Master List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {applications.map((app) => {
              const isSelected = selectedApp?._id === app._id;
              return (
                <div
                  key={app._id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-brand-royal shadow-sm'
                      : 'bg-white border-brand-border hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono font-bold text-brand-royal bg-white px-2 py-0.5 rounded border border-blue-200">
                      {app.applicationNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        app.status === 'Approved' || app.status === 'Admission Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Under Review'
                          ? 'bg-blue-100 text-brand-royal'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-brand-navy leading-snug">
                    {app.university?.name}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {app.course?.name} ({app.specialization || 'General'})
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                    <span className="text-brand-royal font-bold flex items-center gap-0.5">
                      Details <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Application Detail View & Visual Timeline (7 cols) */}
          <div className="lg:col-span-7">
            {selectedApp && (
              <div className="bg-white rounded-2xl border border-brand-border shadow-card p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Application Reference
                    </span>
                    <h3 className="text-lg font-mono font-extrabold text-brand-royal">
                      {selectedApp.applicationNumber}
                    </h3>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Current Status</span>
                    <span className="inline-block mt-0.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-brand-royal uppercase">
                      {selectedApp.status}
                    </span>
                  </div>
                </div>

                {/* Target University Cardlet */}
                <div className="p-4 bg-brand-light rounded-xl border border-brand-border flex items-center gap-3.5">
                  <img
                    src={selectedApp.university?.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=80&h=80&fit=crop'}
                    alt={selectedApp.university?.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-brand-navy">
                      {selectedApp.university?.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {selectedApp.course?.name} &bull; {selectedApp.specialization}
                    </p>
                  </div>
                </div>

                {/* VISUAL APPLICATION TIMELINE */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                    Admission Progress Timeline
                  </h4>
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {statusSteps.map((step) => {
                      const state = getStepStatus(step, selectedApp.status);
                      return (
                        <div key={step} className="relative flex items-start gap-3 text-xs">
                          <span
                            className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                              state === 'completed'
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : state === 'current'
                                ? 'bg-brand-royal border-brand-royal animate-pulse ring-4 ring-blue-100'
                                : 'bg-white border-slate-300'
                            }`}
                          >
                            {state === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                          </span>

                          <div>
                            <strong
                              className={`block ${
                                state === 'current'
                                  ? 'text-brand-royal font-extrabold text-sm'
                                  : state === 'completed'
                                  ? 'text-brand-darkText font-bold'
                                  : 'text-slate-400 font-medium'
                              }`}
                            >
                              {step}
                            </strong>
                            {state === 'current' && (
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Current stage under university scrutiny.
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Counsellor Remarks */}
                {selectedApp.remarks && selectedApp.remarks.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h4 className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-brand-royal" />
                      Counsellor Notes & Remarks
                    </h4>
                    {selectedApp.remarks.map((r, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                        <p>{r.note}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Recorded on {new Date(r.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentApplicationsPage;
