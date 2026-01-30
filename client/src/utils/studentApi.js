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

export const submitLogbook = (formData) => {
    return apiClient.post('/logbooks', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getMyLogbooks = () => apiClient.get('/logbooks');

export const refineSummary = (summary) => apiClient.post('/logbooks/refine', { summary });
