import React, { useState, useCallback } from 'react';
import { Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material';

const CustomFilterUser = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        role: '',
        office: '',
        status: '',
    });

    // Opciones para cada campo con la opción "Seleccionar" incluida
    const options = {
        role: ['Seleccionar Rol', 'Administrador', 'Usuario', 'Supervisor'],
        office: ['Seleccionar Despacho', 'Oficina A', 'Oficina B', 'Oficina C'],
        status: ['Seleccionar Estado', 'Activo', 'Inactivo'],
    };

    // Maneja los cambios en los filtros
    const handleFilterChange = useCallback(
        (field, value) => {
            const updatedFilters = { ...filters, [field]: value === `Seleccionar ${field}` ? '' : value };
            setFilters(updatedFilters);
            onFilterChange(updatedFilters); // Notifica los filtros actualizados al padre
        },
        [filters, onFilterChange]
    );

    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Campo Rol */}
            <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                    value={filters.role}
                    onChange={(e) => handleFilterChange('role', e.target.value)}
                    label="Rol"
                >
                    {options.role.map((option) => (
                        <MenuItem key={option} value={option === 'Seleccionar Rol' ? '' : option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Campo Despacho */}
            <FormControl fullWidth>
                <InputLabel>Despacho</InputLabel>
                <Select
                    value={filters.office}
                    onChange={(e) => handleFilterChange('office', e.target.value)}
                    label="Despacho"
                    
                >
                    {options.office.map((option) => (
                        <MenuItem key={option} value={option === 'Seleccionar Despacho' ? '' : option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Campo Estado */}
            <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="Estado"

                >
                    {options.status.map((option) => (
                        <MenuItem key={option} value={option === 'Seleccionar Estado' ? '' : option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default CustomFilterUser;
