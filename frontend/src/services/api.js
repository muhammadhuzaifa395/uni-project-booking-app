const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Auth
  register: (payload) =>
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(handleResponse),

  login: (payload) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(handleResponse),

  getMe: () =>
    fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    }).then(handleResponse),

  // Providers
  getProviders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/providers${query ? `?${query}` : ''}`).then(handleResponse);
  },

  getProviderById: (id) =>
    fetch(`${API_BASE}/providers/${id}`).then(handleResponse),

  createProvider: (payload) =>
    fetch(`${API_BASE}/providers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    }).then(handleResponse),

  updateProvider: (id, payload) =>
    fetch(`${API_BASE}/providers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    }).then(handleResponse),

  deleteProvider: (id) =>
    fetch(`${API_BASE}/providers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(handleResponse),

  // Services
  getServices: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/services${query ? `?${query}` : ''}`).then(handleResponse);
  },

  getServiceById: (id) =>
    fetch(`${API_BASE}/services/${id}`).then(handleResponse),

  createService: (payload) =>
    fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    }).then(handleResponse),

  updateService: (id, payload) =>
    fetch(`${API_BASE}/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    }).then(handleResponse),

  deleteService: (id) =>
    fetch(`${API_BASE}/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(handleResponse),

  // Bookings
  getAvailableSlots: (providerId, date) =>
    fetch(`${API_BASE}/bookings/available-slots?providerId=${providerId}&date=${date}`).then(
      handleResponse
    ),

  createBooking: (payload) =>
    fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    }).then(handleResponse),

  getMyBookings: () =>
    fetch(`${API_BASE}/bookings/my-bookings`, {
      headers: getAuthHeaders()
    }).then(handleResponse),

  getAllBookings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/bookings${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders()
    }).then(handleResponse);
  },

  getBookingById: (id) =>
    fetch(`${API_BASE}/bookings/${id}`, {
      headers: getAuthHeaders()
    }).then(handleResponse),

  updateBookingStatus: (id, status) =>
    fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    }).then(handleResponse),

  deleteBooking: (id) =>
    fetch(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(handleResponse),

  // Users (Admin)
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/users${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders()
    }).then(handleResponse);
  },

  updateUserRole: (id, role) =>
    fetch(`${API_BASE}/users/${id}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role })
    }).then(handleResponse),

  deleteUser: (id) =>
    fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(handleResponse),

  // Admin Stats
  getAdminStats: () =>
    fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    }).then(handleResponse)
};
