import React, { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography } from '@mui/material';
import StatisticalFunctions from '../StatisticalFunctions/StatisticalFunctions';
import workloadService from '../../../services/api/workload-list/workloadService';

const DispatchCardList = ({ navigate, dependencyId }) => {
  console.log("datos id depencia:", dependencyId)
  const [workloadData, setWorkloadData] = useState(null); // Estado inicial como null
  const [error, setError] = useState(null);
  const month = 12; // Mes requerido (ajusta el valor o comentario según corresponda)
  const year = 2024; // Año fijo, o dinámico si es necesario

  const fetchWorkloadData = async (id) => {
    try {
      setError(null); // Resetear el error antes de cada llamada
      const response = await workloadService.getWorkloadById(id, month, year);
      const data = response.data;
      setWorkloadData({
        nombre_fiscalia: data?.dependencia?.nombre_fiscalia || 'No disponible',
        grafico_linea: data?.grafico_linea || [],
        cantidad_casos: data?.cantidad_casos || {
          total_resueltos_historicos: 0,
          total_ingresados: 0,
          total_tramites_historicos: 0,
        },
        porcentajes_circulo: data?.porcentajes_circulo || [],
        productividad_fiscal: data?.productividad_fiscal || {},
        despachos: data?.despachos || [],
      });
    } catch (err) {
      console.error('Error fetching workload data:', err);
      setError('Error al cargar los datos.');
    }
  };

  useEffect(() => {
    if (dependencyId) {
      fetchWorkloadData(dependencyId);
    }
  }, [dependencyId]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!workloadData) {
    return <Typography>Cargando datos...</Typography>;
  }

  return (
    <div>
      {workloadData.despachos.map((despacho) => (
        <Accordion key={despacho.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{despacho.nombre_despacho}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <StatisticalFunctions
              reports={[
                { title: 'CARGA LABORAL', value: 15 },
                { title: 'CONTROL DE PLAZOS', value: 30 },
                { title: 'DELITOS CON MAYOR INCIDENCIA', value: 120 },
              ]}
              workloadData={[workloadData]} 
              navigate={navigate}
              dependencyId={dependencyId}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default DispatchCardList;
