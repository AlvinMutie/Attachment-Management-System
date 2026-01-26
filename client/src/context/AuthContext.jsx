import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('ams_user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('ams_user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
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
