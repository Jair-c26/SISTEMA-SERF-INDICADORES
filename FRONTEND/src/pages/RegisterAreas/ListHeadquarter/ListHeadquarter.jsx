import React, { useState, useEffect } from 'react';
import sedeService from '../../../services/api/sede-list/sedeService';
import RegisterAreasDataGrid from '../../../components/RegisterAreasDataGrid/RegisterAreasDataGrid';

const ListHeadquarter = ({ onEditRow }) => {
  const [headquarters, setHeadquarters] = useState([]);
  const [loading, setLoading] = useState(true);

  const columnsConfig = [
    { field: 'nombre', headerName: 'Nombre Sede', flex: 1, sortable: false },
    { field: 'provincia', headerName: 'Provincia', flex: 1, sortable: false },
    { field: 'activo', headerName: 'activo', flex: 1, sortable: false },
    { field: 'distrito_fiscal', headerName: 'Distrito Fiscal', flex: 1, sortable: false },
    { field: 'codigo_postal', headerName: 'Código Postal', flex: 1, sortable: false },
  ];

  useEffect(() => {
    const fetchHeadquarters = async () => {
      setLoading(true);
      try {
        const sedeData = await sedeService.getAllSedes();
        setHeadquarters(sedeData.data || []);
      } catch (error) {
        console.error('Error al obtener las sedes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeadquarters();
  }, []);

  const handleDeleteSede = async (id) => {
    console.log("ID para eliminar:", id);
    try {
      await sedeService.deleteSede(id);
      setHeadquarters((prev) => prev.filter((sede) => sede.id !== id));
    } catch (error) {
      console.error('Error al eliminar la sede:', error.response?.data || error.message);
    }
  };

  return (
    <div>
      <RegisterAreasDataGrid
        columnsConfig={columnsConfig}
        title="Lista de Sedes"
        rows={headquarters}
        loading={loading}
        onDeleteRow={handleDeleteSede}
        onEditRow={onEditRow}
      />
    </div>
  );
};

export default ListHeadquarter;
