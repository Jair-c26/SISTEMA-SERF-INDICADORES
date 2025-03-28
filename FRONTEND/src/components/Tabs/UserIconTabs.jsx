import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import RegisterDependencies from '../../pages/RegisterAreas/components/RegisterDependencies';
import RegisterHeadquarter from '../../pages/RegisterAreas/components/RegisterHeadquarter';
import RegisterDispatch from '../../pages/RegisterAreas/components/RegisterDispatch';
import listaSVG from '../../assets/icons/lista.svg';
import usuarioSVG from '../../assets/icons/usuario.svg';
import importarSVG from '../../assets/icons/importar.svg';
import UserList from '../../pages/UserManagement/components/UserList';
import CreateUser from '../../pages/UserManagement/CreateUser/CreateUser';
import ImportUser from '../../pages/UserManagement/ImportUser/ImportUser';

export default function TabsIcon() {
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
                                padding: '20px',
                                marginRight: '20px',
                                maxWidth: '200px',
                                minWidth: '200px',
                                textAlign: 'center',
                                fontFamily: 'Teko, sans-serif',  // Font Teko
                            }}
                            icon={<img src={listaSVG} alt="Lista de usuarios" className="w-20 h-20 mx-auto" />}
                            label={<p className="text-sm font-bold">LISTA DE USUARIOS</p>}
                            value="1"
                        />
                        <Tab
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                padding: '20px',
                                marginLeft: '20px',
                                marginRight: '20px',
                                maxWidth: '200px',
                                minWidth: '200px',
                                textAlign: 'center',
                                fontFamily: 'Teko, sans-serif',  // Font Teko
                            }}
                            icon={<img src={usuarioSVG} alt="Crear usuario" className="w-20 h-20 mx-auto" />}
                            label={<p className="text-sm font-bold">CREAR USUARIO</p>}
                            value="2"
                        />
                        <Tab
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                padding: '20px',
                                marginLeft: '20px',
                                maxWidth: '200px',
                                minWidth: '200px',
                                textAlign: 'center',
                                fontFamily: 'Teko, sans-serif',  // Font Teko
                            }}
                            icon={<img src={importarSVG} alt="Importar usuarios" className="w-20 h-20 mx-auto" />}
                            label={<p className="text-sm font-bold">IMPORTAR USUARIOS</p>}
                            value="3"
                        />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <UserList />
                </TabPanel>
                <TabPanel value="2">
                    <CreateUser />
                </TabPanel>
                <TabPanel value="3">
                    <ImportUser />
                </TabPanel>
            </TabContext>
        </Box>
    );
}
