import React from 'react';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Box, Button, Typography } from '@mui/material';

const HeadquartersCard = ({ sede }) => {
    // Extraemos los datos necesarios de la sede
    const { nombre, cod_sede } = sede;

    return (
        <Box className="flex flex-row w-full gap-2 p-2 items-cente">
            {/* Icono de la tarjeta */}
            <Box className="flex w-[35px] h-[35px] bg-[#152B52] rounded items-center justify-center">
                <AccountBalanceIcon style={{ color: '#fff' }} />
            </Box>
            {/* Contenedor de texto */}
            <Box className="flex flex-col items-start w-full">
                <Typography variant="body2" fontWeight="bold" className="text-xs text-start">
                    {nombre} {/* Aquí mostramos el nombre de la sede */}
                </Typography>
                <Typography variant="body2" className="text-[8px] text-gray-600 text-start">
                    Código de sede: <span className="text-black">{cod_sede}</span> {/* Mostramos el código de la sede */}
                </Typography>
            </Box>
        </Box>
    );
};

export default HeadquartersCard;
