// src/pages/DeadlineControlE.jsx

import React from "react";
import Card from "../../../../components/ui/Card";
import FilterHeader from "./filterHeader";
import SideContent from "./SideContent";
import { useDeadlineControlD } from "../../../../hooks/useDeadlineControlD";
import DependencyReportingStructureDC from "./DependencyReportingStructureDC";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SideContentD from "../../WorkLoad/components/SideContentD";

export default function DeadlineControlE() {
    // Obtención de la data usando react-query para la clave "deadline-control-d"
    const queryClient = useQueryClient();
    const { data: apiData = {} } = useQuery({
        queryKey: ["deadline-control-d"],
        queryFn: async () => queryClient.getQueryData(["deadline-control-d"]) ?? {},
        staleTime: Infinity,
    });

    // Extraer el arreglo de dependencias de la data obtenida
    const dependencias = apiData.dependencias || [];
    // Generar un arreglo de containerIds a partir de las dependencias
    const containerIds = dependencias.map((_, index) => `DeadlineControlD-${index}`);

    // Extraer el arreglo de despachos ("list_despchios") y mapearlo a la forma requerida para SideContentD
    const listDespachios = apiData.list_despchios || [];
    const sideContentWorkspaces = listDespachios.map((desp) => ({
        name: desp.Nombre_Despacho,
        code: desp.Codigo_Despacho,
        fiscales: desp.Cantidad_Fiscales_Con_Plazo,
        status: desp.Estado === "activo" ? "active" : "inactive",
        codeD: desp.Codigo_Dependencia,
    }));

    // Calcular la cantidad de dependencias y despachos
    const nDeps = dependencias.length;
    const nDesp = listDespachios.length;

    // Variables para mostrar en el panel izquierdo (Dependencias seleccionadas)
    let showName = "";
    let showCode = "";
    let showCount = "";

    if (nDeps === 1) {
        // Caso 1: Exactamente 1 dependencia
        const dep = dependencias[0];
        showName = dep?.Nombre || "Sin nombre";
        showCode = dep?.codigo || "Sin código";
        showCount = String(nDesp); // número total de despachos
    } else if (nDeps > 1) {
        // Caso 2: Más de 1 dependencia
        showName = "Dependencias varias";
        showCode = "Codigo varios";
        showCount = "Despachos varios";
    } else {
        // Caso 3: Sin dependencias
        showName = "Sin dependencias";
        showCode = "Sin código";
        showCount = "0";
    }

    return (
        <div className="p-2 space-y-2 min-h-screen">
            <FilterHeader containerIds={containerIds} useCargaHook={useDeadlineControlD} />

            <div className="grid grid-cols-12 gap-3 h-full">
                {/* Columna izquierda: Sede y Dependencias (más estrecha) */}
                <div className="col-span-3 flex flex-col space-y-3 h-full">
                    {/* Panel de Dependencias seleccionadas */}
                    <Card>
                        <div className="border-b border-tremor-border dark:border-dark-tremor-border">
                            <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                Dependencias seleccionadas:
                            </h3>
                        </div>
                        <div className="h-40 p-2">
                            {/* Se reemplazan los valores estáticos con los datos dinámicos */}
                            <h2 className="font-medium text-base">{showName}</h2>
                            <p className="font-medium text-base">
                                Código: <span className="font-normal text-sm">{showCode}</span>
                            </p>
                            <p className="font-medium text-base">
                                Cantidad despachos:{" "}
                                <span className="font-normal text-sm">{showCount}</span>
                            </p>
                        </div>
                    </Card>

                    {/* Dependencias relacionadas */}
                    <Card className="flex-1">
                        <div className="border-b border-tremor-border dark:border-dark-tremor-border">
                            <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                Dependencias relacionadas
                            </h3>
                        </div>
                        <div className="py-2 h-full">
                            <SideContentD workspaces={sideContentWorkspaces} />
                        </div>
                    </Card>
                </div>

                {/* Columna derecha: Renderiza una instancia de DependencyReportingStructureDC para cada dependencia */}
                <div className="col-span-9 space-y-3">
                    {dependencias.map((dep, index) => {
                        // Extraer y transformar la lista_general_fiscal para TaxData
                        const listaFiscal = dep?.data_general_carga?.lista_general_fiscal || [];
                        const taxDataWorkspaces = listaFiscal.map((f) => ({
                            name: f.Fiscal || "Sin nombre",
                            metrics: {
                                dentroPlazo: {
                                    quantity: f.Cantidad_Verde ?? 0,
                                    percentage: f.Porcentaje_Verde ? `${f.Porcentaje_Verde}%` : "0%",
                                    label: "Dentro del plazo",
                                },
                                porVencer: {
                                    quantity: f.Cantidad_Amarillo ?? 0,
                                    percentage: f.Porcentaje_Amarillo ? `${f.Porcentaje_Amarillo}%` : "0%",
                                    label: "Plazo por vencer",
                                },
                                vencidos: {
                                    quantity: f.Cantidad_Rojo ?? 0,
                                    percentage: f.Porcentaje_Rojo ? `${f.Porcentaje_Rojo}%` : "0%",
                                    label: "Plazo vencidos",
                                },
                                total: {
                                    quantity: f.Total_Colores ?? 0,
                                    percentage: `${Number(f.Porcentaje_Verde || 0) + Number(f.Porcentaje_Amarillo || 0) + Number(f.Porcentaje_Rojo || 0)}`,
                                    label: "Candidad de plazos ingresados",
                                },
                            },
                        }));
                        return (
                            <DependencyReportingStructureDC
                                key={dep.codigo || index}
                                containerId={containerIds[index]}
                                workspaces={taxDataWorkspaces}
                                dependencyData={dep}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
