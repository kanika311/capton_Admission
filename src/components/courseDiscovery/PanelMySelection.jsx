import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Trash2,
  GitCompare,
  ArrowRight,
  GraduationCap,
  Building2,
  HelpCircle,
  FileCheck,
  Send,
  FileText,
} from 'lucide-react';
import {
  removeFromShortlist,
  clearShortlist,
  removeFromCompare,
} from '../../redux/slices/courseDiscoverySlice';
import { openEnquiryModal } from '../../redux/slices/enquiryModalSlice';
import toast from 'react-hot-toast';

const PanelMySelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedCourse, selectedSpecialization, shortlisted, compared } = useSelector(
    (state) => state.courseDiscovery
  );

  const handleApplyShortlisted = (item) => {
    dispatch(
      openEnquiryModal({
        course: item.course || selectedCourse,
        university: item.university,
        specialization: item.specialization || selectedSpecialization,
      })
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-card flex flex-col h-full overflow-hidden">
      {/* Panel 3 Header */}
      <div className="p-4 border-b border-brand-border bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-gold text-brand-navy text-xs font-extrabold flex items-center justify-center">
            3
          </span>
          <h2 className="text-sm font-extrabold text-brand-navy uppercase tracking-wider">
            My Selection
          </h2>
        </div>
        {shortlisted.length > 0 && (
          <button
            onClick={() => {
              dispatch(clearShortlist());
              toast('Shortlist cleared');
            }}
            className="text-[11px] text-red-500 hover:underline font-semibold"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Active Course Cardlet */}
        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
          <span className="text-[10px] font-bold text-brand-royal uppercase tracking-wider block mb-1">
            Active Chosen Degree
          </span>
          {selectedCourse ? (
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-brand-darkText">
                {selectedCourse.name}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Level: <strong>{selectedCourse.level}</strong> &bull; Duration: {selectedCourse.duration}
              </p>
              {selectedSpecialization && selectedSpecialization !== 'All' && (
                <div className="mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 bg-white text-brand-royal rounded border border-blue-200">
                  Spec: {selectedSpecialization}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No course selected yet</p>
          )}
        </div>

        {/* Shortlisted Universities */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Shortlisted Colleges ({shortlisted.length})
            </span>
          </div>

          {shortlisted.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl p-4">
              <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-500">No colleges shortlisted yet</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Click "+ Shortlist" on any university card in Panel 2 to bookmark it here.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {shortlisted.map((item) => {
                const uni = item.university;
                return (
                  <div
                    key={item._id}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-sm relative group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={uni?.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=50&h=50&fit=crop'}
                          alt={uni?.name}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <h5 className="font-bold text-xs text-brand-navy line-clamp-1">
                            {uni?.name}
                          </h5>
                          <span className="text-[10px] text-slate-400">
                            {uni?.location?.city}, {uni?.location?.state}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => dispatch(removeFromShortlist(item._id))}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-brand-royal">
                        ₹ {(item.totalFees / 100000).toFixed(2)} Lakh
                      </span>
                      <div className="flex items-center gap-1.5">
                        {(item.brochureUrl || uni?.brochureUrl) && (
                          <a
                            href={item.brochureUrl || uni?.brochureUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-0.5"
                            title="Download Brochure"
                          >
                            <FileText className="w-3 h-3 text-amber-700" />
                            <span>Brochure</span>
                          </a>
                        )}
                        <button
                          onClick={() => handleApplyShortlisted(item)}
                          className="text-[11px] font-bold text-brand-navy hover:underline bg-brand-gold/30 hover:bg-brand-gold/60 px-2 py-0.5 rounded"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Compared Universities Pill Area */}
        {compared.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                <GitCompare className="w-3.5 h-3.5" /> Compared ({compared.length}/4)
              </span>
              <Link
                to="/compare"
                className="text-xs font-bold text-brand-royal hover:underline"
              >
                View Table &rarr;
              </Link>
            </div>
            <div className="flex flex-wrap gap-1">
              {compared.map((c) => (
                <span
                  key={c._id}
                  className="text-[10px] font-semibold bg-white px-2 py-1 rounded-md border border-amber-200 text-slate-700 flex items-center gap-1"
                >
                  <span className="truncate max-w-[120px]">{c.university?.name}</span>
                  <button
                    onClick={() => dispatch(removeFromCompare(c._id))}
                    className="text-slate-400 hover:text-red-500 ml-1"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Panel 3 Checkout / Action Footer */}
      <div className="p-4 bg-slate-50 border-t border-brand-border space-y-2.5">
        <button
          onClick={() => {
            if (shortlisted.length > 0) {
              handleApplyShortlisted(shortlisted[0]);
            } else if (selectedCourse) {
              dispatch(openEnquiryModal({ course: selectedCourse }));
            } else {
              toast.error('Please choose a course first');
            }
          }}
          className="w-full py-2.5 bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <FileCheck className="w-4 h-4" />
          <span>Continue to Enquiry &rarr;</span>
        </button>

        {compared.length >= 2 && (
          <Link
            to="/compare"
            className="w-full py-2 bg-brand-royal hover:bg-brand-navy text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare {compared.length} Universities Side-by-Side</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PanelMySelection;
