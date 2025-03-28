import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';  // Correcto
import TabList from '@mui/lab/TabList';        // Correcto
import TabPanel from '@mui/lab/TabPanel';      // Correcto
import RegisterDependencies from '../../pages/RegisterAreas/components/RegisterDependencies';
import RegisterHeadquarter from '../../pages/RegisterAreas/components/RegisterHeadquarter';
import RegisterDispatch from '../../pages/RegisterAreas/components/RegisterDispatch';
import sedesSVG from '../../assets/icons/sedes.svg';  // Importa el archivo SVG
import dependenciasSVG from '../../assets/icons/dependencias.svg';
import despachosSVG from '../../assets/icons/despachos.svg';

export default function TabsIcon() {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1', mt: 2 }}>
      <TabContext value={value}>
        <Box sx={{ borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="Opciones de Áreas" >
            <Tab
              sx={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '20px',
                marginRight: '20px',
                maxWidth: '200px',
                minWidth: '200px',
                textAlign: 'center',
                fontFamily: 'Teko, sans-serif',  // Font Teko
              }}
              icon={<img src={sedesSVG} alt="Sedes Icon" className="w-20 h-20 mx-auto" />}
              label={<p style={{ fontWeight: '600', fontSize: '18px' }}>
                SEDES<br />
                <span style={{ fontWeight: '500', fontSize: '12px', color: 'gray' }}>
                  <span>05</span> sedes
                </span>
              </p>}
              value="1"
            />
            <Tab
              sx={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '20px',
                marginRight: '20px',
                maxWidth: '200px',
                minWidth: '200px',
                textAlign: 'center',
                fontFamily: 'Teko, sans-serif',  // Font Teko
              }}
              icon={<img src={dependenciasSVG} alt="Dependencias Icon" className="w-20 h-20 mx-auto" />}
              label={<p style={{ fontWeight: '600', fontSize: '18px' }}>
                DEPENDENCIAS<br />
                <span style={{ fontWeight: '500', fontSize: '12px', color: 'gray' }} >
                  <span>09</span> DEPENDENCIAS
                </span>
              </p>}
              value="2"
            />
            <Tab
              sx={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '20px',
                marginRight: '20px',
                maxWidth: '200px',
                minWidth: '200px',
                textAlign: 'center',
                fontFamily: 'Teko, sans-serif',  // Font Teko
              }}
              icon={<img src={despachosSVG} alt="Despachos Icon" className="w-20 h-20 mx-auto" />}
              label={<p style={{ fontWeight: '600', fontSize: '18px' }}>
                DESPACHOS<br />
                <span style={{ fontWeight: '500', fontSize: '12px', color: 'gray' }} >
                  <span>15</span> DESPACHOS
                </span>
              </p>}
              value="3"
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          <RegisterHeadquarter selectedOption="SEDES" />
        </TabPanel>
        <TabPanel value="2">
          <RegisterDependencies selectedOption="DEPENDENCIAS" />
        </TabPanel>
        <TabPanel value="3">
          <RegisterDispatch selectedOption="DESPACHOS" />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
