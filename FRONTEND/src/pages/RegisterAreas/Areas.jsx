// Areas.jsx
import React, { useState } from "react";
import { TabNavigation, TabNavigationLink } from "../../pages/DocumentManager/Documents-components/TabNavigation";
import FileUpload from "../DocumentManager/Documents-components/components/FileUpload";
import { IconBuildings, IconBuildingPlus } from "@tabler/icons-react";
import { RiExchange2Line } from "@remixicon/react";
import AreasList from './components/AreasList';
import ImportAreasService from "../../services/api/exportAreas-list/ImportAreasService";
export default function Areas() {
  const [activeTab, setActiveTab] = useState("Áreas");

  return (
    <div className="p-2 space-y-4">
      <h1 className="text-base font-semibold">GESTOR DE ÁREAS</h1>

      <TabNavigation>
        <TabNavigationLink
          className="inline-flex gap-2"
          href="#"
          active={activeTab === "Áreas"}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("Áreas");
          }}
        >
          <IconBuildings className="size-4" aria-hidden="true" />
          Áreas
        </TabNavigationLink>

        <TabNavigationLink
          className="inline-flex gap-2"
          href="#"
          active={activeTab === "importar"}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("importar");
          }}
        >
          <IconBuildingPlus className="size-4" aria-hidden="true" />
          Importar
        </TabNavigationLink>
      </TabNavigation>

      {activeTab === "Áreas" && (
        <div>
          {/* Se pasa la data de áreas a AreasList */}
          <AreasList />
        </div>
      )}

      {activeTab === "importar" && (
        <div>
          {/* Se pasa la función de importación de áreas, si existe */}
          <FileUpload uploadService={ImportAreasService.ImportAreasService} />
        </div>
      )}
    </div>
  );
}
