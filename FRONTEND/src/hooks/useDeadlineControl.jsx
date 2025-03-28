// src/hooks/useDeadlineControl.jsx

import { useQuery } from "@tanstack/react-query";

// Leer la IP del backend y el token desde localStorage
const apiIp = import.meta.env.VITE_API;
const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);

/**
 * Llama a la API http://192.168.137.229/api/ges_reportes/plazo-sede
 * usando método POST, enviando los datos en el body (JSON).
 * Retorna el objeto data que contiene la información propia de "plazo-sede",
 * según la estructura que devuelva el servidor.
 */
export async function fetchDeadlineControl({
    id_sedes,
    fe_inicio,
    fe_fin,
    estado,
    id_dependencia,
}) {
    const url = `http://${apiIp}/api/ges_reportes/plazo-sede`;

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
        throw new Error("Error al obtener los datos de plazo-sede");
    }

    const jsonData = await response.json();
    // La API retorna un objeto con { message, status, token, data }
    // Normalmente solo se necesita jsonData.data
    return jsonData.data;
}

/**
 * Hook useDeadlineControl
 * Realiza la llamada al endpoint "plazo-sede" con los datos requeridos.
 * "params" debe ser un objeto con { id_sedes, fe_inicio, fe_fin, estado, id_dependencia }
 *
 * Ejemplo de uso:
 * const { data, isLoading, isError, refetch } = useDeadlineControl({
 *   id_sedes: 6,
 *   fe_inicio: "2007-01-01",
 *   fe_fin: "2025-12-31",
 *   estado: null,
 *   id_dependencia: 10
 * }, {
 *   enabled: false // si deseas controlarlo manualmente
 * });
 */
export function useDeadlineControl(params, options = {}) {
    return useQuery({
        // Clave de caché para la consulta
        queryKey: ["deadline-control"],
        queryFn: () => fetchDeadlineControl(params),
        staleTime: Infinity,         // Nunca se marca "stale" durante la sesión
        cacheTime: 1000 * 60 * 5,    // Se guarda en caché 5 minutos
        refetchOnWindowFocus: false, // No se refetch al cambiar de pestaña
        refetchOnReconnect: false,   // No se refetch al reconectar
        ...options,
    });
}
