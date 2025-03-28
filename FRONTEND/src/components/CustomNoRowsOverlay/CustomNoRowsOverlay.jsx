import React from 'react';
import { Box, Typography } from '@mui/material';

const CustomNoRowsOverlay = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <Typography variant="h6" color="textSecondary">
      No se encontraron usuarios
    </Typography>
  </Box>
);

export default CustomNoRowsOverlay;
