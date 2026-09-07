import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: `${API_URL}/supervisor`
});

// Request interceptor for token
apiClient.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('ams_user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export const getSupervisorWorkspace = () => apiClient.get('/workspace');
export const getAssignedStudents = () => apiClient.get('/students');
export const getLivePresence = () => apiClient.get('/presence');
export const getSupervisorLogbooks = (params) => apiClient.get('/logbooks', { params });
export const reviewLogbook = (id, data) => apiClient.put(`/logbooks/${id}/review`, data);
export const getSupervisorAttendance = (params) => apiClient.get('/attendance', { params });
export const markSupervisorAttendance = (data) => apiClient.post('/attendance/mark', data);
export const getSupervisorAssessments = () => apiClient.get('/assessments');
export const submitSupervisorAssessment = (data) => apiClient.post('/assessments', data);
