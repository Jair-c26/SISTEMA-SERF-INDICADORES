import apiLink from './apiLink';

const linkService = {
    // downloadFile recibe dos parámetros que se concatenan a la URL base
    downloadFile: async (param1, param2) => {
        const response = await apiLink.get(`/${param1}/${param2}`);
        return response.data;
    },
};

export default linkService;
