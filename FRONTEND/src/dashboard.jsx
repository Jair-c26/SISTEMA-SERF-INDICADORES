import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useQueryClient } from '@tanstack/react-query';
import LoadingBackdrop from "./components/LoadingBackdrop"; // Asegúrate de la ruta correcta
// Importa el resto (AuthContext, Sidebar, etc.)
import { SidebarProvider } from "./components/dashboard/Sidebar";
import { AppSidebar } from "./components/dashboard/AppSidebar";
import { SidebarTrigger } from "./components/dashboard/Sidebar";
import { Breadcrumbs } from "./components/dashboard/Breadcrumbs";
import RolesPermissions from "./pages/RolesPermissions/RolesPermissions";
import Reports from "./pages/StatisticalReports/Reports";
import Documents from "./pages/DocumentManager/Documents";
import Users from "./pages/UserManagement/Users";
import Areas from "./pages/RegisterAreas/Areas";
import DeadlineControl from "./pages/StatisticalFunctions/DeadlineControl/DeadlineControl";
import TaxBurden from "./pages/StatisticalFunctions/WorkLoad/components/TaxBurden";
import TaxDetails from "./pages/StatisticalFunctions/TaxDetails/TaxDetails";
import CrimeIncidence from "./pages/StatisticalFunctions/CrimesHighestIncidence/CrimeIncidence";
import TaxUsers from "./pages/UserManagement/TaxUsers";
import ControlPanel from "./pages/ControlPanel/ControlPanel";

export default function Dashboard() {
  // Estado para controlar el LoadingBackdrop al cerrar sesión
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const handleLogoutStart = () => setLogoutLoading(true);
    const handleLogoutError = () => setLogoutLoading(false);
    // Escuchar el evento global disparado en DropdownUserProfile
    window.addEventListener("logout:start", handleLogoutStart);
    window.addEventListener("logout:error", handleLogoutError);
    return () => {
      window.removeEventListener("logout:start", handleLogoutStart);
      window.removeEventListener("logout:error", handleLogoutError);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* LoadingBackdrop a nivel Dashboard */}
      <LoadingBackdrop open={logoutLoading} />
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <Breadcrumbs />
            </div>
          </header>

          <main className="flex-1 p-4 overflow-auto">
            <Routes>
              <Route path="home" element={<ControlPanel />} />
              <Route path="estadisticas" element={<Reports />} />
              <Route path="estadisticas/DeadlineControl" element={<DeadlineControl/>} />
              <Route path="estadisticas/TaxBurden" element={<TaxBurden/>} />
              <Route path="estadisticas/TaxDetails" element={<TaxDetails/>} />
              <Route path="estadisticas/CrimeIncidence" element={<CrimeIncidence/>} />
              <Route path="roles" element={<RolesPermissions />} />
              <Route path="Area" element={<Areas />} />
              <Route path="documentos" element={<Documents />} />
              <Route path="Agentes" element={<Users />} />
              <Route path="Fiscales" element={<TaxUsers />} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
