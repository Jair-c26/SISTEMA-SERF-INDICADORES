import React from 'react';
import TextField from '@mui/material/TextField';

const QuickFilter = ({ onChange }) => (
  <TextField
    label="Buscar..."
    variant="outlined"
    size="small"
    onChange={(e) => onChange(e.target.value)}  // Pasa el valor a la función onChange
    sx={{
      width: 300,
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
    }}
  />
);

export default QuickFilter;
