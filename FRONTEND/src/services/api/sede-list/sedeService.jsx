// sedeService.jsx
import apiSede from './apiSede';

const sedeService = {
    getAllSedes: async () => {
        const response = await apiSede.get('/');
        return response.data;
    },

    getSedeById: async (id) => {
        const response = await apiSede.get(`/${id}`);
        return response.data;
    },

    createSede: async (sedeData) => {
        const response = await apiSede.post('/', sedeData);
        return response.data;
    },

    updateSede: async (id, sedeData) => {
        const response = await apiSede.put(`/${id}`, sedeData);
        return response.data;
    },

    deleteSede: async (id) => {
        const response = await apiSede.delete(`/${id}`);
        return response.data;
    },
};

export default sedeService;
