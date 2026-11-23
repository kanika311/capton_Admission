import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  GitCompare,
  Trash2,
  Plus,
  Building2,
  MapPin,
  Check,
  Star,
  Award,
  DollarSign,
  FileCheck,
} from 'lucide-react';
import { removeFromCompare, clearCompare } from '../../redux/slices/courseDiscoverySlice';
import { openEnquiryModal } from '../../redux/slices/enquiryModalSlice';
import toast from 'react-hot-toast';

const ComparePage = () => {
  const dispatch = useDispatch();
  const { compared } = useSelector((state) => state.courseDiscovery);

  const handleApply = (item) => {
    dispatch(
      openEnquiryModal({
        course: item.course,
        university: item.university,
        specialization: item.specialization,
      })
    );
  };

  return (
    <div className="min-h-screen bg-brand-light pb-20">
      {/* Banner */}
      <div className="bg-brand-navy text-white py-10 px-4 border-b border-brand-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-brand-gold font-semibold uppercase tracking-wider mb-1">
              <GitCompare className="w-4 h-4" />
              Decision Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Compare Universities Side-by-Side
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Evaluate verified fees, placement metrics, accreditations, and course details for up to 4 universities.
            </p>
          </div>

          {compared.length > 0 && (
            <button
              onClick={() => {
                dispatch(clearCompare());
                toast('Comparison cleared');
              }}
              className="text-xs font-semibold text-red-400 hover:text-red-300 underline"
            >
              Clear Comparison
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {compared.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-border p-16 text-center shadow-card">
            <GitCompare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-brand-navy">No Universities in Comparison</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Select a course in our Course Discovery system and click "+ Compare" on any university card to evaluate them here.
            </p>
            <Link
              to="/courses"
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-brand-royal text-white font-bold rounded-xl text-xs shadow hover:bg-brand-navy transition-colors"
            >
              <span>Go to 3-Panel Course Discovery</span>
              &rarr;
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
            {/* Horizontally scrollable comparison table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-brand-border bg-slate-50">
                    <th className="p-4 w-52 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                      Comparison Parameter
                    </th>
                    {compared.map((item) => {
                      const uni = item.university;
                      return (
                        <th key={item._id} className="p-4 min-w-[260px] border-l border-brand-border">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <img
                              src={uni?.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=80&h=80&fit=crop'}
                              alt={uni?.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                            />
                            <button
                              onClick={() => dispatch(removeFromCompare(item._id))}
                              className="text-slate-400 hover:text-red-500 p-1"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <h4 className="font-bold text-sm text-brand-navy">{uni?.name}</h4>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-brand-gold" />
                            {uni?.location?.city}, {uni?.location?.state}
                          </p>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {/* College Type */}
                  <tr>
                    <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Institution Type</td>
                    {compared.map((item) => (
                      <td key={item._id} className="p-4 border-l border-slate-100 font-semibold text-brand-darkText">
                        {item.university?.universityType}
                      </td>
                    ))}
                  </tr>

                  {/* Course & Specialization */}
                  <tr>
                    <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Course & Specialization</td>
                    {compared.map((item) => (
                      <td key={item._id} className="p-4 border-l border-slate-100 font-semibold text-brand-royal">
                        {item.course?.name || 'General Program'}
                        <span className="block text-[11px] text-slate-500 font-normal">
                          Spec: {item.specialization || 'General'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Total Fees */}
                  <tr>
                    <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Total Course Fees</td>
                    {compared.map((item) => (
                      <td key={item._id} className="p-4 border-l border-slate-100 font-extrabold text-brand-navy text-sm">
                        ₹ {(item.totalFees / 100000).toFixed(2)} Lakh
                      </td>
                    ))}
                  </tr>

                  {/* Average Package */}
                  <tr>
                    <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Average Package</td>
                    {compared.map((item) => (
                      <td key={item._id} className="p-4 border-l border-slate-100 font-bold text-emerald-700">
                        {item.placementInfo?.averagePackage || item.university?.placementOverview?.averagePackage || 'Verified'}
                      </td>
                    ))}
                  </tr>

                  {/* Highest Package */}
                  <tr>
                    <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Highest Package</td>
                    {compared.map((item) => (
                      <td key={item._id} className="p-4 border-l border-slate-100 font-bold text-brand-navy">
                        {item.placementInfo?.highestPackage || item.university?.placementOverview?.highestPackage || 'Verified'}
                      </td>
                    ))}
                  </tr>

                  {/* Accreditations */}
                  <tr>
                    <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Accreditations</td>
                    {compared.map((item) => (
                      <td key={item._id} className="p-4 border-l border-slate-100">
                        <div className="flex flex-wrap gap-1">
                          {(item.university?.accreditation || []).map((acc, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-medium">
                              {acc}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Admission Status */}
                  <tr>
                    <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Admission Status</td>
                    {compared.map((item) => (
                      <td key={item._id} className="p-4 border-l border-slate-100 font-semibold text-emerald-700">
                        {item.admissionStatus || 'Open'}
                      </td>
                    ))}
                  </tr>

                  {/* Eligibility */}
                  <tr>
                    <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Eligibility Criteria</td>
                    {compared.map((item) => (
                      <td key={item._id} className="p-4 border-l border-slate-100 text-slate-600">
                        {item.eligibility}
                      </td>
                    ))}
                  </tr>

                  {/* Action CTA */}
                  <tr>
                    <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Action</td>
                    {compared.map((item) => (
                      <td key={item._id} className="p-4 border-l border-slate-100">
                        <button
                          onClick={() => handleApply(item)}
                          className="w-full py-2 bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-bold rounded-lg shadow-sm text-xs"
                        >
                          Apply / Enquire Now
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
