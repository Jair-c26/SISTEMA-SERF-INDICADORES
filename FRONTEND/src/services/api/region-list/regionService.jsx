// regionService.jsx
import apiRegion from './apiRegion';

const regionService = {
    getAllRegions: async () => {
        const response = await apiRegion.get('/');
        return response.data;
    },

    getRegionById: async (id) => {
        const response = await apiRegion.get(`/${id}`);
        return response.data;
    },

    createRegion: async (regionData) => {
        const response = await apiRegion.post('/', regionData);
        return response.data;
    },

    updateRegion: async (id, regionData) => {
        const response = await apiRegion.put(`/${id}`, regionData);
        return response.data;
    },

    deleteRegion: async (id) => {
        const response = await apiRegion.delete(`/${id}`);
        return response.data;
    },
};

export default regionService;
