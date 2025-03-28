import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';  // Correcto
import TabList from '@mui/lab/TabList';        // Correcto
import TabPanel from '@mui/lab/TabPanel';      // Correcto
import sedesSVG from '../../assets/icons/sedes.svg';  // Importa el archivo SVG
import dependenciasSVG from '../../assets/icons/dependencias.svg';
import despachosSVG from '../../assets/icons/despachos.svg';
import rolSVG from '../../assets/icons/rol.svg';
import permisoSVG from '../../assets/icons/permiso.svg';
import RoleManagement from '../../pages/RolesPermissions/components/RoleManagement';

const TabsIconRP = () => {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="w-full mt-2 font-teko">
      <TabContext value={value}>
        <div className="border-b border-gray-200">
          <TabList onChange={handleChange} aria-label="Opciones de Áreas">
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
              icon={<img src={rolSVG} alt="Icono de Rol" className="w-20 h-20 mx-auto" />}
              label={
                <div className="text-center">
                  <p className="text-lg font-semibold">ROLES</p>
                  <p className="text-sm text-gray-500">05 ROLES</p>
                </div>
              }
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
              icon={<img src={permisoSVG} alt="Icono de Permiso" className="w-20 h-20 mx-auto" />}
              label={
                <div className="text-center">
                  <p className="text-lg font-semibold">PERMISOS</p>
                  <p className="text-sm text-gray-500">09 PERMISOS</p>
                </div>
              }
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
              icon={<img src={despachosSVG} alt="Icono de Despachos" className="w-20 h-20 mx-auto" />}
              label={
                <div className="text-center">
                  <p className="text-lg font-semibold">AVANZADO</p>
                  <p className="text-sm text-gray-500">15 AVANZADO</p>
                </div>
              }
              value="3"
            />
          </TabList>
        </div>
        <TabPanel value="1">
          <RoleManagement />
        </TabPanel>
        <TabPanel value="2">
          <h2>Hola Mundo - DEPENDENCIAS</h2>
        </TabPanel>
        <TabPanel value="3">
          <h2>Hola Mundo - DESPACHOS</h2>
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default TabsIconRP;
