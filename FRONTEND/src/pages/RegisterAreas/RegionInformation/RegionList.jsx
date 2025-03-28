import React, { useEffect, useState } from 'react';
import regionService from '../../../services/api/region-list/regionService';

const RegionList = ({ children }) => {
    const [regions, setRegions] = useState([]);

    // useEffect para cargar las regiones al montar el componente
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const regionsData = await regionService.getAllRegions();
                console.log('Datos de regiones:', regionsData); // Log para inspeccionar los datos
                if (regionsData && Array.isArray(regionsData.data)) {
                    setRegions(regionsData.data); // Asigna el array que está dentro de 'data'
                } else {
                    console.error('La respuesta no es un array:', regionsData);
                    setRegions([]); // Asegura que se asigna un array vacío en caso de error
                }
                setLoading(false);  // Actualizar el estado para indicar que se han cargado las regiones
            } catch (error) {
                console.error('Error al cargar las regiones:', error);
                setRegions([]);  // En caso de error, también actualizar el estado
                setLoading(false);
            }
        };

        fetchRegions();
    }, []);


    return children(regions);
};

export default RegionList;
