import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuth = () => useContext(AuthContext);

// Helper to apply institutional theme
export const applyTheme = (color) => {
    if (!color) return;

    // Hex to RGB converter for variants
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const rgb = hexToRgb(color);
    if (rgb) {
        document.documentElement.style.setProperty('--brand-primary', color);
        document.documentElement.style.setProperty('--brand-primary-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
        document.documentElement.style.setProperty('--brand-primary-subtle', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`);
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('ams_user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
            if (parsedUser.schoolPrimaryColor) {
                applyTheme(parsedUser.schoolPrimaryColor);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('ams_user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;

            if (userData.schoolPrimaryColor) {
                applyTheme(userData.schoolPrimaryColor);
            }

            return userData;
        } catch (error) {
            throw error.response ? error.response.data : { message: 'Network error' };
        }
    };

    const demoLogin = (role) => {
        const demoUser = {
            id: 'demo-id',
            name: `Demo ${role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
            email: `${role}@demo.com`,
            role: role,
            token: 'demo-token'
        };
        setUser(demoUser);
        localStorage.setItem('ams_user', JSON.stringify(demoUser));
        return demoUser;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ams_user');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, demoLogin, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
