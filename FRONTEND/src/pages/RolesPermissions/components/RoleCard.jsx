import React from 'react';

const RoleCard = ({ Icon_Rol, Rol_Asignado, Total_rol, onClick }) => {
    return (
        <div
            onClick={onClick} // Maneja el evento de clic
            className="flex flex-row items-center gap-3 rounded-lg bg-white p-4 shadow-lg min-w-[280px] min-h-[140px] cursor-pointer hover:shadow-xl transition-shadow duration-300 justify-between"
            role="button"
            aria-labelledby="role-card"
        >
            {/* Primer bloque: Rol_Asignado, "Total de usuarios" y Botón */}
            <div className="flex flex-col items-start">
                <h2
                    id="role-card"
                    className="text-lg font-semibold text-gray-800 break-words max-w-[220px]"
                >
                    {Rol_Asignado}
                </h2>
                <p className="text-base text-gray-500">Total de usuarios</p>
                <button className="text-base font-medium text-[#152B52] hover:underline mt-2">
                    Editar Rol
                </button>
            </div>

            {/* Segundo bloque: Icon_Rol centrado y debajo el Total_rol */}
            <div className="flex flex-col items-center gap-1">
                <img
                    src={Icon_Rol}
                    alt="Ícono de Rol"
                    className="w-16 h-16" // Reducir el tamaño del icono
                />
                <p className="text-sm text-gray-500">{Total_rol}</p>
            </div>
        </div>
    );
};

export default RoleCard;
