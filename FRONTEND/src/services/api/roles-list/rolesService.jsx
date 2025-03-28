import apiRoles from './apiRoles';

const rolesService = {
    getAllRoles: async () => {
        const response = await apiRoles.get('/');
        return response.data;
    },

    getRoleById: async (id) => {
        const response = await apiRoles.get(`/${id}`);
        return response.data;
    },

    createRole: async (roleData) => {
        const response = await apiRoles.post('/', roleData);
        return response.data;
    },

    updateRole: async (id, roleData) => {
        const response = await apiRoles.put(`/${id}`, roleData);
        return response.data;
    },

    deleteRole: async (id) => {
        const response = await apiRoles.delete(`/${id}`);
        return response.data;
    },
};

export default rolesService;
