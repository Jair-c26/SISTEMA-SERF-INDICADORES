import axios from 'axios';

// Obtener la dirección IP de la API desde las variables de entorno
const apiIp = import.meta.env.VITE_API;
console.log('API IP:', apiIp);

const apiAreas = axios.create({
    baseURL: `http://${apiIp}/api/ges_areas/lista-areas`, // Base URL específica para /lista-areas
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token en los encabezados de las solicitudes
apiAreas.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
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
apiAreas.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized - Invalid token');
        }
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default apiAreas;
