// src/hooks/useIncidenciaDelitoS.jsx
import { useQuery } from "@tanstack/react-query";

// Leer la IP del backend y el token desde localStorage
// En este caso, el API se usa de forma fija, por lo que se puede omitir la variable VITE_API
const apiIp = import.meta.env.VITE_API;
const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);

/**
 * Llama a la API http://192.168.137.229/api/ges_reportes/delito-sede
 * usando método POST, enviando los datos en el body (JSON).
 * Los datos requeridos son:
 * {
 *   "id_sedes": 6,
 *   "fe_inicio": "2008-01-01",
 *   "fe_fin": "2025-12-31",
 *   "estado": null,
 *   "id_dependencia": null,
 *   "cantidadDelitos": 5
 * }
 *
 * Retorna la data procesada de la respuesta.
 */
export async function fetchIncidenciaDelito({
    id_sedes,
    fe_inicio,
    fe_fin,
    estado,
    id_dependencia,
    cantidadDelitos,
}) {
    const url = `http://${apiIp}/api/ges_reportes/delito-sede`;

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
        }),
    });

    if (!response.ok) {
        throw new Error("Error al obtener la incidencia de delito");
    }

    const jsonData = await response.json();
    // Se retorna normalmente la data requerida
    return jsonData.data;
}

/**
 * Hook useIncidenciaDelitoS
 * Realiza la llamada al endpoint delito-sede con los datos requeridos.
 * "params" debe ser un objeto con { id_sedes, fe_inicio, fe_fin, estado, id_dependencia, cantidadDelitos }
 *
 * Ejemplo de uso:
 * const { data, isLoading, isError, refetch } = useIncidenciaDelitoS({
 *   id_sedes: 6,
 *   fe_inicio: "2008-01-01",
 *   fe_fin: "2025-12-31",
 *   estado: null,
 *   id_dependencia: null,
 *   cantidadDelitos: 5
 * }, {
 *   enabled: false // si deseas controlarlo manualmente
 * });
 */
export function useIncidenciaDelitoS(params, options = {}) {
    return useQuery({
        queryKey: ["incidencia-delito"],
        queryFn: () => fetchIncidenciaDelito(params),
        staleTime: Infinity,
        cacheTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        ...options,
    });
}
