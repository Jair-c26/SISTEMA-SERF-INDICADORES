// dependencyService.jsx
import apiDependency from './apiDependency';

const dependencyService = {
    getAllDependencies: async () => {
        const response = await apiDependency.get('/');
        return response.data;
    },

    getDependencyById: async (id) => {
        const response = await apiDependency.get(`/${id}`);
        return response.data;
    },

    createDependency: async (dependencyData) => {
        const response = await apiDependency.post('/', dependencyData);
        return response.data;
    },

    updateDependency: async (id, dependencyData) => {
        const response = await apiDependency.put(`/${id}`, dependencyData);
        return response.data;
    },

    deleteDependency: async (id) => {
        const response = await apiDependency.delete(`/${id}`);
        return response.data;
    },
};

export default dependencyService;
