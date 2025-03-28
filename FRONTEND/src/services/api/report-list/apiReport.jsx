// apiReport.jsx
import axios from 'axios';

const apiIp = import.meta.env.VITE_API;
console.log('API IP:', apiIp);

const apiReport = axios.create({
    baseURL: `http://${apiIp}/api/reporte-carga-fiscal`, // Base URL específica para /reporte-carga-fiscal
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejar errores de respuesta
apiReport.interceptors.response.use(
    (response) => {
        if (response.headers['content-type'] === 'application/pdf') {
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            return { ...response, url };
        }
        return response;
    },
    (error) => Promise.reject(error)
);


export default apiReport;
