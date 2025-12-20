// frontend/src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        // If user is not logged in, redirect to login page
        return <Navigate to="/login" />;
    }

    // If user is logged in, show the page they asked for
    return children;
};

export default ProtectedRoute;