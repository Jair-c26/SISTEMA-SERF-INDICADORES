import React, { useState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';

const StatisticalOptions = ({
    icon,  // Prop para el icono
    primaryText = "x",  // Texto principal (centrado)
    checkboxItems = []  // Opciones con checkbox
}) => {
    const [open, setOpen] = useState(false); // Estado para controlar colapso
    const [checked, setChecked] = useState(null); // Estado para controlar selección

    const handleClick = () => {
        setOpen(!open); // Cambia el estado 'open' al hacer clic
    };

    const handleToggle = (value) => () => {
        // Alterna la selección de un checkbox y desactiva otros
        if (checked === value) {
            setChecked(null); // Si el seleccionado se desmarca, todas las opciones se habilitan
        } else {
            setChecked(value); // Marca la opción seleccionada
        }
    };

    return (
        <List
            component="div"
            disablePadding
            sx={{
                width: '100%',
                bgcolor: 'background.paper',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #ddd',
                borderRadius: '8px',
                margin: '10px 0',
            }}
        >
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    {<img src={icon} alt="Icono Estadísticas" style={{ width: '3rem', height: '3rem' }} />}
                </ListItemIcon>

                {/* Contenedor Box para centrar el primaryText */}
                <Box display="flex">
                    <ListItemText
                        primary={primaryText}
                        sx={{
                            textAlign: 'start', // Centrado horizontal del texto
                            marginBottom: 0,
                            lineHeight: 1,
                        }}
                    />
                </Box>
            </ListItemButton>

            {/* Contenido colapsable */}
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ bgcolor: '#E1E1E1' }}>
                    {checkboxItems.map((item, index) => {
                        const labelId = `checkbox-list-label-${index}`;
                        return (
                            <ListItem key={index} disablePadding>
                                <ListItemButton
                                    role={undefined}
                                    onClick={handleToggle(item.value)}
                                    dense
                                    disabled={checked !== null && checked !== item.value}
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checked === item.value}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={item.text || `Item ${index + 1}`} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Collapse>
        </List>
    );
};

export default StatisticalOptions;
