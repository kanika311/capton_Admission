import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Compass, CheckCircle2, PhoneCall, ArrowRight, HelpCircle, Shield } from 'lucide-react';
import { openEnquiryModal } from '../../redux/slices/enquiryModalSlice';
import api from '../../services/api';

const ServiceDetailsPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/services/slug/${slug}`);
        setService(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-royal"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen py-24 text-center">
        <h2 className="text-xl font-bold text-brand-navy">Service Not Found</h2>
        <Link to="/services" className="mt-4 inline-block text-brand-royal underline">
          &larr; Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light pb-20">
      <div className="bg-brand-navy text-white py-12 px-4 border-b border-brand-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block mb-1">
              CaptonAdmission Service
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {service.title}
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              {service.shortDescription}
            </p>
          </div>

          <button
            onClick={() => dispatch(openEnquiryModal({}))}
            className="bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-extrabold px-6 py-3 rounded-xl shadow-lg transition-all text-sm shrink-0 flex items-center gap-2"
          >
            <span>Enquire For This Service</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card space-y-4">
              <h2 className="text-xl font-bold text-brand-navy border-b border-slate-100 pb-3">
                Service Overview
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {service.fullDescription || service.shortDescription}
              </p>
            </div>

            {service.benefits && service.benefits.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card space-y-4">
                <h2 className="text-xl font-bold text-brand-navy border-b border-slate-100 pb-3">
                  Key Benefits & Outcomes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.benefits.map((b, i) => (
                    <div key={i} className="p-3.5 bg-brand-light rounded-xl border border-brand-border flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-sm font-medium text-brand-darkText">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {service.processSteps && service.processSteps.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card space-y-4">
                <h2 className="text-xl font-bold text-brand-navy border-b border-slate-100 pb-3">
                  How This Service Works
                </h2>
                <div className="space-y-3">
                  {service.processSteps.map((step, i) => (
                    <div key={i} className="p-4 bg-brand-light rounded-xl border border-brand-border flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-brand-royal text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {step.stepNumber || i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-brand-navy">{step.title}</h4>
                        <p className="text-xs text-slate-600 mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-card space-y-4 text-center">
              <Compass className="w-12 h-12 text-brand-royal mx-auto" />
              <h3 className="font-bold text-base text-brand-navy">
                Need Help with {service.title}?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect with our certified admissions specialists today for free advice.
              </p>
              <button
                onClick={() => dispatch(openEnquiryModal({}))}
                className="w-full py-2.5 bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-bold rounded-xl text-xs shadow"
              >
                Request Free Guidance Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
