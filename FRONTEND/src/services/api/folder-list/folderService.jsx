import apiFolder from './apiFolder';

const folderService = {
    getFolder: async () => {
        const response = await apiFolder.get('/');
        return response.data;
    },
};

export default folderService;
