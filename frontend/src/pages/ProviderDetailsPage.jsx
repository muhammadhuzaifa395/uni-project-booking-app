import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  Scissors,
  Stethoscope,
  GraduationCap,
  Star,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Mail,
  Phone,
  Video,
  UserCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const ProviderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const [pRes, sRes] = await Promise.all([
          api.getProviderById(id),
          api.getServices({ providerId: id })
        ]);

        if (pRes.success) {
          setProvider(pRes.provider);
        } else {
          setError(pRes.message || 'Provider not found');
        }

        if (sRes.success) {
          setServices(sRes.services);
        }
      } catch (err) {
        console.error('Error fetching provider details:', err);
        setError(err.message || 'Failed to load provider profile');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Barber':
        return <Scissors className="w-4 h-4 text-amber-500" />;
      case 'Clinic':
        return <Stethoscope className="w-4 h-4 text-emerald-500" />;
      case 'Private Tutor':
        return <GraduationCap className="w-4 h-4 text-purple-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-brand-500" />;
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Barber':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Clinic':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Private Tutor':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-brand-50 text-brand-700 border-brand-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Loading provider profile...</p>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Provider Not Found</h2>
        <p className="text-slate-600 mb-6">{error || "The provider you requested doesn't exist or has been removed."}</p>
        <Link
          to="/providers"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
        >
          Browse All Providers
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <Link to="/providers" className="hover:text-brand-600 transition-colors">Providers</Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-slate-900 font-medium truncate">{provider.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Provider Banner Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="relative">
                  <img
                    src={provider.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={provider.name}
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover shadow-md border-2 border-slate-100"
                  />
                  <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Verified Professional">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(provider.category)}`}>
                      {getCategoryIcon(provider.category)}
                      {provider.category}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {provider.rating ? provider.rating.toFixed(1) : '5.0'}
                      <span className="text-slate-400 font-normal">({provider.reviewsCount || 48} reviews)</span>
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {provider.name}
                  </h1>
                  <p className="text-brand-600 font-semibold text-base mt-1">
                    {provider.specialty}
                  </p>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-5 mt-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{provider.location || 'Central City, Downtown'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{provider.experience || 'Experienced Specialist'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact & Modality Badges */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-600">
                  {provider.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-brand-600" />
                      {provider.email}
                    </span>
                  )}
                  {provider.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-brand-600" />
                      {provider.phone}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {(provider.appointmentTypes || ['In Person']).map((type, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* About / Bio Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-brand-600" />
                About {provider.name}
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {provider.description ||
                  `Professional ${provider.specialty} dedicated to providing the highest quality care, education, and grooming experiences. Known for attention to detail, punctuality, and a client-first approach.`}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-center">
                  <p className="text-xs text-slate-500 font-medium">Experience</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{provider.experience || '8+ Years'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-center">
                  <p className="text-xs text-slate-500 font-medium">Satisfaction Rate</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">99.4% Positive</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-center">
                  <p className="text-xs text-slate-500 font-medium">Services Offered</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{services.length} Specialized</p>
                </div>
              </div>
            </div>

            {/* Services Offered Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Available Services & Pricing</h2>
                  <p className="text-sm text-slate-500">Select any service to begin your instant booking</p>
                </div>
                <span className="text-xs font-bold bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-200">
                  {services.length} Services
                </span>
              </div>

              {services.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-500 text-sm">No specific services listed yet.</p>
                  <Link
                    to={`/book?providerId=${provider._id}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Proceed with general booking <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {services.map((srv) => (
                    <div
                      key={srv._id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 transition-all duration-200 gap-4"
                    >
                      <div className="flex items-start gap-4">
                        {srv.image ? (
                          <img
                            src={srv.image}
                            alt={srv.name}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                            {getCategoryIcon(srv.category)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors">
                              {srv.name}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {srv.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1 text-slate-600">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {srv.duration} mins
                            </span>
                            <span>•</span>
                            <span className="font-bold text-slate-900 text-sm">
                              ${srv.price}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                        <Link
                          to={`/book?providerId=${provider._id}&serviceId=${srv._id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95"
                        >
                          Book This Service
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Booking Sidebar Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md sticky top-28">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Book an Appointment</h3>
              <p className="text-xs text-slate-500 mb-5">
                Reserve your verified slot in 60 seconds with instant confirmation.
              </p>

              {/* Working Hours Info Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 mb-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-4 h-4 text-brand-600" />
                    Working Hours
                  </span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Open Daily
                  </span>
                </div>
                <div className="text-xs text-slate-600 flex justify-between">
                  <span>Operating Time:</span>
                  <span className="font-medium text-slate-900">
                    {provider.workingHours?.start || '09:00 AM'} - {provider.workingHours?.end || '06:00 PM'}
                  </span>
                </div>
                <div className="text-xs text-slate-600 flex justify-between">
                  <span>Working Days:</span>
                  <span className="font-medium text-slate-900">
                    {provider.workingHours?.days ? provider.workingHours.days.slice(0, 3).join(', ') + '...' : 'Mon - Sat'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate(`/book?providerId=${provider._id}`)}
                className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-700 hover:to-blue-700 shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-amber-300" />
                Select Date & Time Slot
              </button>

              <div className="mt-5 space-y-2.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Double booking prevention enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Free cancellation up to 24 hours prior</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Instant email & in-app confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
