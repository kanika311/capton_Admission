import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Compass, CheckCircle2, ArrowRight, PhoneCall, ShieldCheck } from 'lucide-react';
import { openEnquiryModal } from '../../redux/slices/enquiryModalSlice';
import api from '../../services/api';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await api.get('/services');
        setServices(res.data.data || []);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-brand-light pb-20">
      {/* Banner */}
      <div className="bg-brand-navy text-white py-12 px-4 border-b border-brand-border">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Professional Guidance
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Our Admission & Counselling Services
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
            Personalized support across career mapping, college shortlisting, form completion, scholarship acquisition, and loan processing.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse bg-white h-60 rounded-2xl border border-slate-200"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover transition-all duration-300 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-brand-royal flex items-center justify-center mb-4">
                    <Compass className="w-6 h-6" />
                  </div>

                  <h3 className="font-bold text-base text-brand-navy">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {service.benefits && service.benefits.length > 0 && (
                    <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                      {service.benefits.slice(0, 3).map((b, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="line-clamp-1">{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-xs font-bold text-brand-royal hover:underline"
                  >
                    Service Details &rarr;
                  </Link>

                  <button
                    onClick={() => dispatch(openEnquiryModal({}))}
                    className="px-3.5 py-1.5 bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-bold text-xs rounded-lg shadow-sm"
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
