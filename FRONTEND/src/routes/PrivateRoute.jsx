import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // Si no está autenticado, redirige a la página de login
    if (!isAuthenticated()) {
        return <Navigate to="/" />;
    }

    return children; // Si está autenticado, muestra la ruta
};

export default PrivateRoute;
