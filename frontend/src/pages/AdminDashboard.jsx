import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  Scissors,
  Stethoscope,
  GraduationCap,
  Sparkles,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Plus,
  Trash2,
  Edit2,
  Filter,
  LogOut,
  ChevronRight,
  Shield,
  Layers,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Menu
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'appointments' | 'providers' | 'services' | 'users'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data states
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Loaders
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  // Filters & searches
  const [aptSearch, setAptSearch] = useState('');
  const [aptStatusFilter, setAptStatusFilter] = useState('All');
  const [userSearch, setUserSearch] = useState('');

  // Modals
  const [providerModal, setProviderModal] = useState({ open: false, mode: 'create', data: null });
  const [serviceModal, setServiceModal] = useState({ open: false, mode: 'create', data: null });

  // Load Initial Admin Data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, aptsRes, provsRes, servsRes, usersRes] = await Promise.all([
        api.getAdminStats(),
        api.getAllBookings(),
        api.getProviders(),
        api.getServices(),
        api.getUsers()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (aptsRes.success) setAppointments(aptsRes.bookings);
      if (provsRes.success) setProviders(provsRes.providers);
      if (servsRes.success) setServices(servsRes.services);
      if (usersRes.success) setUsersList(usersRes.users);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      setActionMsg({ type: 'error', text: err.message || 'Error loading dashboard data' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const showNotification = (type, text) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg({ type: '', text: '' }), 4000);
  };

  // Appointment Status Change Handler
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await api.updateBookingStatus(bookingId, newStatus);
      if (res.success) {
        showNotification('success', `Appointment status updated to ${newStatus}`);
        setAppointments((prev) =>
          prev.map((a) => (a._id === bookingId ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      showNotification('error', err.message || 'Status update failed');
    }
  };

  // Appointment Deletion
  const handleDeleteAppointment = async (bookingId) => {
    if (!window.confirm('Are you sure you want to permanently delete this appointment?')) return;
    try {
      const res = await api.deleteBooking(bookingId);
      if (res.success) {
        showNotification('success', 'Appointment deleted.');
        setAppointments((prev) => prev.filter((a) => a._id !== bookingId));
      }
    } catch (err) {
      showNotification('error', err.message || 'Delete failed');
    }
  };

  // User Role Toggle
  const handleToggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await api.updateUserRole(userId, newRole);
      if (res.success) {
        showNotification('success', `User role changed to ${newRole}`);
        setUsersList((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      showNotification('error', err.message || 'Role change failed');
    }
  };

  // User Delete
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user account?')) return;
    try {
      const res = await api.deleteUser(userId);
      if (res.success) {
        showNotification('success', 'User account deleted.');
        setUsersList((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err) {
      showNotification('error', err.message || 'Delete user failed');
    }
  };

  // Provider Save (Create or Update)
  const handleSaveProvider = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      name: fd.get('name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      category: fd.get('category'),
      specialty: fd.get('specialty'),
      location: fd.get('location'),
      image: fd.get('image'),
      description: fd.get('description')
    };

    try {
      if (providerModal.mode === 'create') {
        const res = await api.createProvider(payload);
        if (res.success) {
          showNotification('success', 'New provider created successfully.');
          setProviders([res.provider, ...providers]);
        }
      } else {
        const res = await api.updateProvider(providerModal.data._id, payload);
        if (res.success) {
          showNotification('success', 'Provider details updated.');
          setProviders(providers.map((p) => (p._id === res.provider._id ? res.provider : p)));
        }
      }
      setProviderModal({ open: false, mode: 'create', data: null });
    } catch (err) {
      showNotification('error', err.message || 'Failed saving provider');
    }
  };

  // Provider Delete
  const handleDeleteProvider = async (provId) => {
    if (!window.confirm('Delete this provider? All associated bookings may also be affected.')) return;
    try {
      const res = await api.deleteProvider(provId);
      if (res.success) {
        showNotification('success', 'Provider deleted.');
        setProviders(providers.filter((p) => p._id !== provId));
      }
    } catch (err) {
      showNotification('error', err.message || 'Failed to delete provider');
    }
  };

  // Service Save (Create or Update)
  const handleSaveService = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      name: fd.get('name'),
      category: fd.get('category'),
      price: Number(fd.get('price')),
      duration: Number(fd.get('duration')),
      providerId: fd.get('providerId'),
      description: fd.get('description'),
      image: fd.get('image')
    };

    try {
      if (serviceModal.mode === 'create') {
        const res = await api.createService(payload);
        if (res.success) {
          showNotification('success', 'Service created successfully.');
          setServices([res.service, ...services]);
        }
      } else {
        const res = await api.updateService(serviceModal.data._id, payload);
        if (res.success) {
          showNotification('success', 'Service updated successfully.');
          setServices(services.map((s) => (s._id === res.service._id ? res.service : s)));
        }
      }
      setServiceModal({ open: false, mode: 'create', data: null });
    } catch (err) {
      showNotification('error', err.message || 'Failed saving service');
    }
  };

  // Service Delete
  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      const res = await api.deleteService(serviceId);
      if (res.success) {
        showNotification('success', 'Service deleted.');
        setServices(services.filter((s) => s._id !== serviceId));
      }
    } catch (err) {
      showNotification('error', err.message || 'Failed to delete service');
    }
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus = aptStatusFilter === 'All' || a.status === aptStatusFilter;
    const matchesSearch =
      !aptSearch ||
      a.customerName?.toLowerCase().includes(aptSearch.toLowerCase()) ||
      a.providerName?.toLowerCase().includes(aptSearch.toLowerCase()) ||
      a.serviceName?.toLowerCase().includes(aptSearch.toLowerCase()) ||
      a._id?.toLowerCase().includes(aptSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filtered Users
  const filteredUsers = usersList.filter((u) => {
    return (
      !userSearch ||
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone?.toLowerCase().includes(userSearch.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center font-bold">
            ⚡
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* SIDEBAR NAVIGATION (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-5 z-50 transition-transform duration-200 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo / Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-white text-base tracking-tight leading-tight">
                  BookEasy
                </h2>
                <p className="text-[10px] text-brand-400 font-bold uppercase tracking-wider">
                  Admin Console
                </p>
              </div>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-sm font-semibold">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'appointments', label: 'Appointments', icon: Calendar, badge: appointments.length },
              { id: 'providers', label: 'Providers', icon: Briefcase, badge: providers.length },
              { id: 'services', label: 'Services', icon: Layers, badge: services.length },
              { id: 'users', label: 'User Accounts', icon: Users, badge: usersList.length }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white font-bold shadow-md shadow-brand-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Badge & Logout */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-emerald-400 font-medium">Super Admin Access</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout from Admin
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Top Header / Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              Management Portal
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight capitalize">
              {activeTab === 'overview'
                ? 'System Overview & Analytics'
                : activeTab === 'appointments'
                ? 'Appointments Management'
                : activeTab === 'providers'
                ? 'Providers & Specialists'
                : activeTab === 'services'
                ? 'Service Catalog'
                : 'Registered Users'}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setRefreshing(true);
                loadDashboardData();
              }}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Data</span>
            </button>

            {activeTab === 'providers' && (
              <button
                onClick={() => setProviderModal({ open: true, mode: 'create', data: null })}
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Provider
              </button>
            )}

            {activeTab === 'services' && (
              <button
                onClick={() => setServiceModal({ open: true, mode: 'create', data: null })}
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Service
              </button>
            )}
          </div>
        </div>

        {/* Global Notification Banner */}
        {actionMsg.text && (
          <div
            className={`p-4 rounded-2xl border text-sm font-medium flex items-center gap-2.5 animate-fadeIn ${
              actionMsg.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {actionMsg.type === 'error' ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            ) : (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            )}
            <span>{actionMsg.text}</span>
          </div>
        )}

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalUsers || usersList.length}</p>
                <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">● Registered Clients</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Providers</p>
                <p className="text-2xl font-extrabold text-brand-600 mt-1">{stats?.totalProviders || providers.length}</p>
                <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">3 Categories</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Services</p>
                <p className="text-2xl font-extrabold text-indigo-600 mt-1">{stats?.totalServices || services.length}</p>
                <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">In Catalog</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Appointments</p>
                <p className="text-2xl font-extrabold text-blue-600 mt-1">{stats?.totalBookings || appointments.length}</p>
                <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">All Time</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending</p>
                <p className="text-2xl font-extrabold text-amber-500 mt-1">{stats?.pendingBookings || 0}</p>
                <span className="text-[10px] text-amber-600 font-bold mt-1 inline-block">Requires Review</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
                <p className="text-2xl font-extrabold text-emerald-600 mt-1">${stats?.totalRevenue || 0}</p>
                <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">Completed/Active</span>
              </div>
            </div>

            {/* Recent Bookings Activity Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Recent Appointment Bookings</h3>
                  <p className="text-xs text-slate-500">Live feed of reservations submitted on the platform</p>
                </div>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  View All Bookings <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                      <th className="pb-3">Client</th>
                      <th className="pb-3">Provider</th>
                      <th className="pb-3">Service</th>
                      <th className="pb-3">Date & Time</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.slice(0, 5).map((apt) => (
                      <tr key={apt._id} className="hover:bg-slate-50/70">
                        <td className="py-3 font-semibold text-slate-900">{apt.customerName}</td>
                        <td className="py-3 text-slate-700">{apt.providerName}</td>
                        <td className="py-3 text-slate-600 text-xs">{apt.serviceName}</td>
                        <td className="py-3 text-xs font-medium">
                          {apt.date} • <span className="text-brand-600 font-bold">{apt.time}</span>
                        </td>
                        <td className="py-3 font-bold text-slate-900">${apt.price}</td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              apt.status === 'Confirmed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : apt.status === 'Completed'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : apt.status === 'Cancelled'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <select
                            value={apt.status}
                            onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Filter & Search Bar */}
            <div className="p-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customer, provider, service..."
                  value={aptSearch}
                  onChange={(e) => setAptSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Status:</span>
                {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setAptStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      aptStatusFilter === st
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Booking ID</th>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Provider</th>
                    <th className="py-4 px-6">Service</th>
                    <th className="py-4 px-6">Date & Slot</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-12 text-center text-slate-400 text-sm">
                        No appointments found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((apt) => (
                      <tr key={apt._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs font-bold text-slate-400">
                          #{apt._id?.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900">{apt.customerName}</td>
                        <td className="py-4 px-6 text-slate-700">{apt.providerName}</td>
                        <td className="py-4 px-6 text-slate-600 text-xs font-medium">{apt.serviceName}</td>
                        <td className="py-4 px-6 text-xs">
                          <p className="font-bold text-slate-900">{apt.date}</p>
                          <p className="text-brand-600 font-semibold">{apt.time}</p>
                        </td>
                        <td className="py-4 px-6 font-extrabold text-slate-900">${apt.price}</td>
                        <td className="py-4 px-6">
                          <select
                            value={apt.status}
                            onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                            className="text-xs font-bold rounded-lg px-2.5 py-1.5 border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-brand-500"
                          >
                            <option value="Pending">⏳ Pending</option>
                            <option value="Confirmed">✓ Confirmed</option>
                            <option value="Completed">🎉 Completed</option>
                            <option value="Cancelled">✕ Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteAppointment(apt._id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Appointment Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. PROVIDERS TAB */}
        {activeTab === 'providers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((prov) => (
              <div
                key={prov._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={prov.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={prov.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                        {prov.category}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base mt-1">{prov.name}</h3>
                      <p className="text-xs text-slate-500 truncate">{prov.specialty}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4">{prov.description}</p>

                  <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
                    <p className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium text-slate-800">{prov.location || 'Downtown'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Hours:</span>
                      <span className="font-medium text-slate-800">
                        {prov.workingHours?.start || '09:00 AM'} - {prov.workingHours?.end || '06:00 PM'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-500">★ {prov.rating ? prov.rating.toFixed(1) : '5.0'}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setProviderModal({ open: true, mode: 'edit', data: prov })}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProvider(prov._id)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => (
              <div
                key={srv._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                      {srv.category}
                    </span>
                    <span className="text-lg font-extrabold text-slate-900">${srv.price}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{srv.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{srv.description}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                    <span>Duration: {srv.duration} mins</span>
                    <span>Provider: {srv.providerName || 'Assigned'}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setServiceModal({ open: true, mode: 'edit', data: srv })}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(srv._id)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. USERS TAB */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-200/80">
              <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user by name, email, phone..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Phone</th>
                    <th className="py-4 px-6">System Role</th>
                    <th className="py-4 px-6">Registered On</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/60">
                      <td className="py-4 px-6 font-bold text-slate-900">{u.name}</td>
                      <td className="py-4 px-6 text-slate-600 text-xs">{u.email}</td>
                      <td className="py-4 px-6 text-slate-600 text-xs">{u.phone || 'N/A'}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleUserRole(u._id, u.role)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-transform hover:scale-105 ${
                            u.role === 'admin'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                          title="Click to toggle user role"
                        >
                          {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {u._id !== user?._id && (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* PROVIDER CREATE/EDIT MODAL */}
      {providerModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                {providerModal.mode === 'create' ? 'Add New Provider' : 'Edit Provider'}
              </h3>
              <button
                onClick={() => setProviderModal({ open: false, mode: 'create', data: null })}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProvider} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Name</label>
                <input
                  name="name"
                  required
                  defaultValue={providerModal.data?.name || ''}
                  placeholder="e.g. Dr. Ahmed / Ali Hair Studio"
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={providerModal.data?.category || 'Barber'}
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                  >
                    <option value="Barber">Barber</option>
                    <option value="Clinic">Clinic</option>
                    <option value="Private Tutor">Private Tutor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Specialty</label>
                  <input
                    name="specialty"
                    required
                    defaultValue={providerModal.data?.specialty || ''}
                    placeholder="e.g. Master Barber / Dentist"
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={providerModal.data?.email || ''}
                    placeholder="provider@example.com"
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone</label>
                  <input
                    name="phone"
                    defaultValue={providerModal.data?.phone || ''}
                    placeholder="+1 555-0192"
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
                <input
                  name="location"
                  defaultValue={providerModal.data?.location || ''}
                  placeholder="Street / Suite Address"
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Image URL</label>
                <input
                  name="image"
                  defaultValue={providerModal.data?.image || ''}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description / Bio</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={providerModal.data?.description || ''}
                  placeholder="Professional background..."
                  className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setProviderModal({ open: false, mode: 'create', data: null })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-xs"
                >
                  Save Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SERVICE CREATE/EDIT MODAL */}
      {serviceModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                {serviceModal.mode === 'create' ? 'Add New Service' : 'Edit Service'}
              </h3>
              <button
                onClick={() => setServiceModal({ open: false, mode: 'create', data: null })}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Service Name</label>
                <input
                  name="name"
                  required
                  defaultValue={serviceModal.data?.name || ''}
                  placeholder="e.g. Classic Haircut / Calculus Tutoring"
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={serviceModal.data?.category || 'Barber'}
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                  >
                    <option value="Barber">Barber</option>
                    <option value="Clinic">Clinic</option>
                    <option value="Private Tutor">Private Tutor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Provider</label>
                  <select
                    name="providerId"
                    required
                    defaultValue={serviceModal.data?.providerId || (providers[0]?._id || '')}
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                  >
                    {providers.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Price ($)</label>
                  <input
                    name="price"
                    type="number"
                    min="1"
                    required
                    defaultValue={serviceModal.data?.price || 25}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duration (Mins)</label>
                  <input
                    name="duration"
                    type="number"
                    min="5"
                    step="5"
                    required
                    defaultValue={serviceModal.data?.duration || 30}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Image URL</label>
                <input
                  name="image"
                  defaultValue={serviceModal.data?.image || ''}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={serviceModal.data?.description || ''}
                  placeholder="Service details and what is included..."
                  className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setServiceModal({ open: false, mode: 'create', data: null })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-xs"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
