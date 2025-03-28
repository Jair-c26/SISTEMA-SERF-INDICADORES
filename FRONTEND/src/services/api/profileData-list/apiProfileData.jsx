import axios from 'axios';
const apiIp = import.meta.env.VITE_API;
// Configuración de la URL base para la API de perfiles
const apiProfileData = axios.create({
  baseURL: `http://${apiIp}/api/perfil`,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación a las solicitudes
apiProfileData.interceptors.request.use(
  config => {
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.error('No token found in localStorage');
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiProfileData.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized - Invalid token');
    }
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiProfileData;
