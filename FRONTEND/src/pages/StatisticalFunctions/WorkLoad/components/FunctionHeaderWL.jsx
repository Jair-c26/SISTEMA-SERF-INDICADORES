import React from 'react';
import { Box, Typography } from '@mui/material';
import logoSVG from '../../../../assets/icons/logo.svg';

const FunctionHeaderWL = ({ nombre_funcion, fecha_registro, nombre_dependencia }) => {
    return (
        <Box className="flex flex-row w-full justify-between">
            {/* Contenedor de Logo y Detalles */}
            <Box className="flex flex-row items-center gap-4 bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.1)] rounded-r-lg">
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 2, backgroundColor: '#152B52' }}>
                    <img
                        src={logoSVG}
                        alt="Logo Dashboard"
                        sx={{ width: 'auto', height: '70px', objectFit: 'contain' }}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 2, backgroundColor: 'white', width: '100%', height: '100%' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 18, color: '#152B52', textAlign: 'left' }}>
                        {nombre_funcion}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 18, color: '#152B52', textAlign: 'left' }}>
                        {fecha_registro}
                    </Typography>
                </Box>
            </Box>

            {/* Contenedor de Información adicional */}
            <Box className="flex items-center justify-start gap-4 px-5 shadow-[0px_4px_4px_rgba(0,0,0,0.1)] rounded-lg bg-white">
                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 18, color: '#152B52' }}>
                    {nombre_dependencia}
                </Typography>
            </Box>
        </Box>
    );
};

export default FunctionHeaderWL;
