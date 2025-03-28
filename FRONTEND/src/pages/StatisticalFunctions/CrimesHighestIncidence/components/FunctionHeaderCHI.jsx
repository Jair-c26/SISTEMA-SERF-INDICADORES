import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import logoSVG from '../../../../assets/icons/logo.svg';  // Asume que el logo está en la ruta correcta
import PropTypes from 'prop-types';

const FunctionHeaderCHI = ({ nombre_fiscalia }) => {
    return (
        <Box className="flex flex-row w-full justify-between">
            {/* Contenedor de Logo y Detalles */}
            <Box className="flex flex-row items-center gap-4 bg-white  shadow-[0px_4px_4px_rgba(0,0,0,0.1)] rounded-r-lg ">
                <Box className="flex flex-col justify-center p-2 bg-[#152B52]">
                    <img
                        src={logoSVG} // Aquí se hace referencia al archivo SVG
                        alt="Logo Dashboard"
                        className="w-auto h-[70px] object-contain"
                    />
                </Box>

                <Box className="flex flex-col justify-center p-2 bg-white w-full h-full items-start ">
                    <Typography variant="h6" style={{ fontWeight: '600', fontSize: '18px' }} className="font-bold text-[#152B52] text-left">
                        DELITOS CON MAYOR INCIDENCIA
                    </Typography>
                    <Typography variant="body1" className="font-bold text-[#152B52] text-center">
                        01 DE AGOSTO AL 31 DE AGOSTO DEL 2024
                    </Typography>
                </Box>
            </Box>

            {/* Contenedor de Información adicional (como el nombre de la fiscalía) */}
            <Box className="flex items-center justify-start gap-4 px-5 shadow-[0px_4px_4px_rgba(0,0,0,0.1)] rounded-lg bg-white">
                <Typography variant="body1" style={{ fontWeight: '600', fontSize: '18px' }} className="text-lg font-bold text-[#152B52]">
                    {nombre_fiscalia}
                </Typography>
            </Box>
        </Box>
    );
};

FunctionHeaderCHI.propTypes = {
    nombre_fiscalia: PropTypes.string.isRequired,
};

export default FunctionHeaderCHI;
