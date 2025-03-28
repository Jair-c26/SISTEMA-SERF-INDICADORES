// CrimeIncidenceD.jsx
import React from "react";
import Card from "../../../../components/ui/Card";
import FilterHeader from "../../DeadlineControl/components/filterHeader";
import FilterHeaderCI from "./FilterHeaderCI";
import SideContent from "../../DeadlineControl/components/SideContent";
import SideContentD from "../../WorkLoad/components/SideContentD";
import { useIncidenciaDelitoD } from "../../../../hooks/useIncidenciaDelitoD"; // Usamos el hook D
import { useAuth } from "../../../../context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ChartPie from "../../DeadlineControl/components/charts/ChartPie";
import DeadlinedependenceB from "../../DeadlineControl/components/charts/DeadlinedependenceB";
import CIReportingStructure from "./CIReportingStructure"; // Nuevo componente que aísla la columna derecha

const version = import.meta.env.VITE_VERSION || '1.1.1';

export default function CrimeIncidenceD() {
    const { user } = useAuth();
    const fullName = user ? `${user.nombre} ${user.apellido}` : "Administrador";
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    // Leer la data de "incidencia-delito-d" desde la caché de React Query
    const queryClient = useQueryClient();
    const { data: apiData = {} } = useQuery({
        queryKey: ["incidencia-delito-d"],
        queryFn: async () =>
            queryClient.getQueryData(["incidencia-delito-d"]) ?? {},
        staleTime: Infinity,
    });

    // Extraer "general_sede" para el panel "Sede Seleccionada"
    const generalSedeGlobal = apiData.general_sede?.[0] || {
        Nombre: "Sin valor",
        Total_Dependencias: "x",
    };

    // Extraer la lista de dependencias (delitos por dependencia)
    // Nota: revisa la key; en algunos casos puede ser "dependencias" en plural
    const dependencias = apiData.dependencias || [];
    const containerIds = dependencias.map((_, index) => `CargoReportS-${index}`);
    // Transformar list_dependencia para "Dependencias relacionadas"
    const listDespachios = apiData.list_despchios || [];
    const transformedWorkspaces = listDespachios.map((dep) => ({
        name: dep.Nombre_Despacho,
        code: dep.Codigo_Despacho,
        fiscales: dep.Cantidad_Fiscales,
        status: dep.Estado === "activo" ? "active" : "inactive",
        codeD: dep.Codigo_Dependencia,
    }));

    const nDeps = dependencias.length;
    const nDesp = listDespachios.length;

    let showName = "";
    let showCode = "";
    let showCount = "";

    if (nDeps === 1) {
        // Si hay exactamente 1 dependencia
        const dep = dependencias[0];
        showName = dep?.Nombre || "Sin nombre";
        showCode = dep?.codigo || "Sin código";
        showCount = String(nDesp);  // el número de despachos
    } else if (nDeps > 1) {
        // Si hay más de 1 dependencia
        showName = "Dependencias varias";
        showCode = "Codigo varios";
        showCount = "Despachos varios";
    } else {
        // Si no hay dependencias en absoluto
        showName = "Sin dependencias";
        showCode = "Sin código";
        showCount = "0";
    }

    return (
        <div className="p-2 space-y-2 min-h-screen">
            <FilterHeaderCI
                containerIds={containerIds}
                useCargaHook={useIncidenciaDelitoD}
            />

            <div className="grid grid-cols-12 gap-3 h-full">
                {/* Columna izquierda: Sede y Dependencias */}
                <div className="col-span-3 flex flex-col space-y-3 h-full">
                    {/* Dependencia seleccionada */}
                    <Card>
                        <div className="border-b border-tremor-border dark:border-dark-tremor-border">
                            <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                Dependencia seleccionada
                            </h3>
                        </div>
                        <div className="h-40 p-2">
                            <h2 className="font-medium text-base">{showName}</h2>
                            <p className="font-medium text-base">
                                Código: <span className="font-normal text-sm">{showCode}</span>
                            </p>
                            <p className="font-medium text-base">
                                Cantidad despachos:{" "}
                                <span className="font-normal text-sm">
                                    {showCount}
                                </span>
                            </p>
                        </div>
                    </Card>

                    {/* Dependencias relacionadas */}
                    <Card className="flex-1">
                        <div className="border-b border-tremor-border dark:border-dark-tremor-border">
                            <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                Despachos relacionadas
                            </h3>
                        </div>
                        <div className="p-2 h-full">
                            <SideContentD workspaces={transformedWorkspaces} />
                        </div>
                    </Card>
                </div>

                {/* Columna derecha: Generar un CIReportingStructure por cada dependencia */}
                <div className="col-span-9 space-y-3">
                    {dependencias.map((dep, index) => {
                        const listaFiscal = dep?.data_general_delito?.lista_general_fiscal || [];
                        const taxDataWorkspaces = listaFiscal.map((f) => {
                            const fiscalName = f.Fiscal ?? "Sin nombre";
                            const productividad = parseFloat(f.Avanzados_Resueltos) || 0;
                            return {
                                name: fiscalName,
                                metrics: {
                                    dentroPlazo: {

                                        quantity: f.Casos_Ingresados ?? 0,
                                        label: "Casos Ingresados",
                                    },
                                    porVencer: {

                                        quantity: f.Casos_Tramite ?? 0,
                                        label: "Casos Tramite",
                                    },
                                    vencidos: {

                                        quantity: f.Casos_Resueltos ?? 0,
                                        label: "Casos Resueltos",
                                    },
                                    total: {
                                        percentage: productividad,

                                        label: "Productividad Fiscal",
                                    },
                                },
                            };
                        });
                        // Extraer la data general de delito de la dependencia (si existe)
                        const depGeneral = dep?.data_general_delito?.general_dependencia?.[0] || {};
                        const delitosPorDependencia = dep?.data_general_delito?.delitos_por_dependencia || [];
                        const delitosPorcentaje = dep?.data_general_delito?.delitos_porcentaje || [];
                        const delitosPorAnios = dep?.data_general_delito?.delitos_anios || [];
                        return (
                            <CIReportingStructure
                                key={index}
                                containerId={`CargoReportS-${index}`}
                                generalSede={depGeneral || {}} // Asegurar que no sea undefined
                                workspaces={taxDataWorkspaces || []} // Asegurar que no sea undefined
                                delitosPorDependencia={delitosPorDependencia || []} // Asegurar que no sea undefined
                                delitosPorcentaje={delitosPorcentaje || []} // Asegurar que no sea undefined
                                delitosPorAnios={delitosPorAnios || []} // Asegurar que no sea undefined
                            />

                        );
                    })}
                </div>
            </div>
        </div>
    );
}
