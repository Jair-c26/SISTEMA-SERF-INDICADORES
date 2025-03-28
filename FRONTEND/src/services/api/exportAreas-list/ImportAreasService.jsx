import apiImportAreas from './apiImportAreas';

const ImportAreasService = {
    exportAreas: async (file) => {
        const formData = new FormData();
        formData.append('file', file); // Asegúrate de que el campo coincide con lo que espera la API
        console.log([...formData.entries()]); // Para verificar el contenido del FormData
        
        const response = await apiImportAreas.post('/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

export default ImportAreasService;
