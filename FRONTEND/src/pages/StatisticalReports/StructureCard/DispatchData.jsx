import React from 'react';
import WorkIcon from '@mui/icons-material/Work';
import { Box, Typography } from '@mui/material';

const DispatchData = () => {
    //const { nombre_despacho, cod_despa } = dispatch; // Desestructuramos el despacho

    return (
        <Box className="flex flex-row w-full gap-2 p-2 items-center">
            <Box className="flex w-[35px] h-[35px] bg-[#152B52] rounded items-center justify-center">
                <WorkIcon style={{ color: '#fff' }} />
            </Box>
            <Box className="flex flex-col items-start w-full">
                <Typography variant="body2" fontWeight="bold" className="text-xs text-start">
                     Datos{/*{nombre_despacho} Mostramos el nombre del despacho */}
                </Typography>
                <Typography variant="body2" className="text-[8px] text-gray-600 text-start">
                    Código: <span className="text-black">5</span> {/* Mostramos {cod_despa} el código del despacho */}
                </Typography>
            </Box>
        </Box>
    );
};


export default DispatchData;
