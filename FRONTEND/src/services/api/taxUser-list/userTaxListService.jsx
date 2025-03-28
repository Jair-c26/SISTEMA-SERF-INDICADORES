import apiTaxUsers from './apiTaxUsers';

const userTaxListService = {
    getAllTaxUsers: async () => {
        const response = await apiTaxUsers.get('');
        return response.data;
    },

    getTaxUserById: async (id) => {
        const response = await apiTaxUsers.get(`/${id}`);
        return response.data;
    },

    createTaxUser: async (taxUserData) => {
        // Convertir el objeto taxUserData a FormData
        const formData = new FormData();
        Object.keys(taxUserData).forEach(key => {
            if (taxUserData[key] !== null && taxUserData[key] !== undefined) {
                formData.append(key, taxUserData[key]);
            }
        });

        const response = await apiTaxUsers.post('', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateTaxUser: async (id, taxUserData) => {
        const response = await apiTaxUsers.put(`/${id}`, taxUserData);
        return response.data;
    },

    deleteTaxUser: async (id) => {
        const response = await apiTaxUsers.delete(`/${id}`);
        return response.data;
    },
};

export default userTaxListService;
