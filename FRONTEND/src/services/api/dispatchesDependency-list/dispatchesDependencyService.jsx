import apiDispatchesDependency from './apiDispatchesDependency'; // Asegúrate de que esta importación sea correcta

const dispatchesDependencyService = {
    getDispatchesByDependency: async (dependencyId) => {
        const response = await apiDispatchesDependency.get(`/${dependencyId}/despachos`);
        return response.data; // Asegúrate de que este endpoint está funcionando correctamente
    },

    createDispatch: async (dependencyId, dispatchData) => {
        const response = await apiDispatchesDependency.post(`/${dependencyId}/despachos`, dispatchData);
        return response.data;
    },

    updateDispatch: async (dependencyId, dispatchId, dispatchData) => {
        const response = await apiDispatchesDependency.put(`/${dependencyId}/despachos/${dispatchId}`, dispatchData);
        return response.data;
    },

    deleteDispatch: async (dependencyId, dispatchId) => {
        const response = await apiDispatchesDependency.delete(`/${dependencyId}/despachos/${dispatchId}`);
        return response.data;
    },
};

export default dispatchesDependencyService;
