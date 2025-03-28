import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingBackdropUser = ({ open, containerRef }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: 10,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Fondo translúcido
      }}
      open={open}
      onClick={(e) => e.stopPropagation()} // Evitar el click en el backdrop
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default LoadingBackdropUser;
