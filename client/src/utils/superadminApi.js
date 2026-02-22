import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('ams_user') || '{}');
    return user.token;
};

// Create axios instance with auth header
const apiClient = axios.create({
    baseURL: `${API_URL}/superadmin`
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Dashboard
export const getDashboardAnalytics = async () => {
    const response = await apiClient.get('/dashboard');
    return response.data;
};

// Schools
export const getSchools = async (params = {}) => {
    const response = await apiClient.get('/schools', { params });
    return response.data;
};

export const createSchool = async (data) => {
    const response = await apiClient.post('/schools', data);
    return response.data;
};

export const updateSchool = async (id, data) => {
    const response = await apiClient.put(`/schools/${id}`, data);
    return response.data;
};

export const toggleSchoolStatus = async (id, status) => {
    const response = await apiClient.patch(`/schools/${id}/status`, { status });
    return response.data;
};

export const resetSchoolAdminPassword = async (id) => {
    const response = await apiClient.post(`/schools/${id}/reset-admin-password`);
    return response.data;
};

// Users
export const getUsers = async (params = {}) => {
    const response = await apiClient.get('/users', { params });
    return response.data;
};

export const updateUserRole = async (id, role) => {
    const response = await apiClient.patch(`/users/${id}/role`, { role });
    return response.data;
};

export const resetPassword = async (id) => {
    const response = await apiClient.post(`/users/${id}/reset-password`);
    return response.data;
};

export const lockUser = async (id, locked) => {
    const response = await apiClient.patch(`/users/${id}/lock`, { locked });
    return response.data;
};

export const resetPasswordDirect = async (id, newPassword) => {
    const response = await apiClient.post(`/users/${id}/reset-password-direct`, { newPassword });
    return response.data;
};

// Also reuse the exact impersonate logic we added to the theOne feature previously.
export const impersonateUser = async (id) => {
    // The previous implementation mapped this route under /api/the-one/impersonate
    // I need to use the full axios instance to make a cross-controller call since it wasn't moved to superadmin.
    // Let me check if the route is still there. Wait I should move the route to superadmin.

    // For now I'll use the apiClient which targets /superadmin
    const response = await apiClient.post(`/users/${id}/impersonate`);
    return response.data;
};

// Audit Logs
export const getAuditLogs = async (params = {}) => {
    const response = await apiClient.get('/audit-logs', { params });
    return response.data;
};

// System Health
export const getSystemHealth = async () => {
    const response = await apiClient.get('/system-health');
    return response.data;
};
