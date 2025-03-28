// src/hooks/useCargaFiscal.jsx
import { useQuery } from "@tanstack/react-query";

// Leer la IP del backend y el token desde localStorage
const apiIp = import.meta.env.VITE_API;
const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);

/**
 * Llama a la API http://192.168.1.3/api/ges_reportes/cargaSede
 * usando método POST, enviando los datos en el body (JSON).
 * Retorna el objeto data que contiene la información de "list_dependencias",
 * "data_generalSede", "graf_ingreso_caso_depens", "ranking_dependencias", etc.
 */
export async function fetchCargaFiscal({ 
  id_sedes, 
  fe_inicio, 
  fe_fin, 
  estado, 
  id_dependencia 
}) {
  const url = `http://${apiIp}/api/ges_reportes/cargaSede`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id_sedes,
      fe_inicio,
      fe_fin,
      estado,
      id_dependencia,
    }),
  });

  if (!response.ok) {
    throw new Error("Error al obtener la carga fiscal");
  }

  const jsonData = await response.json();
  // La API retorna un objeto con { message, status, token, data }
  // Normalmente solo se necesita jsonData.data
  return jsonData.data;
}

/**
 * Hook useCargaFiscal
 * Realiza la llamada al endpoint cargaSede con los datos requeridos.
 * "params" debe ser un objeto con { id_sede, fe_inicio, fe_fin, estado, id_dependencia }
 * 
 * Ejemplo de uso:
 * const { data, isLoading, isError, refetch } = useCargaFiscal({
 *   id_sede: 6,
 *   fe_inicio: "2024-01-01 00:00:00",
 *   fe_fin: "2025-12-31 23:59:59",
 *   estado: null,
 *   id_dependencia: null
 * }, {
 *   enabled: false // si deseas controlarlo manualmente
 * });
 */
export function useCargaFiscal(params, options = {}) {
  return useQuery({
    // Clave fija para la caché: "carga-fiscal"
    queryKey: ["carga-fiscal"],
    // queryFn recibe los parámetros a través de una función
    queryFn: () => fetchCargaFiscal(params),
    staleTime: Infinity,         // Nunca se marca "stale" durante la sesión
    cacheTime: 1000 * 60 * 5,    // Se guarda en caché 5 minutos
    refetchOnWindowFocus: false, // No se refetch al cambiar de pestaña
    refetchOnReconnect: false,   // No se refetch al reconectar
    ...options,
  });
}
