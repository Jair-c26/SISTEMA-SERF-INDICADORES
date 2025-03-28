import React from 'react';
import Button from '@mui/material/Button';
import IosShareIcon from '@mui/icons-material/IosShare';

const BUTTON_SIZE = { width: 40, height: 38 };
const ICON_SIZE = { width: 20, height: 20 };

const ExportDocument = ({ onExport }) => (
  <Button
    variant="contained"
    //color="primary"
    onClick={onExport}
    sx={{ ...BUTTON_SIZE, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, backgroundColor: '#183466' }}
  >
    <IosShareIcon sx={ICON_SIZE} />
  </Button>
);

export default ExportDocument;
