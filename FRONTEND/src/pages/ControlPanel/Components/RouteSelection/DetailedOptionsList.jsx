import React, { useState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box'; 
import '../../../../components/OptionListCard/OptionListCard.css';

const DetailedOptionsList = ({
    icon,  // Nuevo prop para el icono
    primaryText = "x",
    checkboxItems = [],
    secondaryText = "x",
    necessaryValue = "x" }) => {
    const [open, setOpen] = useState(false);  // Inicializamos el estado 'open' como false, para que la lista esté oculta por defecto
    const [checked, setChecked] = useState(null);  // Inicializamos 'checked' como null para que no haya ninguna casilla seleccionada inicialmente

    const handleClick = () => {
        setOpen(!open);  // Cambiamos el estado de 'open' al hacer clic
    };

    const handleToggle = (value) => () => {
        // Si ya hay una casilla seleccionada, se desmarcará y se deshabilitarán las demás
        if (checked === value) {
            setChecked(null);  // Si se desmarca la casilla seleccionada, todas se habilitan
        } else {
            setChecked(value);  // Si se marca una nueva casilla, solo esa estará habilitada
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
                    {<img src={icon} alt="Sedes Icon" style={{ width: '3rem', height: '3rem' }} />}
                </ListItemIcon>

                {/* Contenedor Box para alinear los textos verticalmente */}
                <Box display="flex" flexDirection="column">
                    <ListItemText primary={primaryText} sx={{ marginBottom: 0, lineHeight: 1 }} />
                    <ListItemText primary={secondaryText} sx={{ marginBottom: 0, lineHeight: 1 }} />
                    <ListItemText secondary={`Cantidad Dependencias: ${necessaryValue}`} sx={{ marginBottom: 0, lineHeight: 1 }} />
                </Box>
            </ListItemButton>

            {/* Collapse: el contenido se mostrará solo cuando 'open' sea true */}
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ bgcolor: '#E1E1E1' }}>
                    {checkboxItems.map((item, index) => {
                        const labelId = `checkbox-list-label-${index}`;
                        return (
                            <ListItem
                                key={index}
                                disablePadding
                            >
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

export default DetailedOptionsList;