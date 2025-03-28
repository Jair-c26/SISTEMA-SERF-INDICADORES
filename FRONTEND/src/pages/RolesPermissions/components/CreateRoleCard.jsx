import React from 'react';
import crSVG from '../../../assets/icons/cr.svg'; // Asegúrate de que el path es correcto

const CreateRoleCard = () => {
    return (
        <div
            className="flex flex-row items-center gap-3 p-4 bg-white rounded-lg shadow-lg min-w-[280px] min-h-[140px]"
        >
            {/* Primer bloque: Ícono */}
            <div className="flex justify-center items-center">
                <img
                    src={crSVG}
                    alt="Ícono de crear rol"
                    className="w-16 h-16" // Reducir el tamaño del icono
                />
            </div>

            {/* Segundo bloque: Botón y texto */}
            <div className="flex flex-col items-start">
                <button
                    className="bg-[#183466] text-white py-2 px-4 rounded-md font-medium mb-2"
                >
                    Agregar un nuevo rol
                </button>
                <p className="text-base text-gray-500">
                    Añadir nuevo rol,<br /> si no existe
                </p>
            </div>
        </div>
    );
};

export default CreateRoleCard;
