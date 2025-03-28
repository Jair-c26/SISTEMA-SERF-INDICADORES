import * as React from 'react';
import { 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, 
  InputLabel, MenuItem, FormControl, Select, Typography, TextField, Alert 
} from '@mui/material';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as XLSX from 'xlsx';

const FileUpload = () => {
  const [open, setOpen] = React.useState(false);
  const [documentType, setDocumentType] = React.useState('');
  const [folder, setFolder] = React.useState('');
  const [date, setDate] = React.useState(null);
  const [file, setFile] = React.useState(null);
  const [filePreviewData, setFilePreviewData] = React.useState(null);
  const [responseMessage, setResponseMessage] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setFile(null);
    setFilePreviewData(null);
    setResponseMessage(null);
    setLoading(false);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setFilePreviewData(jsonData);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setResponseMessage({ type: 'error', text: 'Por favor, selecciona un archivo.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setResponseMessage(null);

      const response = await fetch('http://192.168.1.12/api/import-carga', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer 4|YhOGO2OO4gl6vrnP2ixHOvVD4DpwWMzMQSwxAjLL4062f36d',
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage({ type: 'success', text: result.message || 'Archivo subido con éxito.' });
      } else {
        setResponseMessage({ type: 'error', text: `Error ${response.status}: ${result.message || 'Ocurrió un error al subir el archivo.'}` });
      }
    } catch (error) {
      setResponseMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const dialogContent = () => {
    return (
      <Dialog
        open={open}
        onClose={closeDialog}
        sx={{
          '& .MuiDialog-paper': {
            width: '100%',
            maxWidth: '1400px',
            height: 'auto',
            borderRadius: '20px',
          },
        }}
      >
        <DialogTitle>Cargar archivos</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 4, marginBottom: 2, paddingTop: 1 }}>
            <FormControl fullWidth sx={{ borderRadius: '5px' }}>
              <InputLabel id="document-type-label">Tipo de documento</InputLabel>
              <Select
                labelId="document-type-label"
                value={documentType}
                label="Tipo de documento"
                onChange={(e) => setDocumentType(e.target.value)}
                sx={{ borderRadius: '5px' }}
              >
                <MenuItem value="report">Control de plazos</MenuItem>
                <MenuItem value="invoice">Carga laboral</MenuItem>
                <MenuItem value="plan">Incidencia de delitos</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ borderRadius: '5px' }}>
              <InputLabel id="folder-label">Carpeta</InputLabel>
              <Select
                labelId="folder-label"
                value={folder}
                label="Carpeta"
                onChange={(e) => setFolder(e.target.value)}
                sx={{ borderRadius: '5px' }}
              >
                <MenuItem value="folder1">Carpeta 1</MenuItem>
                <MenuItem value="folder2">Carpeta 2</MenuItem>
                <MenuItem value="folder3">Carpeta 3</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="subtitle1" component="h2">
              Subir archivo
            </Typography>
            <Button
              variant="contained"
              component="label"
              sx={{ borderRadius: '5px', marginTop: '5px' }}
            >
              Seleccionar archivo
              <input
                type="file"
                accept=".xlsx, .xls"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {file && (
              <Typography variant="body2" sx={{ marginTop: '5px' }}>
                Archivo seleccionado: {file.name}
              </Typography>
            )}
          </Box>

          {filePreviewData && (
            <Box sx={{ marginTop: 3, width: '100%', maxHeight: '600px', overflow: 'auto', border: '1px solid #ddd', borderRadius: '5px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto', }}>
                <thead>
                  <tr>
                    {filePreviewData[0].map((cell, index) => (
                      <th key={index} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center', whiteSpace: 'nowrap', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', }}>
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filePreviewData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center', whiteSpace: 'nowrap', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}

          {responseMessage && (
            <Alert severity={responseMessage.type} sx={{ marginTop: 2 }}>
              {responseMessage.text}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleFileUpload} color="primary" disabled={loading}>
            {loading ? 'Subiendo...' : 'Subir'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div>
      <Button
        variant="contained"
        
        startIcon={<SaveAltIcon />}
        onClick={openDialog}
        sx={{ height: 38, backgroundColor: '#183466' }}
      >
        Guardar
      </Button>

      {dialogContent()}
    </div>
  );
};

export default FileUpload;
