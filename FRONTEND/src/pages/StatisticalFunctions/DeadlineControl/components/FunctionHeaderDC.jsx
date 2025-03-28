import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import logoSVG from '../../../../assets/icons/logo.svg';  // Asume que el logo está en la ruta correcta

const FunctionHeaderDC = () => {
    return (
        <Box className="flex flex-row w-full gap-8 p-4 rounded-2xl bg-white shadow-md">
            {/* Contenedor de Logo y Detalles */}
            <Box className="flex flex-row items-center gap-4 border border-[#A4A4A4] shadow-[0px_4px_4px_rgba(0,0,0,0.1)] rounded-r-lg p-3">
                <img
                    src={logoSVG} // Aquí se hace referencia al archivo SVG
                    alt="Logo Dashboard"
                    className="w-auto h-[70px] object-contain"
                />
                <Box className="flex flex-col justify-center">
                    <Typography variant="h6" className="font-bold text-[#152B52] text-left">
                        CARGA LABORAL
                    </Typography>
                    <Typography variant="body1" className="font-bold text-[#152B52] text-center">
                        01 DE AGOSTO AL 31 DE AGOSTO DEL 2024
                    </Typography>
                </Box>
            </Box>

            {/* Contenedor de Información adicional (como el nombre de la fiscalía) */}
            <Box className="flex items-center justify-start gap-4 px-5 border border-[#A4A4A4] shadow-[0px_4px_4px_rgba(0,0,0,0.1)] rounded-lg bg-white">
                <Typography variant="body1" className="text-lg font-bold text-[#152B52]">
                    1º FISCALIA PROVINCIAL PENAL CORPORATIVA DE TAMBOTAPA
                </Typography>
            </Box>
        </Box>
    );
};

export default FunctionHeaderDC;
