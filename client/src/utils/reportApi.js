import axios from 'axios';

const API_BASE = '/api/reports';

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

export const reportApi = {
    getPlacements: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await axios.get(`${API_BASE}/placements?${query}`, getAuthHeaders());
        return res.data;
    },

    getAttendance: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await axios.get(`${API_BASE}/attendance?${query}`, getAuthHeaders());
        return res.data;
    },

    getLogbooks: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await axios.get(`${API_BASE}/logbooks?${query}`, getAuthHeaders());
        return res.data;
    },

    getAssessments: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await axios.get(`${API_BASE}/assessments?${query}`, getAuthHeaders());
        return res.data;
    },

    getSupervisorWorkload: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await axios.get(`${API_BASE}/supervisor-workload?${query}`, getAuthHeaders());
        return res.data;
    },

    getOperationalAlerts: async () => {
        const res = await axios.get(`${API_BASE}/operational-alerts`, getAuthHeaders());
        return res.data;
    },

    downloadCSV: async (reportType, params = {}, defaultFilename = 'report.csv') => {
        const queryParams = { ...params, export: 'csv' };
        const query = new URLSearchParams(queryParams).toString();
        let token = localStorage.getItem('token');
        if (!token) {
            try {
                const user = JSON.parse(localStorage.getItem('ams_user'));
                token = user?.token;
            } catch (e) {}
        }

        const response = await axios.get(`${API_BASE}/${reportType}?${query}`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            },
            responseType: 'blob'
        });

        const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', defaultFilename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
};

export default reportApi;
