import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

const CreateBranch = () => {
    return (
        <div className="flex flex-col w-full pt-8 space-y-8">
            {/* Sección Registrar Sede */}
            <div className="flex flex-col w-full bg-white p-5 rounded-2xl space-y-6">
                <h1 className="text-[13px] font-bold text-gray-800 text-start">REGISTRAR SEDE</h1>
                {/* Campos para registrar sede */}
                <div>
                    <TextField label="Nombre Sede*" variant="outlined" fullWidth size="small" />
                </div>
                <div className="flex space-x-4">
                    <TextField label="Teléfono*" variant="outlined" className="flex-1" size="small" />
                    <TextField label="RUC*" variant="outlined" className="flex-1" size="small" />
                </div>
                <div className="flex space-x-4">
                    <TextField label="Provincia*" variant="outlined" className="flex-1" size="small" />
                    <TextField label="Distrito*" variant="outlined" className="flex-1" size="small" />
                </div>
                <div className='flex'>
                    <TextField label="Código Postal*" variant="outlined" className='w-2/5' size="small" />
                </div>
            </div>

            <div className='flex flex-row gap-4'>
                {/* Sección Registrar Dependencias */}
                <div className="flex flex-col w-full bg-white p-5 rounded-2xl space-y-6">
                    <h1 className="text-[13px] font-bold text-gray-800 text-start">REGISTRAR DEPENDENCIAS</h1>

                    {/* Primera fila: Dependencias */}
                    <div className="flex space-x-4">
                        <TextField label="Dependencias" variant="outlined" size="small" fullWidth />
                    </div>

                    {/* Segunda fila: Tipo de fiscalía y Nombre fiscalía */}
                    <div className="flex space-x-4">
                        <TextField label="Tipo de Fiscalía" variant="outlined" size="small" fullWidth />
                        <TextField label="Nombre de Fiscalía" variant="outlined" size="small" fullWidth />
                    </div>

                    {/* Tercera fila: Responsable */}
                    <div className='flex'>
                        <TextField label="Responsable" variant="outlined" className='w-2/5' size="small" />
                    </div>
                </div>

                {/* Agregar button */}
                <div className="flex justify-center">
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            width: '40px',  // Define un tamaño fijo para el botón
                            height: '40px', // Asegura que el ancho y el alto sean iguales
                            borderRadius: '50%',  // Hace que sea completamente redondo
                            minWidth: 0,   // Evita el ancho mínimo que podría interferir con la forma
                            padding: 0,    // Elimina cualquier padding para mantener la forma
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#152B52',
                        }}
                    >
                        <AddIcon /> {/* Colocamos el ícono directamente dentro del botón */}
                    </Button>
                </div>
            </div>
            {/* Botones de Cancelar y Guardar */}
            <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outlined" sx={{ width: '120px' }}>
                    Cancelar
                </Button>
                <Button variant="contained" color="primary" sx={{ width: '120px' }}>
                    Guardar
                </Button>
            </div>    
        </div>
    );
};

export default CreateBranch;
