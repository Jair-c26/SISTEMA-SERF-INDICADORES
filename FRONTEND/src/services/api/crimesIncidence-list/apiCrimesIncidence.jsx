// apiCrimesIncidence.jsx
import axios from 'axios';

// Obtener el token de autenticación desde localStorage
const apiIp = import.meta.env.VITE_API;
console.log('API IP:', apiIp);

const apiCrimesIncidence = axios.create({
    baseURL: `http://${apiIp}/api/delitos`, // Base URL específica para /delitos
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token en los encabezados de las solicitudes
apiCrimesIncidence.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
        console.log('Token:', token);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.error('No token found in localStorage');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta
apiCrimesIncidence.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized - Invalid token');
        }
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default apiCrimesIncidence;
