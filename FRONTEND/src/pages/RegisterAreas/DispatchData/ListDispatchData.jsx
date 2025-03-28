import React, { useState, useEffect } from 'react';
import dispatchesService from '../../../services/api/dispatches-list/dispatchesService'; // Servicio para despachos
import RegisterAreasDataGrid from '../../../components/RegisterAreasDataGrid/RegisterAreasDataGrid';

const ListDispatchData = ({ onEditRow, onDeleteRow }) => {
    const [dispatches, setDispatches] = useState([]);
    const [loading, setLoading] = useState(true);

    // Configuración de columnas para la data grid
    const columnsConfig = [
        { field: 'nombre_despacho', headerName: 'Nombre despacho', flex: 1 },
        { field: 'fiscalia', headerName: 'Dependencia', flex: 1 },
    ];

    useEffect(() => {
        const fetchDispatches = async () => {
            try {
                const dispatchData = await dispatchesService.getAllDispatches();
                // Se procesa la data para, por ejemplo, extraer datos de la dependencia
                // En este caso, asumimos que el campo "fiscalia" se extrae de dependencia_fk.fiscalia
                const processedDispatches = Array.isArray(dispatchData.data)
                    ? dispatchData.data.map(dispatch => ({
                          ...dispatch,
                          fiscalia: dispatch.dependencia_fk?.fiscalia || 'Sin dependencia',
                      }))
                    : [];
                setDispatches(processedDispatches);
            } catch (error) {
                console.error('Error al obtener los despachos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDispatches();
    }, []);

    return (
        <div>
            <RegisterAreasDataGrid
                columnsConfig={columnsConfig}
                title="Lista de Despachos"
                rows={dispatches}
                loading={loading}
                onEditRow={onEditRow}
                onDeleteRow={onDeleteRow}
            />
        </div>
    );
};

export default ListDispatchData;
