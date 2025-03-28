// services/api/areasService.jsx
import axios from 'axios';

const apiIp = import.meta.env.VITE_API;

const apiAreas = axios.create({
    baseURL: `http://${apiIp}/api/ges_areas`,
    timeout: 60000,
    headers: {'Content-Type': 'application/json'}
});

apiAreas.interceptors.request.use(config => {
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const getFullAreas = async () => {
    const response = await apiAreas.get('/lista-areas');
    return response.data.data; // Retorna array de sedes con estructura completa
};