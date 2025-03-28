import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarLink,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarSubLink,
} from "./Sidebar";
import { RiArrowDownSFill } from "@remixicon/react";
import { IconUser } from "@tabler/icons-react";
import { IconHome } from "@tabler/icons-react";
import { IconFolder } from "@tabler/icons-react";
import { IconChartCandle } from "@tabler/icons-react";
import { IconBuildings } from "@tabler/icons-react";
import { IconAlignBoxBottomCenter } from "@tabler/icons-react";
import { UserProfile } from "./UserProfile";
import { Divider } from "./Divider";
import { Link, useLocation } from "react-router-dom";
import escudoSVG from "../../assets/icons/escudo.svg";
import { useAuth } from "../../context/AuthContext"; // <-- Importa tu AuthContext
// Lee el mapeo de permisos desde .env
const routePermissions = JSON.parse(import.meta.env.VITE_ROUTE_PERMISSIONS);

function LogoIcon() {
  return (
    <img
      src={escudoSVG}
      alt="Escudo"
      className="w-10 h-10"
    />
  );
}

// Rutas principales
const navigation = [
  { name: "Home", href: "/dashboard/Home", icon: IconHome },
  { name: "Inbox", href: "/inbox", icon: IconChartCandle, notifications: 2 },
];

// Rutas con submenús
const navigation2 = [
  {
    name: "Reportes estadisticos",
    href: "/Reporte",
    icon: IconAlignBoxBottomCenter,
    children: [
      { name: "Reportes estadisticos", href: "/dashboard/estadisticas" },
    ],
  },
  {
    name: "Gestion usuarios",
    href: "/Gestion",
    icon: IconUser,
    children: [
      { name: "Usuarios", href: "/dashboard/Agentes" },
      { name: "Fiscales", href: "/dashboard/Fiscales" },
      { name: "Roles y permisos", href: "/dashboard/roles" },
      { name: "Historial de actividad", href: "/sales/insights" },
    ],
  },
  {
    name: "Gestion areas",
    href: "/Gestion",
    icon: IconBuildings,
    children: [
      { name: "Areas fiscales", href: "/dashboard/Area" },
      { name: "Lista de fiscales", href: "/products/Area" },
      { name: "Logistica", href: "/products/suppliers" },
    ],
  },
  {
    name: "Gestion archivos",
    href: "/Gestion",
    icon: IconFolder,
    children: [
      { name: "Archivos", href: "/dashboard/documentos" },
    ],
  },
];

export function AppSidebar({ ...props }) {
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState([]);
  const { user } = useAuth(); // <-- Extrae el usuario del AuthContext
  const userPermissions = user?.roles_fk?.permisos_fk || {}; // Objeto con {panel_control: 1, ges_user: 1, ...}

  const toggleMenu = (name) => {
    setOpenMenus((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  // Función para verificar si el usuario tiene permiso para ver una ruta
  const canShowRoute = (routeName) => {
    // routeName = "Home", "Inbox", etc.
    // Conviértelo a minúsculas para que coincida con las claves en routePermissions
    const key = routePermissions[routeName.toLowerCase()];
    // Si no existe key, asumimos que no requiere permiso (o ajusta a tu lógica)
    if (!key) return true;
    // Retorna true si userPermissions[key] === 1
    return userPermissions[key] === 1;
  };

  return (
    <Sidebar {...props} className="bg-gray-50">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-white p-1 shadow-sm ring-1 ring-gray-200">
            <LogoIcon />
          </span>
          <div>
            <span className="block text-sm font-semibold text-gray-900">
              Ministerio Publico
            </span>
            <span className="block text-xs text-gray-900">
              Madre de Dios
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {/* Aquí podrías poner un Input de búsqueda si lo deseas */}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Rutas Principales */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => {
                // Verifica si el usuario puede ver esta ruta
                if (!canShowRoute(item.name)) return null;

                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <Link to={item.href}>
                      <SidebarLink
                        isActive={isActive}
                        icon={item.icon}
                        notifications={item.notifications}
                      >
                        {item.name}
                      </SidebarLink>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-3">
          <Divider className="my-0 py-0" />
        </div>

        {/* Rutas con Submenús */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {navigation2.map((item) => {
                // Si el usuario no tiene permiso para la sección principal, oculta todo el submenú
                if (!canShowRoute(item.name)) return null;

                const isOpen = openMenus.includes(item.name);

                return (
                  <SidebarMenuItem key={item.name}>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className="flex w-full items-center justify-between gap-x-2.5 rounded-md p-2 text-base text-gray-900 hover:bg-gray-200/50 sm:text-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="size-[18px] shrink-0" aria-hidden="true" />
                        {item.name}
                      </div>
                      <RiArrowDownSFill
                        className={`size-5 shrink-0 transform text-gray-400 transition-transform ${
                          isOpen ? "rotate-0" : "-rotate-90"
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {item.children && isOpen && (
                      <SidebarMenuSub>
                        <div className="absolute inset-y-0 left-4 w-px bg-gray-300" />
                        {item.children.map((child) => {
                          if (!canShowRoute(child.name)) return null;

                          const childActive = location.pathname === child.href;
                          return (
                            <SidebarMenuItem key={child.name}>
                              <Link to={child.href}>
                                <SidebarSubLink isActive={childActive}>
                                  {child.name}
                                </SidebarSubLink>
                              </Link>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="border-t border-gray-200" />
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}
