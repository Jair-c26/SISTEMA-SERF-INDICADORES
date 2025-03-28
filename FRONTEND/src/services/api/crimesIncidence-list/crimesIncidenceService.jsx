// crimesIncidenceService.jsx
import apiCrimesIncidence from './apiCrimesIncidence';

const crimesIncidenceService = {
    // Obtener incidencia de delitos con tres parámetros
    getCrimeIncidence: async (crimeId, month, year) => {
        const response = await apiCrimesIncidence.get(`/${crimeId}/${month}/${year}`);
        return response.data;
    },

    // Crear una nueva incidencia de delito
    createCrimeIncidence: async (crimeData) => {
        const response = await apiCrimesIncidence.post('/', crimeData);
        return response.data;
    },

    // Actualizar una incidencia de delito existente
    updateCrimeIncidence: async (id, crimeData) => {
        const response = await apiCrimesIncidence.put(`/${id}`, crimeData);
        return response.data;
    },

    // Eliminar una incidencia de delito
    deleteCrimeIncidence: async (id) => {
        const response = await apiCrimesIncidence.delete(`/${id}`);
        return response.data;
    },
};

export default crimesIncidenceService;
