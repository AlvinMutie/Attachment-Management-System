import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: `${API_URL}/student`
});

apiClient.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('ams_user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export const getStudentProfile = () => apiClient.get('/profile');
export const getStudentPlacement = () => apiClient.get('/placement');
export const updateStudentPlacement = (data) => apiClient.put('/placement', data);
export const getStudentProgress = () => apiClient.get('/progress');
export const getStudentAttendance = () => apiClient.get('/attendance');
export const recordCheckIn = (data = {}) => apiClient.post('/attendance/check-in', data);
export const getStudentAssessments = () => apiClient.get('/assessments');

export const submitLogbook = (formData) => {
    return apiClient.post('/logbooks', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getMyLogbooks = () => apiClient.get('/logbooks');
export const refineSummary = (summary) => apiClient.post('/logbooks/refine', { summary });
