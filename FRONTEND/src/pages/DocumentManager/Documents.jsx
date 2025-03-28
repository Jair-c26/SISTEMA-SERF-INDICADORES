// Documents.jsx
import React, { useState, useEffect, useRef } from "react";
import { TabNavigation, TabNavigationLink } from "./Documents-components/TabNavigation";
import { useCarpetasArchivos } from "../../hooks/useCarpetasArchivos";
import { IconFilePlus, IconFolderOpen } from "@tabler/icons-react";
import FileUploadFuctions from "./Documents-components/components/FileUploadFuctions";
import DocumentFolders from "./Documents-components/components/DocumentFolders";
import { useToast } from "../../lib/useToast"; // Asegúrate de ajustar la ruta según tu estructura
import AlertError from "../../components/alert/AlertError"; // Asegúrate de ajustar la ruta según tu estructura

export default function Documents() {
  // Estado local para saber cuál pestaña está activa
  const [activeTab, setActiveTab] = useState("carpetas");

  // Obtención de datos de carpetas, incluyendo isLoading y error
  const { data: carpetasData, isLoading, error } = useCarpetasArchivos();

  // Hook para mostrar toasts
  const { toast } = useToast();

  // Referencia para el toast actual y para controlar si ya se cargaron los datos
  const toastRef = useRef(null);
  const hasDataLoaded = useRef(false);
  const errorShown = useRef(false); // Para evitar mostrar múltiples alertas de error

  // Efecto para mostrar y actualizar el toast durante la carga de datos
  useEffect(() => {
    if (isLoading && !hasDataLoaded.current && !toastRef.current) {
      // Se crea un toast de "loading" mientras se cargan los datos
      toastRef.current = toast({
        variant: "loading",
        title: "Cargando documentos...",
        disableDismiss: true,
      });
    } else if (!isLoading && toastRef.current && !hasDataLoaded.current) {
      // Actualiza el toast cuando la carga ha finalizado
      const newToast = toastRef.current.update({
        variant: error ? "error" : "success",
        title: error ? "Error" : "Documentos cargados",
        description: error
          ? "No se pudieron cargar los documentos."
          : "Los documentos se han cargado correctamente.",
        disableDismiss: false,
      });
      toastRef.current = newToast;
      hasDataLoaded.current = true;
    }
  }, [isLoading, error, toast]);

  // Efecto para mostrar el AlertError si se produce un error y evitar mostrarlo varias veces
  useEffect(() => {
    if (error && !isLoading && !errorShown.current) {
      errorShown.current = true;
      // Se invoca AlertError pasando el error capturado
      AlertError({ error });
    }
  }, [error, isLoading]);

  // Efecto de limpieza para descartar el toast al desmontar el componente
  useEffect(() => {
    return () => {
      if (toastRef.current) {
        toastRef.current.dismiss();
        toastRef.current = null;
      }
      hasDataLoaded.current = false;
      errorShown.current = false;
    };
  }, []);

  return (
    <div className="p-2 space-y-4">
      {/* 1. Título */}
      <h1 className="text-base font-semibold">GESTOR DE DOCUMENTOS</h1>
      {/* 3. TabNavigation debajo del Callout */}
      <TabNavigation>
        <TabNavigationLink
          // Para la pestaña "carpetas"
          className="inline-flex gap-2"
          href="#"
          active={activeTab === "carpetas"}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("carpetas");
          }}
        >
          <IconFolderOpen className="size-4" aria-hidden="true" />
          Carpetas
        </TabNavigationLink>

        <TabNavigationLink
          // Para la pestaña "importar"
          className="inline-flex gap-2"
          href="#"
          active={activeTab === "importar"}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("importar");
          }}
        >
          <IconFilePlus className="size-4" aria-hidden="true" />
          Importar
        </TabNavigationLink>
      </TabNavigation>

      {/* Contenido condicional según la pestaña activa */}
      {activeTab === "carpetas" && (
        <div>
          {/* DocumentFolders se muestra siempre, incluso si carpetasData aún no se ha cargado */}
          <DocumentFolders carpetasData={carpetasData} />
        </div>
      )}

      {activeTab === "importar" && (
        <div>
          <FileUploadFuctions />
        </div>
      )}
    </div>
  );
}
