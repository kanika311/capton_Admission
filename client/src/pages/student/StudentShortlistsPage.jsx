import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Building2, MapPin, Trash2, Send } from 'lucide-react';
import { openEnquiryModal } from '../../redux/slices/enquiryModalSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StudentShortlistsPage = () => {
  const [shortlists, setShortlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchShortlists = async () => {
    try {
      setLoading(true);
      const res = await api.get('/students/shortlists');
      setShortlists(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlists();
  }, []);

  const handleRemove = async (id) => {
    try {
      await api.delete(`/students/shortlists/${id}`);
      setShortlists(shortlists.filter((s) => s._id !== id));
      toast.success('Removed from shortlist');
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-brand-navy">Shortlisted Colleges</h2>
          <p className="text-xs text-slate-500 mt-1">
            Colleges you bookmarked during course discovery.
          </p>
        </div>
        <Link to="/courses" className="text-xs font-bold text-brand-royal hover:underline">
          + Explore More in 3-Panel Discovery
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-royal mx-auto"></div>
        </div>
      ) : shortlists.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-brand-border text-center shadow-card">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-sm text-brand-navy">No Colleges Shortlisted</h3>
          <p className="text-xs text-slate-400 mt-1">
            Visit the Courses page to shortlist colleges based on fees and placement packages.
          </p>
          <Link
            to="/courses"
            className="mt-4 inline-block px-4 py-2 bg-brand-royal text-white font-bold text-xs rounded-xl"
          >
            Go to Courses Discovery
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {shortlists.map((item) => {
            const uni = item.university;
            return (
              <div
                key={item._id}
                className="bg-white p-5 rounded-2xl border border-brand-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={uni?.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=80&h=80&fit=crop'}
                    alt={uni?.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-brand-navy">{uni?.name}</h4>
                    <p className="text-xs text-slate-500">
                      {uni?.location?.city}, {uni?.location?.state} &bull; {uni?.universityType}
                    </p>
                    {item.course && (
                      <span className="text-xs font-semibold text-brand-royal mt-1 block">
                        Course: {item.course.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      dispatch(
                        openEnquiryModal({
                          university: uni,
                          course: item.course,
                        })
                      )
                    }
                    className="px-4 py-2 bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-bold text-xs rounded-xl shadow-sm"
                  >
                    Apply Now
                  </button>

                  <button
                    onClick={() => handleRemove(item._id)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentShortlistsPage;
