// src/hooks/useListImport.jsx
import { useQuery } from "@tanstack/react-query";

const apiIp = import.meta.env.VITE_API;
const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);

async function fetchListImport() {
  const response = await fetch(`http://${apiIp}/api/ges_user/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener la lista de usuarios");
  }

  // Estructura de la respuesta:
  // {
  //   message: "Lista de usuarios activos",
  //   status: 200,
  //   token: "",
  //   data: [...]
  // }
  const data = await response.json();
  return data.data; // Devolvemos únicamente el array con los usuarios
}

/**
 * Hook personalizado para obtener la lista de usuarios (import)
 * mediante React Query.
 */
export function useListImport() {
  return useQuery({
    queryKey: ["list-import"], // Nombre único de la query
    queryFn: fetchListImport,  // Función asíncrona que hace la llamada al API
    staleTime: 1000 * 60,      // 1 minuto
    cacheTime: 1000 * 60 * 5,   // 5 minutos
  });
}
