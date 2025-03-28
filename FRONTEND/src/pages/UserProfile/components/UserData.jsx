import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";

const FormField = ({ label, name, value, isEditing, onChange }) => {
  return (
    <div className="flex gap-4 items-center">
      <label className="text-lg w-36">{label}:</label>
      <TextField
        name={name}
        value={value || ""}
        variant="outlined"
        size="small"
        fullWidth
        onChange={onChange}
        InputProps={{ readOnly: !isEditing }} // Bloqueado si no se está editando
      />
    </div>
  );
};

const UserData = ({ profileData, isEditing }) => {
  if (!profileData) {
    return <div>Cargando datos...</div>;
  }
  
  // Se usa profileData.data_user directamente para inicializar el estado local
  const [user, setUser] = useState(profileData.data_user || {});

  // Actualizar el estado local cada vez que profileData cambie
  useEffect(() => {
    setUser(profileData.data_user || {});
  }, [profileData]);

  // Manejador para actualizar el estado local al escribir en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="flex flex-col w-full pt-8 gap-8 bg-white font-teko font-normal px-5">
      <fieldset className="flex flex-col w-full gap-6">
        <div className="flex gap-6 w-full text-start">
          {/* Primera columna */}
          <div className="flex flex-col w-1/2 gap-4">
            <FormField
              label="Nombres"
              name="nombre"
              value={user.nombre || ""}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <FormField
              label="Teléfono"
              name="telefono"
              value={user.telefono || ""}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <FormField
              label="DNI"
              name="dni"
              value={user.dni || ""}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <FormField
              label="Tipo de fiscal"
              name="tipo_fiscal"
              value={user.tipo_fiscal || ""}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>
          {/* Segunda columna */}
          <div className="flex flex-col w-1/2 gap-4">
            <FormField
              label="Apellidos"
              name="apellido"
              value={user.apellido || ""}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <FormField
              label="Correo"
              name="email"
              value={user.email || ""}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <FormField
              label="Dirección"
              name="direccion"
              value={user.direccion || ""}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>
        </div>
      </fieldset>
    </form>
  );
};

export default UserData;
