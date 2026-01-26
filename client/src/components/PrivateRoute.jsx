import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
    // PREVIEW MODE: Bypassing auth check so user can see dashboards without database
    return children;
};

export default PrivateRoute;
