// FileUploadButton.jsx
import React, { useState } from 'react';
import { Button } from '@mui/material';

const FileUploadButton = () => {
  const [file, setFile] = useState(null);  // Para almacenar el archivo seleccionado
  const [loading, setLoading] = useState(false);  // Para manejar el estado de carga
  const [error, setError] = useState(null);  // Para manejar posibles errores

  // Función para manejar la carga del archivo
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError(null);  // Limpiar el error si hay uno
    }
  };

  // Función para enviar el archivo a la API
  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo antes de cargar.');
      return;
    }

    setLoading(true);  // Iniciar la carga

    const formData = new FormData();
    formData.append('file', file);  // Agregar el archivo al FormData

    try {
      const response = await fetch('http://192.168.1.12/api/import-user', {
        method: 'POST',
        body: formData,  // Enviar el archivo en el cuerpo de la solicitud
      });

      if (!response.ok) {
        throw new Error('Error al cargar el archivo');
      }

      const data = await response.json();
      console.log('Archivo cargado exitosamente:', data);
      setLoading(false);  // Finalizar la carga
      setFile(null);  // Limpiar el archivo después de subir
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
      setError(error.message);  // Mostrar el error
      setLoading(false);  // Finalizar la carga
    }
  };

  return (
    <div>
      {/* Botón para seleccionar archivo */}
      <Button
        variant="contained"
        color="primary"
        component="label"
        disabled={loading}  // Desactivar el botón mientras se carga el archivo
      >
        {loading ? 'Cargando...' : 'Cargar Archivo'}
        <input
          type="file"
          hidden
          onChange={handleFileChange}  // Manejar el archivo seleccionado
        />
      </Button>

      {/* Mensaje de error si hay alguno */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Mostrar el nombre del archivo seleccionado */}
      {file && <p>Archivo seleccionado: {file.name}</p>}

      {/* Botón para enviar el archivo a la API */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleUpload}
        disabled={loading || !file}  // Desactivar si no hay archivo seleccionado o si se está cargando
      >
        Subir a la API
      </Button>
    </div>
  );
};

export default FileUploadButton;
