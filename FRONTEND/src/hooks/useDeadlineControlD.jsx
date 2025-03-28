// src/hooks/useDeadlineControlD.jsx

import { useQuery } from "@tanstack/react-query";

// Leer la IP del backend y el token desde localStorage
const apiIp = import.meta.env.VITE_API;
const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);

/**
 * Llama a la API http://192.168.137.229/api/ges_reportes/plazo-dependencia
 * usando el método POST y enviando los datos en el body (JSON).
 * Retorna el objeto data que contiene la información propia de "plazo-dependencia",
 * según la estructura que devuelva el servidor.
 */
export async function fetchDeadlineControlD({
    id_sedes,
    id_dependencia,
    fe_inicio,
    fe_fin,
    estado,
}) {
    const url = `http://${apiIp}/api/ges_reportes/plazo-dependencia`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            id_sedes,
            id_dependencia,
            fe_inicio,
            fe_fin,
            estado,
        }),
    });

    if (!response.ok) {
        throw new Error("Error al obtener los datos de plazo-dependencia");
    }

    const jsonData = await response.json();
    return jsonData.data;
}

/**
 * Hook useDeadlineControlD
 * Realiza la llamada al endpoint "plazo-dependencia" con los datos requeridos.
 * "params" debe ser un objeto con { id_sedes, id_dependencia, fe_inicio, fe_fin, estado }
 *
 * Ejemplo de uso:
 * const { data, isLoading, isError, refetch } = useDeadlineControlD({
 *   id_sedes: null,
 *   id_dependencia: null,
 *   fe_inicio: "2007-01-01",
 *   fe_fin: "2025-12-31",
 *   estado: null
 * }, {
 *   enabled: false // si deseas controlarlo manualmente
 * });
 */
export function useDeadlineControlD(params, options = {}) {
    return useQuery({
        // Clave de caché para la consulta
        queryKey: ["deadline-control-d"],
        queryFn: () => fetchDeadlineControlD(params),
        staleTime: Infinity,         // Nunca se marca "stale" durante la sesión
        cacheTime: 1000 * 60 * 5,      // Se guarda en caché 5 minutos
        refetchOnWindowFocus: false,   // No se refetch al cambiar de pestaña
        refetchOnReconnect: false,     // No se refetch al reconectar
        ...options,
    });
}
