import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_DEFINITIONS } from '../config/navigation';

const PrivateRoute = ({ children, roles }) => {
    const { user, loading, demoLogin } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Auto-initialize demo session if accessing a role route directly in preview/dev mode
    if (!user && roles && roles.length > 0) {
        const targetRole = roles[0];
        const demoUser = demoLogin(targetRole);
        if (demoUser) {
            return children;
        }
    }

    // If user is authenticated and roles are restricted, verify authorization
    if (user && roles && roles.length > 0 && !roles.includes(user.role)) {
        // Redirect to authorized default path for user's actual role
        const defaultPath = ROLE_DEFINITIONS[user.role]?.defaultPath || '/';
        return <Navigate to={defaultPath} replace />;
    }

    return children;
};

export default PrivateRoute;
