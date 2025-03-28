import React from "react";
import userSVG from "../../../assets/icons/user.svg";
import { Button } from "@mui/material";

const VerifiedBadge = ({ activo }) => {
  return (
    <div
      className="flex flex-row items-center mt-2 px-3 py-1 bg-gray-200 rounded-md"
      role="status"
    >
      <div
        className={`w-3 h-3 rounded-full mr-2 ${activo === 1 ? "bg-green-700" : "bg-red-700"}`}
      ></div>
      <p className="font-teko text-base">
        {activo === 1 ? "Perfil verificado" : "Perfil no verificado"}
      </p>
    </div>
  );
};

const Profile = ({
  userName = "Vikap Aslam",
  userRole = "Usuario Estadístico",
  fechaIngreso = "",
  activo = 0,
  onEdit,  // Callback para activar el modo edición
}) => {
  return (
    <section className="flex flex-col w-full p-6 bg-white rounded-2xl shadow-lg gap-4">
      {/* Encabezado */}
      <header className="flex flex-col items-start text-start">
        <h2 className="font-teko text-xl font-semibold">Perfil Personal</h2>
        <p className="font-teko text-base">
          Usuario creado en{" "}
          <strong>
            {fechaIngreso
              ? new Date(fechaIngreso).toLocaleDateString()
              : "N/A"}
          </strong>
        </p>
      </header>

      {/* Sección de Imagen y Datos */}
      <figure className="flex flex-col items-center">
        <img
          src={userSVG}
          alt={`Foto de perfil de ${userName}`}
          className="w-[150px] h-[150px] rounded-full border-2 border-gray-300 shadow-lg"
        />

        {/* Contenedor del estado de verificación */}
        <VerifiedBadge activo={activo} />

        <figcaption className="text-center">
          <h3 className="font-teko font-semibold text-2xl mt-1">{userName}</h3>
          <p className="font-teko font-medium text-base text-gray-600">
            {userRole}
          </p>
        </figcaption>
      </figure>

      {/* Botón de Edición */}  
      <div className="flex justify-center mt-4">
        <button
          type="button"
          className="flex font-teko text-lg bg-[#183466] text-white rounded-lg shadow-md hover:bg-[#152B52] px-4 py-2 transition duration-300"
          aria-label="Editar perfil de usuario"
          onClick={onEdit}  // Activa el modo edición al hacer clic
        >
          Editar perfil
        </button>
      </div>
    </section>
  );
};

export default Profile;
