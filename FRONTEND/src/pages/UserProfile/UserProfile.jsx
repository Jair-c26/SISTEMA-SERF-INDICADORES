import React, { useState, useEffect } from "react";
import DefaultTabs from "../../components/Tabs/DefaultTabs";
import Profile from "./components/Profile";
import UserActivity from "./components/UserActivity";
import profileDataService from "../../services/api/profileData-list/profileDataService";
import { Button } from "@mui/material";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  // Estado para controlar el modo edición (inicialmente bloqueado)
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileDataService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };
    fetchProfile();
  }, []);

  // Función para activar el modo edición (se llama desde Profile)
  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="flex flex-col w-full h-full gap-4 font-teko p-2 text-start">
      {/* Sección de Perfil y Datos Personales */}
      <div className="flex w-full h-full gap-4">
        {/* Perfil */}
        <div className="w-1/4">
          <Profile
            userName={
              profile && profile.data_user
                ? `${profile.data_user.nombre} ${profile.data_user.apellido}`
                : ""
            }
            userRole={
              profile && profile.data_user && profile.data_user.roles_fk
                ? profile.data_user.roles_fk.roles
                : ""
            }
            fechaIngreso={
              profile && profile.data_user ? profile.data_user.fecha_ingreso : ""
            }
            activo={profile && profile.data_user ? profile.data_user.activo : 0}
            onEdit={handleEdit}  // Pasa la función para activar el modo edición
          />
        </div>

        {/* Datos Personales */}
        <div className="flex flex-col w-3/4 bg-white rounded-2xl p-6 gap-4 shadow-md">
          <h1 className="text-xl font-semibold">Datos Personales</h1>
          {/* Se pasan profileData e isEditing a DefaultTabs */}
          <DefaultTabs profileData={profile} isEditing={isEditing} />
          {/* Botón Guardar habilitado sólo en modo edición */}  
          <div className="flex justify-end mt-4">
            <Button
              variant="contained"
              className="w-[120px] text-xl bg-[#183466] text-white rounded-md shadow-md hover:bg-[#152B52] px-4 py-1 transition duration-300"
              disabled={!isEditing}
            >
              Guardar
            </Button>
          </div>
        </div>
      </div>

      {/* Sección de Actividad de Usuario y Datos Adicionales */}
      <div className="flex w-full gap-4">
        {/* Actividad de Usuario */}
        <div className="flex flex-col w-2/3 bg-white rounded-2xl p-6 gap-4 shadow-md">
          <h1 className="text-xl font-semibold">Actividad de Usuario</h1>
          <UserActivity />
        </div>

        {/* Datos Adicionales */}
        <div className="flex flex-col w-1/3 bg-white rounded-2xl p-6 gap-4 shadow-md">
          <h1 className="text-xl font-semibold">Datos Adicionales</h1>
          {/* Aquí puedes agregar más contenido en el futuro */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
