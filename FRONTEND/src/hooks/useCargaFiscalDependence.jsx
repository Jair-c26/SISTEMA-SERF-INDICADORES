// src/hooks/useCargaFiscalDependence.jsx
import { useQuery } from "@tanstack/react-query";

// Leer la IP del backend y el token desde localStorage
const apiIp = import.meta.env.VITE_API;
const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);

/**
 * Llama a la API http://192.168.137.229/api/ges_reportes/carga-dependencia
 * usando método POST, enviando los datos en el body (JSON).
 * Retorna el objeto data que contiene la información propia de la dependencia,
 * por ejemplo: list_dependencias, data_generalSede, graf_ingreso_caso_depens, etc.
 */
export async function fetchCargaFiscalDependence({
    id_dependencia,
    fe_inicio,
    fe_fin,
    estado,
}) {
    const url = `http://${apiIp}/api/ges_reportes/carga-dependencia`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            id_dependencia,
            fe_inicio,
            fe_fin,
            estado,
        }),
    });

    if (!response.ok) {
        throw new Error("Error al obtener la carga de la dependencia");
    }

    const jsonData = await response.json();
    // La API retorna un objeto con { message, status, token, data }
    // Normalmente solo se necesita jsonData.data
    return jsonData.data;
}

/**
 * Hook useCargaFiscalDependence
 * Realiza la llamada al endpoint carga-dependencia con los datos requeridos.
 * "params" debe ser un objeto con { id_dependencia, fe_inicio, fe_fin, estado }
 *
 * Ejemplo de uso:
 * const { data, isLoading, isError, refetch } = useCargaFiscalDependence({
 *   id_dependencia: 10,
 *   fe_inicio: "2008-01-01",
 *   fe_fin: "2025-12-31",
 *   estado: null
 * }, {
 *   enabled: false // si deseas controlarlo manualmente
 * });
 */
export function useCargaFiscalDependence(params, options = {}) {
    return useQuery({
        // Clave de caché distinta para no colisionar con useCargaFiscal
        queryKey: ["carga-fiscal-dependence"],
        queryFn: () => fetchCargaFiscalDependence(params),
        staleTime: Infinity,         // Nunca se marca "stale" durante la sesión
        cacheTime: 1000 * 60 * 5,    // Se guarda en caché 5 minutos
        refetchOnWindowFocus: false, // No se refetch al cambiar de pestaña
        refetchOnReconnect: false,   // No se refetch al reconectar
        ...options,
    });
}
