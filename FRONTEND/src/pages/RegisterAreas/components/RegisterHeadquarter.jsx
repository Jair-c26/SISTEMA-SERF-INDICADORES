import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import regionService from '../../../services/api/region-list/regionService';
import createHeadquarter from '../../../pages/RegisterAreas/CreateHeadquarters/CreateHeadquarters';
import sedeService from '../../../services/api/sede-list/sedeService'; // Servicio para actualizar sede
import ListHeadquarter from '../../../pages/RegisterAreas/ListHeadquarter/ListHeadquarter';
import OptionalAlert from '../../../components/alert/OptionalAlert'; // Importación de OptionalAlert
import SimpleAlert from '../../../components/alert/SimpleAlert';

const RegisterHeadquarter = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para los datos del formulario
  const [headquarterData, setHeadquarterData] = useState({
    name: '',
    phone: '',
    ruc: '',
    province: '',
    distrito_fiscal: '',
    postalCode: '',
    id: null,
  });

  // Estado para almacenar los datos originales de la sede (por ejemplo, para el campo ruc)
  const [originalHeadquarterData, setOriginalHeadquarterData] = useState(null);

  // Estado para saber si se está en modo edición
  const [editing, setEditing] = useState(false);

  // Se crea un ref para el contenedor del formulario
  const formRef = useRef(null);

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setHeadquarterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regionsData = await regionService.getAllRegions();
        if (regionsData && Array.isArray(regionsData.data)) {
          setRegions(regionsData.data);
        } else {
          setRegions([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar las regiones:', error);
        setRegions([]);
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  // Callback que se invoca al presionar "Edit" en la data grid
  const handleEditHeadquarter = (data) => {
    // Mapear los datos de la sede a los nombres que usamos en el estado de edición
    setHeadquarterData({
      id: data.id,
      name: data.nombre || '',
      phone: data.telefono || '',
      ruc: data.ruc || '',
      province: data.provincia || '',
      distrito_fiscal: data.distrito_fiscal || '',
      postalCode: data.codigo_postal || '',
    });
    // Guardar el valor original de ruc (y otros si fuera necesario)
    setOriginalHeadquarterData({
      ruc: data.ruc || '',
    });
    setSelectedRegion(data.regional_fk?.id || '');
    setEditing(true);

    // Realizamos el scroll suave hacia el formulario de edición
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSave = async () => {
    try {
      if (editing && headquarterData.id) {
        // Modo edición: construir payload con los nombres que espera el API.
        // No se envían "id" ni "cod_sede". Además, se incluye "ruc" solo si fue modificado.
        const payload = {
          nombre: headquarterData.name,
          telefono: headquarterData.phone,
          provincia: headquarterData.province,
          distrito_fiscal: headquarterData.distrito_fiscal,
          codigo_postal: headquarterData.postalCode,
          regional_fk: selectedRegion,
        };

        // Incluir el campo "ruc" solo si ha cambiado respecto al valor original
        if (!originalHeadquarterData || headquarterData.ruc !== originalHeadquarterData.ruc) {
          payload.ruc = headquarterData.ruc;
        }

        console.log('Payload de actualización:', payload);
        await sedeService.updateSede(headquarterData.id, payload);
        
      } else {
        // Modo creación: se asigna "SC" para "cod_sede" y se mapean correctamente los campos
        const payload = {
          cod_sede: 'SC',
          nombre: headquarterData.name,
          telefono: headquarterData.phone,
          ruc: headquarterData.ruc,
          provincia: headquarterData.province,
          distrito_fiscal: headquarterData.distrito_fiscal,
          codigo_postal: headquarterData.postalCode,
          regional_fk: selectedRegion,
        };

        console.log('Payload de creación:', payload);
        await createHeadquarter(payload);
        alert('Sede creada con éxito');
      }

      // Limpiar campos y salir del modo edición
      handleCancel();
    } catch (error) {
      alert('Hubo un error al guardar la sede');
      console.error('Error en handleSave:', error);
    }
  };

  // Función para limpiar los campos del formulario y salir del modo edición
  const handleCancel = () => {
    setHeadquarterData({
      name: '',
      phone: '',
      ruc: '',
      province: '',
      distrito_fiscal: '',
      postalCode: '',
      id: null,
    });
    setOriginalHeadquarterData(null);
    setSelectedRegion('');
    setEditing(false);
  };

  // Función que envuelve el guardado con confirmación usando OptionalAlert
  const handleSaveConfirm = async () => {
    SimpleAlert({
      title: "Confirmación de guardado",
      text: "¿Estás seguro de que deseas guardar la información?",
      onConfirm: async () => {
        await handleSave();
      },
    });
  };

  return (
    <Box className="flex flex-col w-full gap-6">
      {/* Se asigna el ref al contenedor del formulario */}
      <Box ref={formRef} className="flex flex-col w-full bg-white rounded-2xl gap-4" sx={{ p: 5, boxShadow: 2 }}>
        <Box className="flex items-start">
          <Typography variant="h6" component="h1" fontWeight="semibold" fontFamily={'Teko, sans-serif'}>
            {editing ? 'EDITAR SEDE' : 'REGISTRAR SEDE'}
          </Typography>
        </Box>

        <Box>
          <TextField
            label="Nombre Sede*"
            variant="outlined"
            fullWidth
            size="small"
            name="name"
            value={headquarterData.name}
            onChange={handleInputChange}
          />
        </Box>
        <Box className="flex gap-4">
          <TextField
            label="Teléfono*"
            variant="outlined"
            className="flex-1"
            size="small"
            name="phone"
            value={headquarterData.phone}
            onChange={handleInputChange}
          />
          <TextField
            label="RUC*"
            variant="outlined"
            className="flex-1"
            size="small"
            name="ruc"
            value={headquarterData.ruc}
            onChange={handleInputChange}
          />
        </Box>
        <Box className="flex gap-4">
          <TextField
            label="Provincia*"
            variant="outlined"
            className="flex-1"
            size="small"
            name="province"
            value={headquarterData.province}
            onChange={handleInputChange}
          />
          <TextField
            label="Distrito Fiscal*"
            variant="outlined"
            className="flex-1"
            size="small"
            name="distrito_fiscal"
            value={headquarterData.distrito_fiscal}
            onChange={handleInputChange}
          />
          <Box className="flex-1">
            <FormControl fullWidth>
              <InputLabel id="region-select-label" size="small">
                Región*
              </InputLabel>
              <Select
                labelId="region-select-label"
                id="region-select"
                value={selectedRegion}
                label="Región"
                size="small"
                onChange={handleRegionChange}
              >
                {loading ? (
                  <MenuItem disabled>Cargando...</MenuItem>
                ) : (
                  regions.map((region) => (
                    <MenuItem key={region.id} value={region.id}>
                      {region.nombre}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box className="flex items-start">
          <TextField
            label="Código Postal*"
            variant="outlined"
            className="w-2/5"
            size="small"
            name="postalCode"
            value={headquarterData.postalCode}
            onChange={handleInputChange}
          />
        </Box>

        <Box className="flex justify-end gap-4 mt-6">
          <Button
            variant="outlined"
            sx={{ width: '120px', borderColor: '#183466', color: '#183466' }}
            onClick={handleCancel}  // Se asigna la función handleCancel
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            sx={{ width: '120px', backgroundColor: '#183466' }}
            onClick={handleSaveConfirm}  // Se invoca handleSaveConfirm para mostrar OptionalAlert
          >
            Guardar
          </Button>
        </Box>
      </Box>

      {/* Se pasa la función handleEditHeadquarter al listado */}
      <Box className="bg-white rounded-2xl" sx={{ p: 5, boxShadow: 2 }}>
        <ListHeadquarter onEditRow={handleEditHeadquarter} />
      </Box>
    </Box>
  );
};

export default RegisterHeadquarter;
