// CreateHeadquarters.jsx
import React from 'react';
import sedeService from '../../../services/api/sede-list/sedeService';

const CreateHeadquarters = async (headquarterData) => {
    try {
        // Mapeo de los datos para que coincidan con la estructura de la API
        const sedePayload = {
            cod_sede: headquarterData.codSede,  // Campo cod_sede agregado
            nombre: headquarterData.name,
            telefono: headquarterData.phone,
            ruc: headquarterData.ruc,
            provincia: headquarterData.province,
            distrito_fiscal: headquarterData.distrito_fiscal,  // Usar distrito_fiscal
            codigo_postal: headquarterData.postalCode,
            regional_fk: headquarterData.selectedRegion,  // Aquí el ID de la región
        };

        // Usar el servicio para crear la sede
        const response = await sedeService.createSede(sedePayload);
        return response;
    } catch (error) {
        console.error('Error al crear sede:', error);
        throw error;
    }
};

export default CreateHeadquarters;
