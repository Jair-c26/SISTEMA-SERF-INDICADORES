import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import DispatchCardList from './DispatchCardList';

const DispatchStructure = ({ open, onClose, despachos, navigate, dependencyId }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Despachos Asociados</DialogTitle>
      <DialogContent>
        {despachos?.length > 0 ? (
          <DispatchCardList dependencyId={dependencyId} navigate={navigate} />
        ) : (
          <Typography>No hay despachos disponibles</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DispatchStructure;
