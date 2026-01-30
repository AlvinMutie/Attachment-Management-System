import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('ams_user') || '{}');
    return user.token;
};

const apiClient = axios.create({
    baseURL: `${API_URL}/admin`
});

apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Student Management
 */
export const getStudents = (params) => apiClient.get('/students', { params });
export const createStudent = (data) => apiClient.post('/students', data);
export const bulkOnboardStudents = (formData) => apiClient.post('/students/bulk', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

/**
 * Supervisor Management
 */
export const getSupervisors = (params) => apiClient.get('/supervisors', { params });
export const assignSupervisor = (data) => apiClient.post('/assign-supervisor', data);

/**
 * Analytics & Reports
 */
export const getAnalytics = () => apiClient.get('/analytics');
export const downloadReport = () => apiClient.get('/report', { responseType: 'blob' });
