import React, { useEffect, useState } from 'react';
import OptionListCard from '../../../../components/OptionListCard/OptionListCard';
import sedeSVG from '../../../../assets/icons/sede.svg';
import Box from '@mui/material/Box';
import areasService from '../../../../services/api/areas-list/AreasService';
import { useAuth } from '../../../../context/AuthContext';

const AdditionalData = () => {
  const { userFormData, setUserFormData } = useAuth();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSede, setSelectedSede] = useState(null);
  const [selectedDependencia, setSelectedDependencia] = useState(null);
  const [selectedDespacho, setSelectedDespacho] = useState(null); // Agregar estado para el despacho

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await areasService.getAllAreas();
        if (response && response.data) {
          setAreas(response.data);
        }
      } catch (error) {
        console.error('Error fetching areas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  const handleSedeChange = (value) => {
    setSelectedSede(value);
    setSelectedDependencia(null);
    setSelectedDespacho(null); // Resetear despacho cuando se cambie la sede
    
  };

  const handleDependenciaChange = (value) => {
    setSelectedDependencia(value);
    setSelectedDespacho(null); // Resetear despacho cuando se cambie la dependencia
    
  };

  const handleDespachoChange = (value) => {
    setSelectedDespacho(value);
    setUserFormData({ ...userFormData, despacho_fk: value }); // Solo almacenar despacho_fk
  };

  const cardData = [
    {
      icon: sedeSVG,
      primaryText: 'SELECCIONE SEDE',
      secondaryText: 'VISTA GENERAL',
      checkboxItems: areas.map((area) => ({ text: area.nombre, value: area.id })),
      necessaryValue: '11',
      onChange: handleSedeChange,
    },
    {
      icon: sedeSVG,
      primaryText: 'SELECCIONE DEPENDENCIA',
      secondaryText: 'VISTA GENERAL',
      checkboxItems: selectedSede
        ? areas.find((area) => area.id === selectedSede)?.dependencias.map((dep) => ({
            text: dep.nombre_fiscalia,
            value: dep.id,
        })) : [],
      necessaryValue: '5',
      onChange: handleDependenciaChange,
    },
    {
      icon: sedeSVG,
      primaryText: 'SELECCIONE DESPACHO',
      secondaryText: 'VISTA GENERAL',
      checkboxItems: selectedDependencia
        ? areas.flatMap((area) =>
            area.dependencias
                .filter((dep) => dep.id === selectedDependencia)
                .flatMap((dep) => dep.despachos.map((despacho) => ({
                    text: despacho.nombre_despacho,
                    value: despacho.id,
                })))
        ) : [],
      necessaryValue: '5',
      onChange: handleDespachoChange, // Solo manejar despacho
    },
  ];

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {cardData.map((data, index) => (
        <OptionListCard
          key={index}
          icon={data.icon}
          primaryText={data.primaryText}
          secondaryText={data.secondaryText}
          checkboxItems={data.checkboxItems}
          necessaryValue={data.necessaryValue}
          onChange={data.onChange}
        />
      ))}
    </Box>
  );
};

export default AdditionalData;
