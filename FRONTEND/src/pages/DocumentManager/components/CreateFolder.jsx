import React from 'react';
import createfolderSVG from '../../../assets/icons/createfolder.svg';

const CreateFolder = () => {
    return (
        <div className="flex items-center gap-3 p-6 bg-white rounded-xl shadow-lg w-auto font-teko">
            <img 
                src={createfolderSVG} 
                alt="Ícono de crear carpeta" 
                className="w-16 h-16" // Reducir el tamaño del ícono
            />
            <div className="flex flex-col items-start">
                <h2 className="text-xl font-medium">
                    Crear Carpeta
                </h2>
                <p className="text-sm text-gray-500">
                    Aquí puedes crear una nueva carpeta para organizar tus archivos.
                </p>
            </div>
        </div>
    );
};

export default CreateFolder;
