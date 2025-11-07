import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Token management
export function setToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}

// Auth API
export const auth = {
  signup: (data) => api.post('/api/auth/signup', data),
  login: (data) => api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
  logout: () => api.post('/api/auth/logout'),
  updateProfile: (data) => api.patch('/api/auth/profile', data),
  completeOnboarding: () => api.post('/api/auth/onboarding/complete'),
};

// Posts API
export const posts = {
  generate: (data) => api.post('/api/posts/generate', data),
  schedule: (data) => api.post('/api/posts/schedule', data),
  list: (params) => api.get('/api/posts', { params }),
  getById: (id) => api.get(`/api/posts/${id}`),
  update: (id, data) => api.patch(`/api/posts/${id}`, data),
  delete: (id) => api.delete(`/api/posts/${id}`),
};

// AI API
export const ai = {
  generateHooks: (data) => api.post('/api/ai/hooks', data),
  viralScore: (data) => api.post('/api/ai/viral-score', data),
  repurpose: (data) => api.post('/api/ai/repurpose', data),
};

// Accounts API
export const accounts = {
  connect: (data) => api.post('/api/accounts/connect', data),
  list: () => api.get('/api/accounts'),
  disconnect: (id) => api.delete(`/api/accounts/${id}`),
};

// Templates API
export const templates = {
  list: (params) => api.get('/api/templates', { params }),
  getById: (id) => api.get(`/api/templates/${id}`),
  purchase: (id) => api.post(`/api/templates/${id}/purchase`),
  create: (data) => api.post('/api/templates', data),
};

// Analytics API
export const analytics = {
  getPostAnalytics: (id) => api.get(`/api/analytics/post/${id}`),
  getDashboard: () => api.get('/api/analytics/dashboard'),
  sync: () => api.post('/api/analytics/sync'),
};

// Payments API
export const payments = {
  createCheckout: (data) => api.post('/api/payments/checkout', data),
  transactions: (params) => api.get('/api/payments/transactions', { params }),
};

// Referrals API
export const referrals = {
  getInfo: () => api.get('/api/referrals'),
  redeem: (code) => api.post('/api/referrals/redeem', { code }),
};

// Collaborations API
export const collaborations = {
  suggest: () => api.get('/api/collaborations/suggest'),
  list: (params) => api.get('/api/collaborations', { params }),
  update: (id, data) => api.patch(`/api/collaborations/${id}`, data),
};

export default api;
