import axios from 'axios';
const apiIp = import.meta.env.VITE_API;

const apiTaxUsers = axios.create({
    baseURL: `http://${apiIp}/api/ges_fiscal/fiscal`,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token en los encabezados de las solicitudes
apiTaxUsers.interceptors.request.use(
    config => {
        const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.error('No token found in localStorage');
        }
        return config;
    },
    error => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
apiTaxUsers.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized - Invalid token');
        }
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default apiTaxUsers;
