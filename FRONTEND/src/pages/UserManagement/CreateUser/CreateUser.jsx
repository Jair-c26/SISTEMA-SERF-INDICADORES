import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import VerticalTabs from '../../../components/Tabs/VerticalTabs';
import { useAuth } from '../../../context/AuthContext'; // Importar el contexto
import userListService from '../../../services/api/user-list/userListService'; // Importar el servicio de usuario

const CreateUser = () => {
    const { userFormData } = useAuth(); // Obtener los datos del usuario desde el contexto
    const [loading, setLoading] = useState(false); // Estado de carga
    const [error, setError] = useState(null); // Estado para manejar errores
    const [success, setSuccess] = useState(false); // Estado para manejar éxito

    const handleSave = async () => {
        setLoading(true); // Activar la carga
        setError(null); // Limpiar cualquier error previo
        setSuccess(false); // Limpiar el estado de éxito
        console.log('los datos recopilados son:', userFormData);
        try {
            const response = await userListService.createUser(userFormData); // Llamar a la API para crear el usuario
            setSuccess(true); // Si la creación es exitosa, actualizar el estado de éxito
            console.log('Usuario creado con éxito:', response);
        } catch (error) {
            setError('Error al crear el usuario.'); // Mostrar un mensaje de error
            console.error('Error al crear el usuario:', error);
        } finally {
            setLoading(false); // Desactivar la carga
        }
    };

    return (
        <div className="flex flex-col font-teko w-full gap-4 px-6 py-6 bg-white shadow-md">
            <h1 className="text-xl font-semibold text-start mb-4">Agregar nuevo usuario</h1>
            
            <div className="flex w-full">
                <VerticalTabs />
            </div>

            {/* Mensaje de éxito o error */}
            {error && (
                <div className="mt-2 text-red-500 text-center">
                    <p>{error}</p>
                </div>
            )}
            {success && (
                <div className="mt-2 text-green-500 text-center">
                    <p>Usuario creado con éxito!</p>
                </div>
            )}

            <div className="flex justify-end gap-4 mt-6">
                <Button variant="outlined" style={{ width: '120px' }}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ width: '120px' }}
                    onClick={handleSave} // Al hacer clic en "Guardar", ejecuta la función handleSave
                    disabled={loading} // Desactivar el botón mientras se está cargando
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar'}
                </Button>
            </div>
        </div>
    );
};

export default CreateUser;
