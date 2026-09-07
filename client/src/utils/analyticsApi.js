import axios from 'axios';

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

export const analyticsApi = {
    // Institutional Overview
    getOverview: async () => {
        const res = await axios.get('/api/analytics/overview', getAuthHeaders());
        return res.data;
    },

    // Student Personal Analytics & Trend
    getStudentAnalytics: async (studentId = '') => {
        const url = studentId ? `/api/analytics/student/${studentId}` : '/api/analytics/student';
        const res = await axios.get(url, getAuthHeaders());
        return res.data;
    },

    // Supervisor Mentee Analytics
    getSupervisorAnalytics: async () => {
        const res = await axios.get('/api/analytics/supervisor', getAuthHeaders());
        return res.data;
    },

    // Data Quality Audit
    getDataQualityAudit: async () => {
        const res = await axios.get('/api/analytics/data-quality', getAuthHeaders());
        return res.data;
    },

    // Student Insights & Risk Score
    getStudentInsightsAndRisk: async (studentId = '') => {
        const url = studentId ? `/api/insights/student/${studentId}` : '/api/insights/student';
        const res = await axios.get(url, getAuthHeaders());
        return res.data;
    },

    // Institutional Intervention Queue
    getInterventionQueue: async () => {
        const res = await axios.get('/api/insights/queue', getAuthHeaders());
        return res.data;
    },

    // Model Governance Registry
    getModelRegistry: async () => {
        const res = await axios.get('/api/insights/models', getAuthHeaders());
        return res.data;
    }
};

export default analyticsApi;
