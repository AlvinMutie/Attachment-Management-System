import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('ams_user') || '{}');
    return user.token;
};

const apiClient = axios.create({
    baseURL: `${API_URL}/meetings`
});

apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const createMeeting = (data) => apiClient.post('/', data);
export const getMeetings = () => apiClient.get('/');
export const respondToMeeting = (id, status, note, proposal) => apiClient.patch(`/${id}/respond`, {
    status,
    responseNote: note,
    rescheduleProposal: proposal
});
