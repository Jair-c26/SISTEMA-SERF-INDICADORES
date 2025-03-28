import apiAreas from './apiAreas';

const areasService = {
    getAllAreas: async () => {
        const response = await apiAreas.get('/');
        return response.data;
    },

    getAreaById: async (id) => {
        const response = await apiAreas.get(`/${id}`);
        return response.data;
    },

    createArea: async (areaData) => {
        const response = await apiAreas.post('/', areaData);
        return response.data;
    },

    updateArea: async (id, areaData) => {
        const response = await apiAreas.put(`/${id}`, areaData);
        return response.data;
    },

    deleteArea: async (id) => {
        const response = await apiAreas.delete(`/${id}`);
        return response.data;
    },
};

export default areasService;
