import axios from 'axios';

const API_BASE = '/api/coordinator';

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
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        }
    };
};

export const coordinatorApi = {
    getDashboard: async () => {
        const res = await axios.get(`${API_BASE}/dashboard`, getAuthHeaders());
        return res.data;
    },

    getAttentionQueue: async () => {
        const res = await axios.get(`${API_BASE}/attention-queue`, getAuthHeaders());
        return res.data;
    },

    getPlacements: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await axios.get(`${API_BASE}/placements?${query}`, getAuthHeaders());
        return res.data;
    },

    getPlacementById: async (id) => {
        const res = await axios.get(`${API_BASE}/placements/${id}`, getAuthHeaders());
        return res.data;
    },

    assignSupervisor: async (data) => {
        const res = await axios.post(`${API_BASE}/assign-supervisor`, data, getAuthHeaders());
        return res.data;
    },

    reassignSupervisor: async (data) => {
        const res = await axios.put(`${API_BASE}/reassign-supervisor`, data, getAuthHeaders());
        return res.data;
    },

    getSupervisors: async () => {
        const res = await axios.get(`${API_BASE}/supervisors`, getAuthHeaders());
        return res.data;
    },

    getOrganizations: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await axios.get(`${API_BASE}/organizations?${query}`, getAuthHeaders());
        return res.data;
    },

    createOrganization: async (data) => {
        const res = await axios.post(`${API_BASE}/organizations`, data, getAuthHeaders());
        return res.data;
    },

    getAcademicOverview: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await axios.get(`${API_BASE}/academic-overview?${query}`, getAuthHeaders());
        return res.data;
    },

    getCompletionReadiness: async () => {
        const res = await axios.get(`${API_BASE}/completion-readiness`, getAuthHeaders());
        return res.data;
    },

    getSupervisionOversight: async () => {
        const res = await axios.get(`${API_BASE}/supervision`, getAuthHeaders());
        return res.data;
    }
};
