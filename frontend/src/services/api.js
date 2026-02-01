import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't redirect on 401 for auth endpoints (login/register)
        const isAuthEndpoint = error.config?.url?.includes('/auth/login') ||
            error.config?.url?.includes('/auth/register');

        if (error.response?.status === 401 && !isAuthEndpoint) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

// Services API
export const servicesAPI = {
    getAll: (params) => api.get('/services', { params }),
    getById: (id) => api.get(`/services/${id}`),
    create: (data) => api.post('/services', data),
    update: (id, data) => api.put(`/services/${id}`, data),
    delete: (id) => api.delete(`/services/${id}`),
    getMyServices: () => api.get('/services/user/my-services'),
};

// Pervoja (Experience) API
export const pervojaAPI = {
    getMy: () => api.get('/pervoja/my'),
    getByUser: (userId) => api.get(`/pervoja/user/${userId}`),
    create: (data) => api.post('/pervoja', data),
    update: (id, data) => api.put(`/pervoja/${id}`, data),
    delete: (id) => api.delete(`/pervoja/${id}`),
};

// Reviews API
export const reviewsAPI = {
    getByService: (serviceId) => api.get(`/reviews/service/${serviceId}`),
    create: (data) => api.post('/reviews', data),
    update: (id, data) => api.put(`/reviews/${id}`, data),
    delete: (id) => api.delete(`/reviews/${id}`),
};

// Search API
export const searchAPI = {
    search: (params) => api.get('/search', { params }),
    suggestions: (q) => api.get('/search/suggestions', { params: { q } }),
    filters: () => api.get('/search/filters'),
};

// Admin API
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    getVisitors: (period) => api.get('/admin/visitors', { params: { period } }),
    getUsers: () => api.get('/admin/users'),
    getServices: () => api.get('/admin/services'),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    deleteService: (id) => api.delete(`/admin/services/${id}`),
};

// Messages API
export const messagesAPI = {
    getConversations: () => api.get('/messages/conversations'),
    getMessages: (userId) => api.get(`/messages/${userId}`),
    sendMessage: (data) => api.post('/messages', data),
    markAsRead: (userId) => api.put(`/messages/read/${userId}`),
    getUnreadCount: () => api.get('/messages/unread/count'),
};

export default api;
