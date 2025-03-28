import axios from 'axios';

const apiIp = import.meta.env.VITE_API;

// Configuración base mejorada con seguridad adicional
const apiLogin = axios.create({
  baseURL: `http://${apiIp}/api/login`,
  timeout: 30000,  // Reducido para mejor UX
  withCredentials: true,  // Para cookies HTTP-Only
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' // Prevención básica CSRF
  }
});

// Interceptor de solicitudes para seguridad
apiLogin.interceptors.request.use(config => {
  // Eliminar tokens residuales
  if (!config.url.includes('/login')) {
    config.headers.Authorization = '';
  }
  return config;
});

// Interceptor de respuestas para manejo centralizado de errores
apiLogin.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/login?session_expired=true';
    }
    if (import.meta.env.DEV) {
      console.error('Error de API:', error.config.url, error.response?.data);
    }
    return Promise.reject(error);
  }
);

export default apiLogin;