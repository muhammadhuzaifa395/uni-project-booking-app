import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  ArrowRight,
  User,
  Filter,
  Eye,
  Trash2,
  Sparkles,
  MapPin,
  CalendarCheck,
  CalendarX,
  History
} from 'lucide-react';

export const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const res = await api.getMyBookings();
      if (res.success) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  // Compute Overview Statistics
  const totalCount = bookings.length;
  const upcomingCount = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending').length;
  const completedCount = bookings.filter((b) => b.status === 'Completed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'Cancelled').length;

  // Filter list
  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Upcoming') return b.status === 'Confirmed' || b.status === 'Pending';
    if (activeFilter === 'Completed') return b.status === 'Completed';
    if (activeFilter === 'Cancelled') return b.status === 'Cancelled';
    return true;
  });

  // Cancel Handler
  const handleCancelBooking = async () => {
    if (!cancelModal) return;
    setCancelling(true);
    try {
      const res = await api.updateBookingStatus(cancelModal._id, 'Cancelled');
      if (res.success) {
        setActionSuccess('Appointment was successfully cancelled.');
        setCancelModal(null);
        fetchMyBookings();
        setTimeout(() => setActionSuccess(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel appointment.');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Confirmed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Pending
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-500" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Welcome Banner */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  Client Dashboard
                </span>
                <span className="text-xs text-slate-400">• Real-time updates</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Hello, {user?.name || 'Customer'}!
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Manage your reservations, check upcoming appointment schedules, or book new services.
              </p>
            </div>

            <Link
              to="/book"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-700 hover:to-blue-700 shadow-md shadow-brand-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Book New Appointment
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Notification Alert */}
        {actionSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-brand-600 mt-1">{upcomingCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">{completedCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Cancelled */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cancelled</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-red-500 mt-1">{cancelledCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
              <CalendarX className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* My Appointments Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Header & Filter Tabs */}
          <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Appointments</h2>
              <p className="text-xs text-slate-500">Track and manage all your scheduled appointments</p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeFilter === tab
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List / Table */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
              <p className="mt-3 text-xs text-slate-500 font-medium">Loading your appointments...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-16 text-center px-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3 border border-slate-200">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} appointments found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Ready to take care of your personal care, health, or learning goals? Book a provider in just a few clicks.
              </p>
              <Link
                to="/book"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-xs"
              >
                Browse Providers & Book
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Provider</th>
                    <th className="py-3.5 px-6">Service</th>
                    <th className="py-3.5 px-6">Schedule</th>
                    <th className="py-3.5 px-6">Amount</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Provider */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              b.providerId?.image ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
                            }
                            alt={b.providerId?.name || 'Provider'}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{b.providerId?.name || 'N/A'}</p>
                            <span className="text-[11px] text-brand-600 font-medium">
                              {b.providerId?.category || 'Service'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="py-4 px-6">
                        <p className="font-semibold text-slate-800">{b.serviceId?.name || 'Service Consultation'}</p>
                        <p className="text-xs text-slate-400">
                          {b.appointmentType || 'In Person'} • {b.serviceId?.duration ? `${b.serviceId.duration}m` : '30m'}
                        </p>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{b.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-brand-600 font-semibold mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-brand-500" />
                          <span>{b.time}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6">
                        <span className="font-extrabold text-slate-900 text-sm">${b.price}</span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {getStatusBadge(b.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(b)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {(b.status === 'Confirmed' || b.status === 'Pending') && (
                            <button
                              type="button"
                              onClick={() => setCancelModal(b)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Details View Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase">
                  #{selectedBooking._id?.slice(-8).toUpperCase()}
                </span>
                <h3 className="text-lg font-bold text-slate-900">Appointment Details</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="py-5 space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <img
                  src={
                    selectedBooking.providerId?.image ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={selectedBooking.providerId?.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <p className="font-bold text-slate-900">{selectedBooking.providerId?.name}</p>
                  <p className="text-xs text-brand-600">{selectedBooking.providerId?.category} • {selectedBooking.providerId?.specialty}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold">Service</span>
                  <span className="font-bold text-slate-900">{selectedBooking.serviceId?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Total Price</span>
                  <span className="font-extrabold text-brand-600 text-sm">${selectedBooking.price}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Date</span>
                  <span className="font-bold text-slate-900">{selectedBooking.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Time Slot</span>
                  <span className="font-bold text-slate-900">{selectedBooking.time}</span>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="text-xs bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900">
                  <span className="font-bold block mb-0.5">Notes:</span>
                  <p className="italic">"{selectedBooking.notes}"</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                <span>Status:</span>
                <div>{getStatusBadge(selectedBooking.status)}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = selectedBooking._id;
                  setSelectedBooking(null);
                  navigate(`/confirmation/${id}`);
                }}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs"
              >
                View Full Voucher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3 border border-red-200">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Cancel Appointment?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Are you sure you want to cancel your appointment with{' '}
              <span className="font-semibold text-slate-800">{cancelModal.providerId?.name}</span> on{' '}
              <span className="font-semibold text-slate-800">{cancelModal.date}</span> at{' '}
              <span className="font-semibold text-slate-800">{cancelModal.time}</span>?
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCancelModal(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancelBooking}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
