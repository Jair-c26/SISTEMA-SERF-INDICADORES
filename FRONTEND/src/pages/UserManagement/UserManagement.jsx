import React from "react";
import UserGeneralInfo from "./components/UserGeneralInfo";
import UserIconTabs from "../../components/Tabs/UserIconTabs";

const UserManagement = () => {
  return (
    <div className="flex flex-col h-full w-full items-start p-5 gap-4 transition-all duration-300">
      <h1 className="text-xl font-bold">Gestión de usuarios - Usuarios</h1>
      <div className="flex flex-col h-full w-full">
        <UserGeneralInfo />
        <UserIconTabs />
      </div>
    </div>
  );
};
export default UserManagement;