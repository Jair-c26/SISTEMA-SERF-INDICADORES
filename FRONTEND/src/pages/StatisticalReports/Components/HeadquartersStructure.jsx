import React, { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HeadquartersCard from '../StructureCard/HeadquartersCard';
import DispatchCard from '../StructureCard/DispatchCard';
import { Typography } from '@mui/material';
import { getFullAreas } from '../../../services/api/areas-list/ListAreas/areasService';
const HeadquartersStructure = ({ navigate }) => {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getFullAreas();
        setSedes(data);
      } catch (error) {
        console.error('Error cargando áreas:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <Typography>Cargando estructura organizacional...</Typography>;

  return (
    <div>
      {sedes.map((sede) => (
        <Accordion key={sede.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <HeadquartersCard sede={sede} />
          </AccordionSummary>
          <AccordionDetails>
            {sede.dependencias?.map((dependencia) => (
              <div key={dependencia.id}>
                <DispatchCard
                  dispatch={{
                    title: dependencia.nombre_fiscalia,
                    value: dependencia.id,
                    despachos: dependencia.despachos
                  }}
                  navigate={navigate}
                />
              </div>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default HeadquartersStructure;