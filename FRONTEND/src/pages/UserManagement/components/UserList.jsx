import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import UserCount from './UserCount';
import UserDataGrid from './UserDataGrid';
const UserList = () => {
    return (
        <Box className="flex flex-col h-full w-full gap-4" sx={{ flex: 1 }}>
            <UserCount />
            <Box className="flex bg-white rounded-xl px-5 py-4 shadow-md"
                sx={{
                    flex: 1, // Ocupa el espacio restante
                    display: 'flex',
                    flexDirection: 'column',
                    paddingBottom: '15px', // Espacio de 10px en la parte inferior
                    overflow: 'hidden',  // Evitar que el contenido se desborde
                }}>
                <UserDataGrid />
            </Box>
        </Box>
    );
};

export default UserList;
