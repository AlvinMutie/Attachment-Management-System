import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('ams_user') || '{}');
    return user.token;
};

const apiClient = axios.create({
    baseURL: `${API_URL}/university`
});

apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getUniversityWorkspace = () => apiClient.get('/workspace');
export const getMyStudents = () => apiClient.get('/my-students');
export const getStudentOverview = (id) => apiClient.get(`/student/${id}/overview`);
export const getUniversityAssessments = () => apiClient.get('/assessments');
export const submitUniversityAssessment = (data) => apiClient.post('/assessments', data);
