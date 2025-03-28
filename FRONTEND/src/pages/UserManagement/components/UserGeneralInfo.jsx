import React from "react";

const UserGeneralInfo = () => {
  const fileCount = 100;

  return (
    <div className="flex flex-col w-full gap-8 rounded-2xl bg-white">
      <div className="flex flex-col h-full w-full gap-3">
        {/* Información general */}
        <div className="flex flex-col bg-white p-5 items-start rounded-xl shadow-md">
          <h2 className="text-base font-bold">Gestión de Usuarios</h2>
          <p className="text-gray-600">
            Gestión de usuarios / Archivos / <span>{fileCount}</span> Usuarios
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserGeneralInfo;
