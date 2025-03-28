// src/hooks/useCarpetasArchivos.jsx
import { useQuery } from '@tanstack/react-query';

const apiIp = import.meta.env.VITE_API;
const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);

// Exporta la función pura para poder usarla en App.jsx
export async function fetchCarpetasArchivos() {
  const res = await fetch(`http://${apiIp}/api/ges_archivos/litsArchivosPorCarpeta`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Error al obtener las carpetas');
  }

  const data = await res.json();
  // data: { message, status, token, data: [ ... ] }
  return data.data; // data.data es el array de carpetas
}

// Este custom hook usa la misma función, pero se dispara cuando tú lo invoques
export function useCarpetasArchivos() {
  return useQuery({
    queryKey: ['carpetas-archivos'],
    queryFn: fetchCarpetasArchivos,
    staleTime: 1000 * 60,     // 1 minuto
    cacheTime: 1000 * 60 * 5, // 5 minutos
  });
}
