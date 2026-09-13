import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: `${API_URL}/messages`
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use((config) => {
    try {
        const user = JSON.parse(localStorage.getItem('ams_user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    } catch (e) {
        console.error('Error parsing token for message API:', e);
    }
    return config;
});

export const getContacts = () => apiClient.get('/contacts');
export const getMessages = (contactId) => apiClient.get(`/${contactId}`);
export const sendMessage = (data) => apiClient.post('', data);
export const markAsRead = (senderId) => apiClient.put(`/${senderId}/read`);

export default apiClient;
