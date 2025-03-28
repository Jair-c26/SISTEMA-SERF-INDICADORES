import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Estado unificado de autenticación
    const [authState, setAuthState] = useState(() => {
        const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
        const userData = JSON.parse(localStorage.getItem(import.meta.env.VITE_USER_DATA_KEY));
        return token && userData ? { token, user: userData } : null;
    });

    // Estados adicionales de la aplicación
    const [workloadData, setWorkloadData] = useState(null);
    const [dependencyId, setDependencyId] = useState(null);
    
    // Función de fecha actual (sin cambios)
    const getCurrentDate = () => new Date().toISOString().split('T')[0];

    // Datos del formulario (sin cambios)
    const [userFormData, setUserFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        dni: '',
        sexo: '',
        direccion: '',
        fecha_nacimiento: '',
        foto_perfil: null,
        extension: '',
        tipo_fiscal: '',
        activo: '1',
        fecha_ingreso: getCurrentDate(),
        password: '',
        password_confirmation: '',
        estado: '1',
        fiscal_fk: null,
        roles_fk: 'null',  // Cambiado de [] a null
        despacho_fk: 'null',  // Solo almacenamos despacho_fk
    });

    // Login mejorado
    const login = ({ user, token }) => {
        localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY, token);
        localStorage.setItem(import.meta.env.VITE_USER_DATA_KEY, JSON.stringify(user));
        setAuthState({ token, user });
    };

    // Logout seguro
    const logout = () => {
        localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
        localStorage.removeItem(import.meta.env.VITE_USER_DATA_KEY);
        setAuthState(null);
        
        // Limpieza adicional de seguridad
        sessionStorage.clear();
        document.cookie.split(';').forEach(cookie => {
            const [name] = cookie.split('=');
            document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}`;
        });
    };

    // Verificación de autenticación
    const isAuthenticated = () => {
        return !!authState?.token && !!authState?.user;
    };

    return (
        <AuthContext.Provider
            value={{
                ...authState,
                login,
                logout,
                isAuthenticated,
                workloadData,
                setWorkloadData,
                userFormData: userFormData,
                setUserFormData,
                dependencyId,
                setDependencyId
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);