// fileFolderService.jsx
import apiFileFolder from './apiFileFolder';

const fileFolderService = {
    getFiles: async () => {
        const response = await apiFileFolder.get('/');
        return {
            ...response,
            data: response.data.data // Access nested data array
        };
    }
};

export default fileFolderService;
