import React from 'react';
import { Box, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Asegúrate de importar ThemeProvider y createTheme
import ReportGeneralInfo from './Components/ReportGeneralInfo';
import ReportsIconTabs from '../../components/Tabs/ReportsIconTabs';

// Define tu tema
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Color principal
        },
        secondary: {
            main: '#dc004e', // Color secundario
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h4: {
            fontWeight: 'bold', // Estilo para el h4
        },
    },
});

const StatisticalReports = ({ navigate }) => { // Recibe navigate como prop
    return (
        <ThemeProvider theme={theme}> {/* Asegúrate de envolverlo con ThemeProvider */}
            <Box
                className="flex flex-col h-full w-full items-start p-5 gap-4"
                sx={{
                    flexGrow: 1, // Permite que ocupe todo el espacio disponible
                    transition: 'all 0.3s ease-in-out', // Transición suave
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    fontWeight="bold"
                >
                    Reportes estadisticos
                </Typography>
                <Box className="flex flex-col h-full w-full">
                    <ReportGeneralInfo />
                    {/* Pasamos navigate a ReportsIconTabs */}
                    <ReportsIconTabs navigate={navigate} />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default StatisticalReports;
