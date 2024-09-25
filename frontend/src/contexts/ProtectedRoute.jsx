// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const { user } = useAuth();

    return user ? Component : <Navigate to="/login" />;
};

export default ProtectedRoute;
