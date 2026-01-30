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
