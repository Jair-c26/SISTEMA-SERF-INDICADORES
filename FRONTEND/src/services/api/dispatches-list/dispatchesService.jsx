import apiDispatches from './apiDispatches';

const dispatchesService = {
  getAllDispatches: async () => {
    const response = await apiDispatches.get('/');
    return response.data;
  },

  getDispatchesByDependency: async (dependencyId) => {
    const response = await apiDispatches.get('/');
    const allDispatches = response.data?.data || [];
    const filteredDispatches = allDispatches.filter(
      (dispatch) => dispatch.dependencia_fk?.id === dependencyId
    );
    return { data: filteredDispatches };
  },

  getDispatchById: async (id) => {
    const response = await apiDispatches.get(`/${id}`);
    return response.data;
  },

  createDispatch: async (dispatchData) => {
    const response = await apiDispatches.post('/', dispatchData);
    return response.data;
  },

  updateDispatch: async (id, dispatchData) => {
    const response = await apiDispatches.put(`/${id}`, dispatchData);
    return response.data;
  },

  deleteDispatch: async (id) => {
    const response = await apiDispatches.delete(`/${id}`);
    return response.data;
  },
};

export default dispatchesService;
