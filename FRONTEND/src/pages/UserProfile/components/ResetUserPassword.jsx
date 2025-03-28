import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ResetUserPassword = ({ isEditing }) => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleTogglePassword = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <div className="flex flex-col w-full pt-8 gap-8 bg-white font-teko font-normal">
      {/* Sección Cambiar Contraseña */}
      <div className="flex flex-col w-full gap-6 px-5">
        {/* Contraseña Actual */}
        <div className="flex items-center gap-4">
          <label className="text-lg w-40">Contraseña actual:</label>
          <FormControl variant="outlined" fullWidth size="small">
            <InputLabel htmlFor="current-password">Contraseña actual</InputLabel>
            <OutlinedInput
              id="current-password"
              type={showPassword.current ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleTogglePassword("current")}
                    edge="end"
                    disabled={!isEditing}  // Deshabilitado si no se edita
                  >
                    {showPassword.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Contraseña actual"
              disabled={!isEditing}
            />
          </FormControl>
        </div>

        {/* Nueva Contraseña */}
        <div className="flex items-center gap-4">
          <label className="text-lg w-40">Nueva contraseña:</label>
          <FormControl variant="outlined" fullWidth size="small">
            <InputLabel htmlFor="new-password">Nueva contraseña</InputLabel>
            <OutlinedInput
              id="new-password"
              type={showPassword.new ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleTogglePassword("new")}
                    edge="end"
                    disabled={!isEditing}
                  >
                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Nueva contraseña"
              disabled={!isEditing}
            />
          </FormControl>
        </div>

        {/* Confirmar Contraseña */}
        <div className="flex items-center gap-4">
          <label className="text-lg w-40">Confirmar contraseña:</label>
          <FormControl variant="outlined" fullWidth size="small">
            <InputLabel htmlFor="confirm-password">Confirmar contraseña</InputLabel>
            <OutlinedInput
              id="confirm-password"
              type={showPassword.confirm ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleTogglePassword("confirm")}
                    edge="end"
                    disabled={!isEditing}
                  >
                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirmar contraseña"
              disabled={!isEditing}
            />
          </FormControl>
        </div>

        {/* Requisitos de Contraseña */}
        <div className="flex flex-col bg-gray-100 p-6 rounded-md items-start">
          <p className="text-base text-gray-700">La contraseña debe cumplir con los siguientes requisitos:</p>
          <ul className="text-sm text-gray-600 list-disc ml-6 text-start">
            <li>Mínimo 8 caracteres</li>
            <li>Al menos una letra mayúscula</li>
            <li>Al menos un número</li>
            <li>Un carácter especial (por ejemplo, @, #, $, %)</li>
          </ul>
        </div>

        
      </div>
    </div>
  );
};

export default ResetUserPassword;
