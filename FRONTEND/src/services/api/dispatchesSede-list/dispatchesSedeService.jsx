import apiDispatchesSede from './apiDispatchesSede';

const dispatchesSedeService = {
    getDependenciesBySede: async (sedeId) => {
        const response = await apiDispatchesSede.get(`/${sedeId}/dependencias`);
        return response.data;
    },

    createDependency: async (sedeId, dependencyData) => {
        const response = await apiDispatchesSede.post(`/${sedeId}/dependencias`, dependencyData);
        return response.data;
    },

    updateDependency: async (sedeId, dependencyId, dependencyData) => {
        const response = await apiDispatchesSede.put(`/${sedeId}/dependencias/${dependencyId}`, dependencyData);
        return response.data;
    },

    deleteDependency: async (sedeId, dependencyId) => {
        const response = await apiDispatchesSede.delete(`/${sedeId}/dependencias/${dependencyId}`);
        return response.data;
    },
};

export default dispatchesSedeService;
