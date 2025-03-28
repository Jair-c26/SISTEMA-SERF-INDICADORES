import React from 'react';
import dispatchService from '../../../services/api/dispatches-list/dispatchesService';

const CreateDispatch = async (dispatchData) => {
    try {
        // Mapeo de los datos para que coincidan con la estructura de la API
        const dispatchPayload = {
            cod_despa: dispatchData.cod_despa,  // Código del despacho
            nombre_despacho: dispatchData.nombre_despacho,  // Nombre del despacho
            telefono: dispatchData.telefono,  // Teléfono
            ruc: dispatchData.ruc,  // Número de RUC
            dependencia_fk: dispatchData.dependencia_fk,  // ID de la dependencia relacionada
        };

        // Usar el servicio para crear el despacho
        const response = await dispatchService.createDispatch(dispatchPayload);
        return response;
    } catch (error) {
        console.error('Error al crear despacho:', error);
        throw error;
    }
};

export default CreateDispatch;
