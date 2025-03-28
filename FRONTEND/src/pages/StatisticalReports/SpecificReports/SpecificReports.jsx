import React from 'react';
import { Box, Typography } from '@mui/material';
import VerticalTabsFunctions from '../../../components/Tabs/VerticalTabsFunctions';

const SpecificReports = () => {
    return (
        <Box
            className="specific-reports-container"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                padding: 4,
                backgroundColor: 'white',
                boxShadow: 1,
                gap: 2,
            }}
        >
            <Typography
                variant="h5"
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{ textAlign: 'start' }}
            >
                Buscar reportes estadísticos
            </Typography>
            <Box sx={{ flex: 1 }}>
                <VerticalTabsFunctions />
            </Box>
        </Box>
    );
};

export default SpecificReports;
