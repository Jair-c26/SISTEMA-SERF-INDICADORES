"use client";

import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubMenu,
  DropdownMenuSubMenuContent,
  DropdownMenuSubMenuTrigger,
  DropdownMenuTrigger,
} from "./DropdownMenu";
const apiIp = import.meta.env.VITE_API;
import { useTheme } from "next-themes";
import { IconSunHigh, IconMoon, IconDeviceDesktop, IconArrowUpRight } from '@tabler/icons-react';
// Importar useAuth para obtener la información del usuario y logout
import { useAuth } from "../../context/AuthContext";
// Usar useNavigate de react-router-dom en lugar de next/navigation
import { useNavigate } from "react-router-dom";

export function DropdownUserProfile({ children, align = "start" }) {
  // Manejo de tema (opcional con next-themes)
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Obtener usuario, logout y token del contexto
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Función para manejar el "Sign out"
  async function handleSignOut() {
    try {
      // Disparar un evento global para que Dashboard muestre el LoadingBackdrop a pantalla completa
      window.dispatchEvent(new Event('logout:start'));
      
      // Llamada a la API de logout, asumiendo método POST
      const res = await fetch(`http://${apiIp}/api/logout/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Error al cerrar sesión en el servidor");
      }
      // Limpiar la sesión usando logout() del AuthContext
      logout();
      // Redirigir al usuario a la ruta raíz (por ejemplo, App.jsx)
      navigate("/");
    } catch (error) {
      console.error("Error en logout:", error);
      // Opcional: Se podría disparar otro evento para indicar error (por ejemplo, 'logout:error')
      window.dispatchEvent(new Event('logout:error'));
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="sm:!min-w-[200px]">
        {/* Se reemplaza el valor estático por el email del usuario */}
        <DropdownMenuLabel>{user?.email || "default@example.com"}</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuSubMenu>
            <DropdownMenuSubMenuTrigger>Temas</DropdownMenuSubMenuTrigger>
            <DropdownMenuSubMenuContent>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => setTheme(value)}
              >
                <DropdownMenuRadioItem aria-label="Light Mode" value="light" iconType="check">
                  <IconSunHigh className="size-4 shrink-0" aria-hidden="true" />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem aria-label="Dark Mode" value="dark" iconType="check">
                  <IconMoon className="size-4 shrink-0" aria-hidden="true" />
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem aria-label="System Mode" value="system" iconType="check">
                  <IconDeviceDesktop className="size-4 shrink-0" aria-hidden="true" />
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubMenuContent>
          </DropdownMenuSubMenu>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Perfil
            <IconArrowUpRight className="mb-1 ml-1 size-3 shrink-0 text-gray-500" aria-hidden="true" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            Configuracion
            <IconArrowUpRight className="mb-1 ml-1 size-3 shrink-0 text-gray-500" aria-hidden="true" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            Reporte
            <IconArrowUpRight className="mb-1 ml-1 size-3 shrink-0 text-gray-500" aria-hidden="true" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleSignOut}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
