// src/hooks/useListDF.jsx
import { useQuery } from '@tanstack/react-query';

const apiIp = import.meta.env.VITE_API;
const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);

export async function fetchListDF() {
  const res = await fetch(`http://${apiIp}/api/ges_areas/lista-areas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error al obtener las áreas');
  }

  const data = await res.json();
  return data.data;
}

export function useListDF(options = {}) {
  return useQuery({
    queryKey: ['list-areas'],
    queryFn: fetchListDF,
    staleTime: Infinity,            // Nunca se vuelven "stale" durante la sesión
    cacheTime: 1000 * 60 * 5,       // Cuánto tiempo se guardan en caché (5 min, por ejemplo)
    refetchOnWindowFocus: false,    // No refetch al cambiar de pestaña
    refetchOnReconnect: false,      // No refetch al reconectarse
    ...options,
  });
}
