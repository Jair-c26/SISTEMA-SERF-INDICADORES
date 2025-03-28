import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import RegisterAreasDataGrid from '../../../components/RegisterAreasDataGrid/RegisterAreasDataGrid';
import ListDependencies from '../DependencyData/ListDependencies';
import CreateDispatch from '../DispatchData/CreateDispatch';
import ListDispatchData from '../DispatchData/ListDispatchData';
import dispatchesService from '../../../services/api/dispatches-list/dispatchesService'; // Se asume que existe este servicio
import OptionalAlert from '../../../components/alert/OptionalAlert'; // Importación de OptionalAlert
import SimpleAlert from '../../../components/alert/SimpleAlert';

const RegisterDispatch = () => {
    // Se crea un ref para el contenedor del formulario
    const formRef = useRef(null);

    // Configuración de columnas para la data grid (usada en ListDispatchData)
    const columnsConfig = [
        { field: 'nombre_despacho', headerName: 'Nombre despacho', flex: 1 },
        { field: 'fiscalia', headerName: 'Dependencia', flex: 1 },
    ];

    // Estado para el formulario de despacho
    const [dispatchData, setDispatchData] = useState({
        id: null,        // Se usará en modo edición
        code: '',        // cod_despa
        name: '',
        phone: '',
        ruc: '',
        dependence: '',  // ID de la dependencia seleccionada
    });
    // Estado para saber si se está en modo edición
    const [editing, setEditing] = useState(false);

    // Estados para la lista de dependencias (para el Select)
    // Se obtiene mediante ListDependencies; en este ejemplo se invoca la función y se extraen los datos
    const { dependencies, loading } = ListDependencies();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setDispatchData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDependenceChange = (event) => {
        setDispatchData((prevData) => ({
            ...prevData,
            dependence: event.target.value,  // Almacenar solo el ID de la dependencia
        }));
    };

    // Función para limpiar el formulario y salir del modo edición
    const handleCancel = () => {
        setDispatchData({
            id: null,
            code: '',
            name: '',
            phone: '',
            ruc: '',
            dependence: '',
        });
        setEditing(false);
    };

    // Función para enviar el formulario (crear o actualizar despacho)
    const handleSubmit = async () => {
        try {
            if (editing && dispatchData.id) {
                // Modo edición: se actualiza el despacho sin enviar "id" ni "cod_despa"
                const payload = {
                    nombre_despacho: dispatchData.name,
                    telefono: dispatchData.phone,
                    ruc: dispatchData.ruc,
                    dependencia_fk: dispatchData.dependence,
                };
                console.log('Payload de actualización:', payload);
                await dispatchesService.updateDispatch(dispatchData.id, payload);
                
            } else {
                // Modo creación: se crea el despacho con el código ingresado
                const payload = {
                    cod_despa: dispatchData.code,
                    nombre_despacho: dispatchData.name,
                    telefono: dispatchData.phone,
                    ruc: dispatchData.ruc,
                    dependencia_fk: dispatchData.dependence,
                };
                console.log('Payload de creación:', payload);
                const response = await CreateDispatch(payload);
                console.log('Respuesta del servidor:', response);
                alert('Despacho creado exitosamente');
            }
            // Limpiar formulario y salir del modo edición
            handleCancel();
        } catch (error) {
            console.error('Error al guardar el despacho:', error);
            alert('Hubo un error al guardar el despacho');
        }
    };

    // Función que envuelve el guardado con confirmación usando OptionalAlert
    const handleSubmitConfirm = async () => {
        SimpleAlert({
            title: "Confirmación de guardado",
            text: "¿Estás seguro de que deseas guardar la información?",
            onConfirm: async () => {
                await handleSubmit();
            },
        });
    };

    // Callback para editar: se invoca desde el listado
    const handleEditDispatch = (data) => {
        setDispatchData({
            id: data.id,
            code: data.cod_despa, // Se carga el código original (para visualización, pero no se modificará)
            name: data.nombre_despacho,
            phone: data.telefono,
            ruc: data.ruc,
            dependence: data.dependencia_fk?.id ? data.dependencia_fk.id : data.dependencia_fk,
        });
        setEditing(true);
        // Realizamos el scroll suave hacia el formulario de edición
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Callback para eliminar: se invoca desde el listado
    const handleDeleteDispatch = async (id) => {
        try {
            await dispatchesService.deleteDispatch(id);
            alert('Despacho eliminado exitosamente');
            // Se recomienda refrescar la lista o notificar al componente listado para que haga un nuevo fetch
        } catch (error) {
            console.error('Error al eliminar el despacho:', error);
            alert('Hubo un error al eliminar el despacho');
        }
    };

    return (
        <Box className="flex flex-col w-full gap-6">
            {/* Sección del formulario de registro/edición con el ref asignado */}
            <Box ref={formRef} className="flex flex-col w-full bg-white rounded-2xl gap-4 shadow-md" sx={{ p: 5, boxShadow: 2 }}>
                <Box className="flex items-start">
                    <Typography variant="h6" component="h1" fontWeight="semibold" fontFamily={'Teko, sans-serif'}>
                        {editing ? 'EDITAR DESPACHO' : 'REGISTRAR DESPACHO'}
                    </Typography>
                </Box>

                <Box>
                    <TextField
                        label="Nombre despacho*"
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="name"
                        value={dispatchData.name}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box className="flex gap-4">
                    <TextField
                        label="Código Despacho*"
                        variant="outlined"
                        className="flex-1"
                        size="small"
                        name="code"
                        value={dispatchData.code}
                        onChange={handleInputChange}
                        disabled={editing}  // En modo edición, no se permite cambiar el código
                    />
                    <TextField
                        label="Teléfono*"
                        variant="outlined"
                        className="flex-1"
                        size="small"
                        name="phone"
                        value={dispatchData.phone}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="RUC*"
                        variant="outlined"
                        className="flex-1"
                        size="small"
                        name="ruc"
                        value={dispatchData.ruc}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box>
                    <FormControl fullWidth>
                        <InputLabel id="dependence-select-label" size="small">Dependencia*</InputLabel>
                        <Select
                            labelId="dependence-select-label"
                            id="dependence-select"
                            value={dispatchData.dependence}
                            onChange={handleDependenceChange}
                            size="small"
                            label="Dependencia*"
                        >
                            {loading ? (
                                <MenuItem disabled>
                                    <CircularProgress size={24} />
                                </MenuItem>
                            ) : (
                                dependencies.map((dependency) => (
                                    <MenuItem key={dependency.id} value={dependency.id}>
                                        {dependency.fiscalia}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                </Box>

                <Box className="flex justify-end gap-4 mt-6">
                    <Button
                        variant="outlined"
                        sx={{ width: '120px', borderColor: '#183466', color: '#183466' }}
                        onClick={handleCancel}  // Se asigna la función handleCancel al botón Cancelar
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ width: '120px', backgroundColor: '#183466' }}
                        onClick={handleSubmitConfirm}  // Se invoca handleSubmitConfirm para mostrar OptionalAlert
                    >
                        Guardar
                    </Button>
                </Box>
            </Box>

            {/* Sección del listado */}
            <Box className="bg-white rounded-2xl shadow-md" sx={{ p: 5, boxShadow: 2 }}>
                <ListDispatchData onEditRow={handleEditDispatch} onDeleteRow={handleDeleteDispatch} />
            </Box>
        </Box>
    );
};

export default RegisterDispatch;
