import React, { useState, useCallback } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';

const CustomFilter = ({ onFilterChange }) => {
  const [field, setField] = useState('name');
  const [operator, setOperator] = useState('contains');
  const [value, setValue] = useState('');

  const handleFieldChange = useCallback((event) => {
    setField(event.target.value);
    onFilterChange(event.target.value, operator, value);
  }, [operator, value, onFilterChange]);

  const handleOperatorChange = useCallback((event) => {
    setOperator(event.target.value);
    onFilterChange(field, event.target.value, value);
  }, [field, value, onFilterChange]);

  const handleValueChange = useCallback((event) => {
    setValue(event.target.value);
    onFilterChange(field, operator, event.target.value);
  }, [field, operator, onFilterChange]);

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <FormControl fullWidth>
        <InputLabel>Campo</InputLabel>
        <Select value={field} onChange={handleFieldChange} label="Campo">
          <MenuItem value="name">Nombre del Documento</MenuItem>
          <MenuItem value="author">Autor</MenuItem>
          <MenuItem value="status">Estado</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Operador</InputLabel>
        <Select value={operator} onChange={handleOperatorChange} label="Operador">
          <MenuItem value="contains">Contiene</MenuItem>
          <MenuItem value="equals">Es igual a</MenuItem>
          <MenuItem value="startsWith">Comienza con</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Valor"
        variant="outlined"
        value={value}
        onChange={handleValueChange}
        fullWidth
      />
    </Box>
  );
};

export default CustomFilter;
