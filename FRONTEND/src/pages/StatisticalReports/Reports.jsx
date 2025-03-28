// Reports.jsx
import React, { useState } from "react";
import { IconBuildings, IconBuildingPlus } from '@tabler/icons-react'
import { TabNavigation, TabNavigationLink } from "../../pages/DocumentManager/Documents-components/TabNavigation";
import ListSede from "./Components/ListSede";
export default function Reports() {
  const [activeTab, setActiveTab] = useState("Areas fiscal");
  return (
    <div className="p-2 space-y-4">
      <div>
        <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          REPORTES ESTADISTICOS
        </h3>
      </div>
      <TabNavigation>
        <TabNavigationLink
          className="inline-flex gap-2"
          href="#"
          active={activeTab === "Areas fiscal"}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("Areas fiscal");
          }}
        >
          <IconBuildings className="size-4" aria-hidden="true" />
          Areas fiscal
        </TabNavigationLink>       
      </TabNavigation>
      {activeTab === "Areas fiscal" && <ListSede />}
    </div>
  );
}
