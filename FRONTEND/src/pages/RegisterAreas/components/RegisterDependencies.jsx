import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { InputLabel, FormControl, Select, MenuItem } from '@mui/material';
import RegisterAreasDataGrid from '../../../components/RegisterAreasDataGrid/RegisterAreasDataGrid';
import sedeService from '../../../services/api/sede-list/sedeService';
import CreateDependency from '../DependencyData/CreateDependency';
import dependencyService from '../../../services/api/dependency-list/dependencyService'; // Servicio para dependencias
import ListDependencyData from '../DependencyData/ListDependencyData';
import OptionalAlert from '../../../components/alert/OptionalAlert'; // Importación de OptionalAlert
import SimpleAlert from '../../../components/alert/SimpleAlert';

const RegisterDependencies = () => {
    const formRef = useRef(null); // Ref para el contenedor del formulario

    const columnsConfig = [
        { field: 'fiscalia', headerName: 'Dependencia', flex: 1 },
        { field: 'nombre_fiscalia', headerName: 'Nombre fiscalía', flex: 1 },
        { field: 'nombre_sede', headerName: 'Sede', flex: 1 },
    ];

    // Estados para el formulario de dependencia
    const [dependencyData, setDependencyData] = useState({
        id: null,
        fiscalia: '',
        tipoFiscalia: '',
        nombreFiscalia: '',
        ruc: '',
        telefono: '',
    });
    // Estado para almacenar los valores originales (por ejemplo, el ruc)
    const [originalDependencyData, setOriginalDependencyData] = useState(null);
    // Estado para controlar si estamos en modo edición
    const [editing, setEditing] = useState(false);

    // Estado para las sedes disponibles y la sede seleccionada
    const [headquarters, setHeadquarters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedHeadquarter, setSelectedHeadquarter] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setDependencyData((prev) => ({ ...prev, [name]: value }));
    };

    const handleHeadquarterChange = (event) => {
        setSelectedHeadquarter(event.target.value);
    };

    // Función para limpiar el formulario y salir del modo edición
    const handleCancel = () => {
        setDependencyData({
            id: null,
            fiscalia: '',
            tipoFiscalia: '',
            nombreFiscalia: '',
            ruc: '',
            telefono: '',
        });
        setOriginalDependencyData(null);
        setSelectedHeadquarter('');
        setEditing(false);
    };

    // Cargar las sedes disponibles
    useEffect(() => {
        const fetchHeadquarters = async () => {
            try {
                const sedeData = await sedeService.getAllSedes();
                setHeadquarters(sedeData.data || []);
            } catch (error) {
                console.error('Error al cargar las sedes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHeadquarters();
    }, []);

    // Función para guardar (crear o actualizar) una dependencia
    const handleSave = async () => {
        if (!selectedHeadquarter) {
            alert('Por favor, seleccione una sede.');
            return;
        }

        // Construir el payload que se enviará a la API.
        // Para creación se incluye el campo "cod_depen" con valor estático.
        // Para edición, se omite "cod_depen" y "id" (que se pasan por otros medios) y se actualizan solo los campos modificados.
        if (editing && dependencyData.id) {
            const payload = {
                fiscalia: dependencyData.fiscalia,
                tipo_fiscalia: dependencyData.tipoFiscalia,
                nombre_fiscalia: dependencyData.nombreFiscalia,
                // Incluir "ruc" solo si se modificó
                ...( !originalDependencyData || dependencyData.ruc !== originalDependencyData.ruc ? { ruc: dependencyData.ruc } : {} ),
                telefono: dependencyData.telefono,
                sede_fk: selectedHeadquarter,
            };

            console.log('Payload de actualización:', payload);
            try {
                await dependencyService.updateDependency(dependencyData.id, payload);
                
            } catch (error) {
                console.error('Error al actualizar la dependencia:', error);
                alert('Ocurrió un error al actualizar la dependencia. Intente nuevamente.');
                return;
            }
        } else {
            const payload = {
                cod_depen: "R001-SC001-1FPPCT", // Valor estático para creación
                fiscalia: dependencyData.fiscalia,
                tipo_fiscalia: dependencyData.tipoFiscalia,
                nombre_fiscalia: dependencyData.nombreFiscalia,
                ruc: dependencyData.ruc,
                telefono: dependencyData.telefono,
                sede_fk: selectedHeadquarter,
            };

            console.log('Payload de creación:', payload);
            try {
                const response = await CreateDependency(payload);
                console.log('Respuesta del servidor:', response);
                alert('Dependencia registrada exitosamente.');
            } catch (error) {
                console.error('Error al registrar la dependencia:', error);
                alert('Ocurrió un error al registrar la dependencia. Intente nuevamente.');
                return;
            }
        }

        // Limpiar el formulario y salir del modo edición
        handleCancel();
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

    // Callback para editar: se invoca cuando se hace clic en "Edit" en el listado.
    const handleEditDependency = (data) => {
        setDependencyData({
            id: data.id,
            fiscalia: data.fiscalia || '',
            tipoFiscalia: data.tipo_fiscalia || '',
            nombreFiscalia: data.nombre_fiscalia || '',
            ruc: data.ruc || '',
            telefono: data.telefono || '',
        });
        setOriginalDependencyData({
            ruc: data.ruc || '',
        });
        // Suponiendo que el objeto "data" tiene "sede_fk" y que éste es un id o un objeto con id
        setSelectedHeadquarter(data.sede_fk?.id ? data.sede_fk.id : data.sede_fk);
        setEditing(true);
        
        // Realizamos el scroll suave hacia el formulario de edición
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Callback para eliminar: se invoca desde el listado.
    const handleDeleteDependency = async (id) => {
        try {
            await dependencyService.deleteDependency(id);
            alert('Dependencia eliminada exitosamente.');
            // Se podría refrescar la lista de dependencias si se eleva el estado,
            // o se notifica al componente listado para que realice un nuevo fetch.
        } catch (error) {
            console.error('Error al eliminar la dependencia:', error);
            alert('Ocurrió un error al eliminar la dependencia. Intente nuevamente.');
        }
    };

    return (
        <Box className="flex flex-col w-full gap-6">
            {/* Se asigna el ref al contenedor del formulario */}
            <Box ref={formRef} className="flex flex-col w-full bg-white rounded-2xl gap-4 shadow-md" sx={{ p: 5, boxShadow: 2 }}>
                <Box className="flex items-start">
                    <Typography variant="h6" component="h1" fontWeight="semibold" fontFamily={'Teko, sans-serif'}>
                        {editing ? 'EDITAR DEPENDENCIA' : 'REGISTRAR DEPENDENCIAS'}
                    </Typography>
                </Box>

                <Box>
                    <TextField
                        label="Fiscalía*"
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="fiscalia"
                        value={dependencyData.fiscalia}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box className="flex gap-4">
                    <TextField
                        label="Tipo de fiscalía*"
                        variant="outlined"
                        className="flex-1"
                        size="small"
                        name="tipoFiscalia"
                        value={dependencyData.tipoFiscalia}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Nombre fiscalía*"
                        variant="outlined"
                        className="flex-1"
                        size="small"
                        name="nombreFiscalia"
                        value={dependencyData.nombreFiscalia}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box className="flex gap-4">
                    <TextField
                        label="RUC*"
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="ruc"
                        value={dependencyData.ruc}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Teléfono"
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="telefono"
                        value={dependencyData.telefono}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box>
                    <FormControl fullWidth>
                        <InputLabel id="headquarter-select-label" size="small">Sede*</InputLabel>
                        <Select
                            labelId="headquarter-select-label"
                            id="headquarter-select"
                            value={selectedHeadquarter}
                            onChange={handleHeadquarterChange}
                            size="small"
                            label="Sede*"
                        >
                            {loading ? (
                                <MenuItem disabled>Cargando...</MenuItem>
                            ) : (
                                headquarters.map((headquarter) => (
                                    <MenuItem key={headquarter.id} value={headquarter.id}>
                                        {headquarter.nombre}
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

            <Box className="bg-white rounded-2xl shadow-md" sx={{ p: 5, boxShadow: 2 }}>
                {/* Se pasan los callbacks de edición y eliminación al listado */}
                <ListDependencyData onEditRow={handleEditDependency} onDeleteRow={handleDeleteDependency} />
            </Box>
        </Box>
    );
};

export default RegisterDependencies;
