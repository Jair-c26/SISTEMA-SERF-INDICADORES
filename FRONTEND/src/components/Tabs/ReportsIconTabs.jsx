import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import listaSVG from '../../assets/icons/lista.svg';
import usuarioSVG from '../../assets/icons/usuario.svg';
import importarSVG from '../../assets/icons/importar.svg';
import HeadquartersStructure from '../../pages/StatisticalReports/Components/HeadquartersStructure';
import SpecificReports from '../../pages/StatisticalReports/SpecificReports/SpecificReports';

const ReportsIconTabs = ({ navigate }) => { // Recibe navigate como prop
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1', mt: 2 }}>
            <TabContext value={value}>
                <Box sx={{ borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="Opciones de Áreas">
                        <Tab
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                paddingLeft: '50px',
                                paddingRight: '50px',
                                paddingTop: '40px',
                                paddingBottom: '40px',
                                marginRight: '20px', // Separación en el eje X
                            }}
                            icon={<img src={listaSVG} alt="Sedes Icon" style={{ width: '5rem', height: '5rem' }} />}
                            label={<p style={{ fontWeight: '600', fontSize: '18px' }}>
                                REPORTES ESTADISTICOS
                            </p>}
                            value="1"
                        />
                        <Tab
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                paddingLeft: '50px',
                                paddingRight: '50px',
                                paddingTop: '40px',
                                paddingBottom: '40px',
                                marginLeft: '20px',  // Separación en el eje X
                                marginRight: '20px', // Separación en el eje X
                            }}
                            icon={<img src={usuarioSVG} alt="Dependencias Icon" style={{ width: '5rem', height: '5rem' }} />}
                            label={<p style={{ fontWeight: '600', fontSize: '18px' }}>
                                REPORTES ESPECIFICOS
                            </p>}
                            value="2"
                        />
                        <Tab
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                paddingLeft: '50px',
                                paddingRight: '50px',
                                paddingTop: '40px',
                                paddingBottom: '40px',
                                marginLeft: '20px',  // Separación en el eje X
                            }}
                            icon={<img src={importarSVG} alt="Despachos Icon" style={{ width: '5rem', height: '5rem' }} />}
                            label={<p style={{ fontWeight: '600', fontSize: '18px' }}>
                                IMPORTAR USUARIOS
                            </p>}
                            value="3"
                        />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    {/* Pasar navigate al componente HeadquartersStructure */}
                    <HeadquartersStructure navigate={navigate} />
                </TabPanel>
                <TabPanel value="2">
                    <SpecificReports />
                </TabPanel>
                <TabPanel value="3">
                    Item One
                </TabPanel>
            </TabContext>
        </Box>
    );
};

export default ReportsIconTabs;
