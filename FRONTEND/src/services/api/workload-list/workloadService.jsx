// Actualización en workloadService.jsx
import apiWorkload from './apiWorkload';

const workloadService = {
    getAllWorkloads: async () => {
        const response = await apiWorkload.get('/');
        return response.data;
    },

    // Actualización de la función para obtener los datos con los tres parámetros
    getWorkloadById: async (dispatchId, month, year) => {
        const response = await apiWorkload.get(`/${dispatchId}/${month}/${year}`);
        return response.data; // Asegúrate de que la API devuelva los datos correctos con los campos que necesitas
    },

    createWorkload: async (workloadData) => {
        const response = await apiWorkload.post('/', workloadData);
        return response.data;
    },

    updateWorkload: async (id, workloadData) => {
        const response = await apiWorkload.put(`/${id}`, workloadData);
        return response.data;
    },

    deleteWorkload: async (id) => {
        const response = await apiWorkload.delete(`/${id}`);
        return response.data;
    },
};

export default workloadService;
