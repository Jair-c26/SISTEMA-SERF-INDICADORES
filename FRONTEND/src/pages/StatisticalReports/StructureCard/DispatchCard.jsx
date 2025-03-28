import React, { useState } from 'react';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { Box, Button, Typography } from '@mui/material';
import DispatchStructure from './DispatchStructure';

const DispatchCard = ({ dispatch, navigate }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { title, value, despachos } = dispatch; // Aquí "value" es el dependencyId

  // Funciones para manejar el diálogo
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <Box className="flex flex-row w-full gap-2 p-2 items-center">
      {/* Icono de la tarjeta */}
      <Box className="flex w-[35px] h-[35px] bg-[#fff] rounded items-center justify-center">
        <AccountTreeIcon style={{ color: '#152B52' }} />
      </Box>
      {/* Contenedor de texto */}
      <Box className="flex flex-col items-start w-full">
        <Typography variant="body2" fontWeight="bold" className="text-xs text-start">
          {title}
        </Typography>
        <Typography variant="body2" className="text-[8px] text-gray-600 text-start">
          Código: <span className="text-black">{value}</span>
        </Typography>
      </Box>
      {/* Botón de acción */}
      <Box className="flex items-center">
        <Button
          variant="text"
          size="small"
          sx={{ color: '#152B52', fontWeight: '600' }}
          onClick={handleOpenDialog} // Abrimos el diálogo al hacer clic
        >
          Explorar
        </Button>
      </Box>

      {/* Diálogo DispatchStructure con la prop dependencyId */}
      <DispatchStructure
        open={openDialog}
        onClose={handleCloseDialog}
        despachos={despachos}
        navigate={navigate}
        dependencyId={value} // Se pasa el dependencyId
      />
    </Box>
  );
};

export default DispatchCard;
