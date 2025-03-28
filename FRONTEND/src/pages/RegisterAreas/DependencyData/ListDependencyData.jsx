import React, { useState, useEffect } from 'react';
import dependencyService from '../../../services/api/dependency-list/dependencyService';  // Servicio para dependencias
import RegisterAreasDataGrid from '../../../components/RegisterAreasDataGrid/RegisterAreasDataGrid';

const ListDependencyData = ({ onEditRow, onDeleteRow }) => {
    const [dependencies, setDependencies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Configuración de las columnas para la data grid
    const columnsConfig = [
        { field: 'fiscalia', headerName: 'Fiscalía', flex: 1 },
        { field: 'nombre_fiscalia', headerName: 'Nombre Fiscalía', flex: 1 },
        { field: 'nombre_sede', headerName: 'Sede', flex: 1 },
    ];

    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const dependencyData = await dependencyService.getAllDependencies();
                console.log('Datos obtenidos de dependencias:', dependencyData);
                // Mapear los datos para agregar el nombre de la sede
                const processedDependencies = dependencyData.data.map(dependency => ({
                    ...dependency,
                    nombre_sede: dependency.sede_fk?.nombre || 'Sin nombre',
                }));
                setDependencies(processedDependencies);
            } catch (error) {
                console.error('Error al obtener las dependencias:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDependencies();
    }, []);

    return (
        <div>
            <RegisterAreasDataGrid
                columnsConfig={columnsConfig}
                title="Lista de Dependencias"
                rows={dependencies}
                loading={loading}
                onEditRow={onEditRow}
                onDeleteRow={onDeleteRow}
            />
        </div>
    );
};

export default ListDependencyData;
