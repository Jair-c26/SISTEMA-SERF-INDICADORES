// Documents.jsx
import React, { useState } from "react";
import { TabNavigation, TabNavigationLink } from '../DocumentManager/Documents-components/TabNavigation';
import { IconFilePlus, IconFolderOpen } from "@tabler/icons-react";
import ContentControlPanel from "./Components/ContentControlPanel";
import { IconFileText } from '@tabler/icons-react'
export default function Documents() {
  // Estado local para saber cuál pestaña está activa
  const [activeTab, setActiveTab] = useState("carga");

  return (
    <div className="p-2 space-y-4">
      {/* 1. Título */}
      <h1 className="text-base font-semibold">PANEL DE CONTROL</h1>
      {/* 3. TabNavigation debajo del Callout */}
      <TabNavigation>
        <TabNavigationLink
          // Para la pestaña "carpetas"
          className="inline-flex gap-2"
          // Evita la navegación real (href="#") y maneja el click
          href="#"
          active={activeTab === "carga"}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("carga");
          }}
        >
          <IconFileText className="size-4" aria-hidden="true" />
          CARGA LABORAL
        </TabNavigationLink>

        <TabNavigationLink
          // Para la pestaña "importar"
          className="inline-flex gap-2"
          href="#"
          active={activeTab === "delitos"}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("delitos");
          }}
        >
          <IconFileText className="size-4" aria-hidden="true" />
          DELITOS
        </TabNavigationLink>
        <TabNavigationLink
          // Para la pestaña "importar"
          className="inline-flex gap-2"
          href="#"
          active={activeTab === "control"}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("control");
          }}
        >
          <IconFileText className="size-4" aria-hidden="true" />
          CONTROL DE PLAZOS
        </TabNavigationLink>

      </TabNavigation>

      {/* Contenido condicional según la pestaña activa */}
      {activeTab === "carga" && (
        <div>
          <ContentControlPanel />
        </div>
      )}

      {activeTab === "delitos" && (
        
        <p>En mantenimiento...</p>

      )}

      {activeTab === "control" && (
        
        <p>En mantenimiento...</p>
        
      )}
    </div>
  );
}
