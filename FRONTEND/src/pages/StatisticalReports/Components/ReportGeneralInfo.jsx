import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const ReportGeneralInfo = () => {
    const fileCount = 100;
    return (
        <Box className="flex flex-col w-full gap-8 rounded-2xl bg-white">
            <Box className="flex flex-col h-full w-full gap-3">
                {/* Información general */}
                <Box className="flex flex-col bg-white p-5 items-start rounded-xl shadow-md">
                    <Typography variant="h6" component="h2" fontWeight="bold">
                        Reportes Estadisticos
                    </Typography>

                    <Typography variant="body1" color="textSecondary">
                        Reportes Estadisticos / Archivos / <span>{fileCount}</span> Reportes
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default ReportGeneralInfo;
