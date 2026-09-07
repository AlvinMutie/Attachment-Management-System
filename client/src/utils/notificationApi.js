import axios from 'axios';

const API_BASE = '/api/notifications';

const getAuthHeaders = () => {
    let token = localStorage.getItem('token');
    if (!token) {
        try {
            const user = JSON.parse(localStorage.getItem('ams_user'));
            token = user?.token;
        } catch (e) {}
    }
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    };
};

export const notificationApi = {
    getNotifications: async (page = 1, limit = 20, unreadOnly = false) => {
        const response = await axios.get(`${API_BASE}?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`, getAuthHeaders());
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await axios.get(`${API_BASE}/unread-count`, getAuthHeaders());
        return response.data;
    },

    markAsRead: async (id) => {
        const response = await axios.put(`${API_BASE}/${id}/read`, {}, getAuthHeaders());
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await axios.put(`${API_BASE}/read-all`, {}, getAuthHeaders());
        return response.data;
    }
};

export default notificationApi;
