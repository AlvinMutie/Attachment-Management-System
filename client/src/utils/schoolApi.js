import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('ams_user') || '{}');
    return user.token;
};

// Create axios instance with auth header
const apiClient = axios.create({
    baseURL: `${API_URL}/school`
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Get current school details
 */
export const getMySchool = async () => {
    const response = await apiClient.get('/my-school');
    return response.data;
};

/**
 * Update my school (Branding, Logo, etc.)
 */
export const updateMySchool = async (data) => {
    const response = await apiClient.put('/my-school', data);
    return response.data;
};
