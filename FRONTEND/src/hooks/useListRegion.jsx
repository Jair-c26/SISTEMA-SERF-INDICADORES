// src/hooks/useListRegion.jsx
import { useQuery } from '@tanstack/react-query';

// Leer la IP del backend y el token desde localStorage
const apiIp = import.meta.env.VITE_API;
const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);

/**
 * Función que obtiene la lista de regiones desde la API.
 * Retorna el array de regiones dentro de data.
 */
export async function fetchListRegion() {
    const res = await fetch(`http://${apiIp}/api/ges_areas/region`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Error al obtener las regiones');
    }

    const jsonData = await res.json();
    // Retorna solo el array de regiones que viene en jsonData.data
    return jsonData.data;
}

/**
 * Hook useListRegion
 * Retorna la lista de regiones usando react-query.
 * Permite pasar "options" adicionales para personalizar la query.
 */
export function useListRegion(options = {}) {
    return useQuery({
        queryKey: ['list-region'],
        queryFn: fetchListRegion,
        staleTime: Infinity,          // Las regiones nunca se marcan "stale" durante la sesión
        cacheTime: 1000 * 60 * 5,     // Se guardan en caché por 5 minutos
        refetchOnWindowFocus: false,  // No se refetch al cambiar de pestaña
        refetchOnReconnect: false,    // No se refetch al reconectar
        ...options,
    });
}
