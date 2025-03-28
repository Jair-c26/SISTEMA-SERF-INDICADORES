// src/hooks/useFiscalCarga.jsx
import { useQuery } from "@tanstack/react-query";

const apiIp = import.meta.env.VITE_API;
const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);

/**
 * Llama a la API http://192.168.137.229/api/ges_reportes/carga-fiscal
 * utilizando el método POST y enviando los datos en el body (JSON).
 * Retorna el objeto data que contiene la información propia de "carga-fiscal",
 * según la estructura que devuelva el servidor.
 */
export async function fetchFiscalCarga({ id_fiscal, id_dependencia, fe_inicio, fe_fin, estado }) {
    const url = `http://${apiIp}/api/ges_reportes/carga-fiscal`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            id_fiscal,
            id_dependencia,
            fe_inicio,
            fe_fin,
            estado,
        }),
    });

    if (!response.ok) {
        throw new Error("Error al obtener los datos de carga-fiscal");
    }

    const jsonData = await response.json();
    return jsonData.data;
}

/**
 * Hook useFiscalCarga
 * Realiza la llamada al endpoint "carga-fiscal" con los datos requeridos.
 * "params" debe ser un objeto con { id_fiscal, id_dependencia, fe_inicio, fe_fin, estado }
 *
 * Ejemplo de uso:
 * const { data, isLoading, isError, refetch } = useFiscalCarga({
 *   id_fiscal: 27,
 *   id_dependencia: 10,
 *   fe_inicio: "2009-01-01",
 *   fe_fin: "2025-12-31",
 *   estado: null,
 * }, {
 *   enabled: false // si se desea controlar manualmente
 * });
 */
export function useFiscalCarga(params, options = {}) {
    return useQuery({
        queryKey: ["fiscal-carga"],
        queryFn: () => fetchFiscalCarga(params),
        staleTime: Infinity,
        cacheTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        ...options,
    });
}
