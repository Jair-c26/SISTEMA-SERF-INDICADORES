// CreateDependency.jsx
import React from 'react';
import dependencyService from '../../../services/api/dependency-list/dependencyService';

const CreateDependency = async (dependencyData) => {
    try {
        // Mapeo de los datos para que coincidan con la estructura de la API
        const dependencyPayload = {
            cod_depen: dependencyData.cod_depen,  // Código de la dependencia
            fiscalia: dependencyData.fiscalia,  // Nombre completo de la fiscalía
            tipo_fiscalia: dependencyData.tipo_fiscalia,  // Tipo de fiscalía
            nombre_fiscalia: dependencyData.nombre_fiscalia,  // Nombre específico de la fiscalía
            ruc: dependencyData.ruc,  // Número de RUC
            telefono: dependencyData.telefono,  // Nuevo campo teléfono
            sede_fk: dependencyData.sede_fk,  // ID de la sede relacionada
        };

        // Usar el servicio para crear la dependencia
        const response = await dependencyService.createDependency(dependencyPayload);
        return response;
    } catch (error) {
        console.error('Error al crear dependencia:', error);
        throw error;
    }
};

export default CreateDependency;
