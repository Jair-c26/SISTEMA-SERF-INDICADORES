// src/hooks/useIncidenciaDelitoD.jsx
import { useQuery } from "@tanstack/react-query";

// Leer el token desde localStorage (se asume que la API usa la misma autenticación)
const apiIp = import.meta.env.VITE_API;
const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);

/**
 * Llama a la API http://192.168.137.229/api/ges_reportes/delito-dependencia
 * usando método POST, enviando los datos en el body (JSON).
 * Los datos requeridos son:
 * {
 *   "id_sedes": 6,
 *   "fe_inicio": "2008-01-01",
 *   "fe_fin": "2025-12-31",
 *   "estado": null,
 *   "id_dependencia": 8,
 *   "cantidadDelitos": 5,
 *   "cantidadAnio": 2
 * }
 *
 * Retorna la data procesada de la respuesta.
 */
export async function fetchIncidenciaDelitoD({
    id_sedes,
    fe_inicio,
    fe_fin,
    estado,
    id_dependencia,
    cantidadDelitos,
    cantidadAnio,
}) {
    const url = `http://${apiIp}/api/ges_reportes/delito-dependencia`;

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
            cantidadDelitos,
            cantidadAnio,
        }),
    });

    if (!response.ok) {
        throw new Error("Error al obtener la incidencia de delito de dependencia");
    }

    const jsonData = await response.json();
    // Se retorna la data requerida
    return jsonData.data;
}

/**
 * Hook useIncidenciaDelitoD
 * Realiza la llamada al endpoint delito-dependencia con los datos requeridos.
 * "params" debe ser un objeto con { id_sedes, fe_inicio, fe_fin, estado, id_dependencia, cantidadDelitos, cantidadAnio }
 *
 * Ejemplo de uso:
 * const { data, isLoading, isError, refetch } = useIncidenciaDelitoD({
 *   id_sedes: 6,
 *   fe_inicio: "2008-01-01",
 *   fe_fin: "2025-12-31",
 *   estado: null,
 *   id_dependencia: 8,
 *   cantidadDelitos: 5,
 *   cantidadAnio: 2
 * }, {
 *   enabled: false // si deseas controlarlo manualmente
 * });
 */
export function useIncidenciaDelitoD(params, options = {}) {
    return useQuery({
        queryKey: ["incidencia-delito-d"],
        queryFn: () => fetchIncidenciaDelitoD(params),
        staleTime: Infinity,
        cacheTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        ...options,
    });
}
