import React from "react";
import contadorSVG from "../../../assets/icons/contador.svg";

// Componente para mostrar los totales de usuarios con su situación
const UserTotal = ({ userSituation, totalUsers }) => {
  return (
    <div className="flex flex-row items-center justify-between gap-4 p-4 rounded-lg shadow-md bg-white w-full font-teko">
      <div className="flex flex-col text-start">
        <p className="text-base font-medium text-gray-600">{userSituation}</p>
        <h2 className="text-base font-semibold">{totalUsers}</h2>
      </div>
      {/* Ícono */}
      <img src={contadorSVG} alt="contador" className="w-14 h-14" />
    </div>
  );
};

const UserCount = () => {
  // Datos para las tarjetas
  const userData = [
    { userSituation: "USER TOTALS", totalUsers: 614 },
    { userSituation: "SUPER USER TOTAL", totalUsers: 124 },
    { userSituation: "ADMIN USER TOTAL", totalUsers: 504 },
    { userSituation: "USER BASIC TOTAL", totalUsers: 100 },
  ];

  return (
    <div className="flex flex-row w-full gap-4">
      {userData.map((data, index) => (
        <div key={index} className="flex-1">
          <UserTotal userSituation={data.userSituation} totalUsers={data.totalUsers} />
        </div>
      ))}
    </div>
  );
};

export default UserCount;
