// Reports.jsx
import React, { useState } from "react";
import { IconBuildings, IconBuildingPlus } from '@tabler/icons-react'
import { TabNavigation, TabNavigationLink } from '../../../../pages/DocumentManager/Documents-components/TabNavigation';


import CargoReportS from "./CargoReportS";
import CargoReportD from "./CargoReportD";

export default function TaxBurden() {
    const [activeTab, setActiveTab] = useState("Sede");

    return (
        <div className="p-2 space-y-4">
            <div>
                <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    CARGA FISCAL
                </h3>
            </div>

            <TabNavigation>
                <TabNavigationLink
                    className="inline-flex gap-2"
                    href="#"
                    active={activeTab === "Sede"}
                    onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("Sede");
                    }}
                >
                    <IconBuildings className="size-4" aria-hidden="true" />
                    Sede
                </TabNavigationLink>

                <TabNavigationLink
                    className="inline-flex gap-2"
                    href="#"
                    active={activeTab === "Depedencia"}
                    onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("Depedencia");
                    }}
                >
                    <IconBuildings className="size-4" aria-hidden="true" />
                    Depedencia
                </TabNavigationLink>

                <TabNavigationLink
                    className="inline-flex gap-2"
                    href="#"
                    active={activeTab === "Despacho"}
                    onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("Despacho");
                    }}
                >
                    <IconBuildings className="size-4" aria-hidden="true" />
                    Despacho
                </TabNavigationLink>
            </TabNavigation>

            {activeTab === "Sede" && (
                <CargoReportS/>
            )}
            {activeTab === "Depedencia" && (
                <CargoReportD />
            )}
            {activeTab === "Despacho" && (
                <p>En mantenimiento...</p>
            )}
        </div>
    );
}
