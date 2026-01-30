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

export const getLivePresence = () => apiClient.get('/presence');
