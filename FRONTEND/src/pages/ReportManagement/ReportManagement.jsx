import React from 'react';
import DocumentDataGrid from '../ReportManagement/components/DocumentDataGrid'; // Ajusta la ruta si es necesario
import { Box, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Definir un tema con la tipografía Roboto
const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const ReportManagement = () => {
  // Valores configurables
  const reportSize = '2.6G';
  const fileCount = 100;

  return (
    <ThemeProvider theme={theme}>
      <Box className="flex flex-col h-full w-full items-start p-5 gap-4">
        {/* Título principal */}
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Gestión de reportes - Archivos
        </Typography>

        {/* Contenedor principal */}
        <Box className="flex flex-col h-full w-full gap-3">
          {/* Información general */}
          <Box className="flex flex-col bg-white p-5 items-start rounded-xl shadow-md">
            <Typography variant="h6" component="h2" fontWeight="bold">
              Gestión de Reportes
            </Typography>

            <Typography variant="body1" color="textSecondary">
              Gestión de reportes / Archivos / <span>{reportSize}</span> / <span>{fileCount}</span> Archivos
            </Typography>
          </Box>

          <Box
            className="flex bg-white rounded-xl px-5 py-4 shadow-md"
            sx={{
              flex: 1, // Ocupa el espacio restante
              display: 'flex',
              flexDirection: 'column',
              paddingBottom: '15px', // Espacio de 10px en la parte inferior
              overflow: 'hidden',  // Evitar que el contenido se desborde
            }}
          >
            {/* Componente DocumentDataGrid */}
            <DocumentDataGrid />
          </Box>

        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ReportManagement;
