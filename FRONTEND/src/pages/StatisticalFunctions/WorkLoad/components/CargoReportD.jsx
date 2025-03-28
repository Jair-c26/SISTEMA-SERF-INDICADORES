// CargoReportD.jsx
import React, { useState } from "react";
import Card from "../../../../components/ui/Card";
import FilterHeader from "../../DeadlineControl/components/filterHeader";
import SideContent from "../../DeadlineControl/components/SideContent";
import DependencyReportingStructure from "./DependencyReportingStructure";
import { useCargaFiscalDependence } from "../../../../hooks/useCargaFiscalDependence";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SideContentD from "./SideContentD";
// Importar el nuevo componente de PDF
import TaxBurdenSchemeD from '../../TaxDetails/components/ViewPDF/TaxBurdenSchemeD';

export default function CargoReportD() {
    const queryClient = useQueryClient();
    const [barChartDataURL, setBarChartDataURL] = useState(null);
    const [chartPieDataURL, setChartPieDataURL] = useState(null);
    const [deadLineBURL, setDeadlineBDataURL] = useState(null);
    const [etapasChartDataURL, setEtapasChartDataURL] = useState(null);
    const [estadoChartDataURL, setEstadoChartDataURL] = useState(null);
    
    

    const { data: apiData = {} } = useQuery({
        queryKey: ["carga-fiscal-dependence"],
        queryFn: async () => {
            return queryClient.getQueryData(["carga-fiscal-dependence"]) ?? {};
        },
        staleTime: Infinity,
    });

    // 1. Extraer list_despchios (arreglo) de apiData
    const listDespachios = apiData.list_despchios || [];
    
    // 2. Mapear para formar el arreglo que necesita SideContentD
    const sideContentWorkspaces = listDespachios.map((desp) => ({
        // name -> Nombre_Despacho
        name: desp.Nombre_Despacho,
        // code -> Codigo_Despacho
        code: desp.Codigo_Despacho,
        // fiscales -> Cantidad_Fiscales
        fiscales: desp.Cantidad_Fiscales,
        // status -> "active" si Estado === "activo", sino "inactive"
        status: desp.Estado === "activo" ? "active" : "inactive",
        // codeD -> Codigo_Dependencia
        codeD: desp.Codigo_Dependencia,
    }));

    const dependencias = apiData.dependencias || [];
    const containerIds = dependencias.map((_, index) => `DeadlineControlE-${index}`);

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

    // Preparar los datos para el PDF (usando la primera dependencia, por ejemplo)
    let taxPdfData = {};
    if (dependencias.length > 0) {
        const dep = dependencias[0];
        // 1) Extraer data_generalSede
        const genDep = dep?.data_general_carga?.general_dependencia?.[0] || {};
        const generalSede = {
            Casos_Ingresados: genDep.Casos_Ingresados ?? 0,
            Total_Fiscales: genDep.Total_Fiscales ?? 0,
            Total_Dependencias: genDep.Total_Despachos ?? 0,
        };

        // 2) Construir los datos para los gráficos principales
        const listaFiscal = dep?.data_general_carga?.lista_general_fiscal || [];
        // Gráfico principal
        const xAxisData = listaFiscal.map((f) => f.Fiscal ?? "");
        const dataResueltos = listaFiscal.map((f) => parseInt(f.Casos_Resueltos, 10) || 0);
        const dataIngresados = listaFiscal.map((f) => parseInt(f.Casos_Ingresados, 10) || 0);
        const dataTramite = listaFiscal.map((f) => parseInt(f.Casos_Tramite, 10) || 0);
        const fiscalChartData = { xAxisData, dataResueltos, dataIngresados, dataTramite };

        // 3) ChartPie
        const porcentajeData = dep?.data_general_carga?.porcentaje_fiscal || [];
        const pieChartData = porcentajeData.map((f) => ({
            value: parseInt(f.Casos_Resueltos, 10) || 0,
            name: `${f.Fiscal} (${f.Casos_Resueltos} - ${f.Porcentaje}%)`,
        }));

        // 4) Ranking Fiscales
        const rankingFiscal = dep?.data_general_carga?.rankingFiscal || [];
        const yAxisRanking = rankingFiscal.map((f) => f.Fiscal ?? "");
        const seriesRanking = rankingFiscal.map((f) => parseInt(f.Casos_Resueltos, 10) || 0);

        // 5) Etapas => una sola serie, pero cada barra con color distinto
        const generalEtapas = dep?.data_general_carga?.general_etapas || [];
        const xAxisDataEtapas = generalEtapas.map((e) => e.Etapa ?? "");
        const colorPaletteEtapas = ["#5470C6", "#91CC75", "#FAC858", "#EE6666", "#73C0DE"];
        const dataEtapas = generalEtapas.map((e, i) => ({
            value: e.Cantidad ?? 0,
            itemStyle: {
                color: colorPaletteEtapas[i % colorPaletteEtapas.length],
            },
        }));
        const etapasChartData = {
            xAxisData: xAxisDataEtapas,
            legendData: ["Etapas"],
            seriesData: [
                {
                    name: "Etapas",
                    type: "bar",
                    data: dataEtapas,
                },
            ],
        };

        // 6) ESTADO DE CASOS => cada bar con color distinto
        const generalEstado = dep?.data_general_carga?.general_estado || [];
        const xAxisDataEstado = generalEstado.map((e) => e.Estado ?? "");
        const colorPaletteEstado = ["#5470C6", "#91CC75", "#FAC858", "#EE6666", "#73C0DE"];
        const dataEstado = generalEstado.map((e, i) => ({
            value: e.Cantidad ?? 0,
            itemStyle: {
                color: colorPaletteEstado[i % colorPaletteEstado.length],
            },
        }));
        const estadoChartData = {
            xAxisData: xAxisDataEstado,
            seriesData: [
                {
                    name: "Estados",
                    type: "bar",
                    data: dataEstado,
                },
            ],
        };

        // 7) Construir el arreglo de "workspaces" para TaxData:
        const taxDataWorkspaces = listaFiscal.map((f) => {
            const fiscalName = f.Fiscal ?? "Sin nombre";
            const productividad = parseFloat(f.Avanzados_Resueltos) || 0;
            return {
                name: fiscalName,
                metrics: {
                    dentroPlazo: {
                        percentage: 0,
                        quantity: f.Casos_Ingresados ?? 0,
                        label: "Casos Ingresados",
                    },
                    porVencer: {
                        percentage: 0,
                        quantity: f.Casos_Tramite ?? 0,
                        label: "Casos Tramite",
                    },
                    vencidos: {
                        percentage: 0,
                        quantity: f.Casos_Resueltos ?? 0,
                        label: "Casos Resueltos",
                    },
                    total: {
                        percentage: productividad,
                        quantity: 0,
                        label: "Productividad Fiscal",
                    },
                },
            };
        });

        // Preparar la data que se usará en el PDF
        taxPdfData = {
            containerId: "TaxBurdenSchemeD",
            dependencyName: dep.Nombre,
            workspaces: taxDataWorkspaces,
            generalSede,
            reportType: "D",
            fiscalChartData,
            pieChartData,
            rankingData: { yAxisRanking, seriesRanking },
            etapasChartData,
            estadoChartData,
            // Propiedades adicionales si se requirieran, por ejemplo versión y user:
            version: import.meta.env.VITE_VERSION || "1.1.1",
            // Aquí se puede obtener el usuario autenticado desde algún contexto o prop
            user: { nombre: "Administrador", apellido: "" },
            barChartDataURL: barChartDataURL,
            pieChartDataURL: chartPieDataURL,
            rankingChartDataURL: deadLineBURL,
            etapasChartDataURL: etapasChartDataURL,
            estadoChartDataURL: estadoChartDataURL,
        };
    }

    return (
        <div className="p-2 space-y-2 min-h-screen">
            <FilterHeader
                containerIds={containerIds}
                useCargaHook={useCargaFiscalDependence}
                // Se envía el nuevo parámetro para el PDF TaxBurdenSchemeD
                taxPdfComponent={TaxBurdenSchemeD}
                taxPdfData={taxPdfData}
            />

            <div className="grid grid-cols-12 gap-3 h-full">
                {/* Columna izquierda */}
                <div className="col-span-2 flex flex-col space-y-3 h-full">
                    <Card>
                        <div className="border-b border-tremor-border dark:border-dark-tremor-border">
                            <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                Dependencias seleccionadas:
                            </h3>
                        </div>
                        <div className="h-40 p-2">
                            <h2 className="font-medium text-base">{showName}</h2>
                            <p className="font-medium text-base">
                                Código: <span className="font-normal text-sm">{showCode}</span>
                            </p>
                            <p className="font-medium text-base">
                                Cantidad despachos: <span className="font-normal text-sm">{showCount}</span>
                            </p>
                        </div>
                    </Card>

                    <Card className="flex-1">
                        <div className="border-b border-tremor-border dark:border-dark-tremor-border">
                            <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                Despachos:
                            </h3>
                        </div>
                        <div className="py-2 h-full">
                            <SideContentD workspaces={sideContentWorkspaces} />
                        </div>
                    </Card>
                </div>

                {/* Columna derecha: map de dependencias */}
                <div className="col-span-10 space-y-6">
                    {dependencias.map((dep, index) => {
                        // (Cálculos y mapeo de datos para cada dependencia, idénticos a los ya implementados)
                        const genDep = dep?.data_general_carga?.general_dependencia?.[0] || {};
                        const generalSede = {
                            Casos_Ingresados: genDep.Casos_Ingresados ?? 0,
                            Total_Fiscales: genDep.Total_Fiscales ?? 0,
                            Total_Dependencias: genDep.Total_Despachos ?? 0,
                        };

                        const listaFiscal = dep?.data_general_carga?.lista_general_fiscal || [];
                        const xAxisData = listaFiscal.map((f) => f.Fiscal ?? "");
                        const dataResueltos = listaFiscal.map((f) => parseInt(f.Casos_Resueltos, 10) || 0);
                        const dataIngresados = listaFiscal.map((f) => parseInt(f.Casos_Ingresados, 10) || 0);
                        const dataTramite = listaFiscal.map((f) => parseInt(f.Casos_Tramite, 10) || 0);
                        const fiscalChartData = { xAxisData, dataResueltos, dataIngresados, dataTramite };

                        const porcentajeData = dep?.data_general_carga?.porcentaje_fiscal || [];
                        const pieChartData = porcentajeData.map((f) => ({
                            value: parseInt(f.Casos_Resueltos, 10) || 0,
                            name: `${f.Fiscal} (${f.Casos_Resueltos} - ${f.Porcentaje}%)`,
                        }));

                        const rankingFiscal = dep?.data_general_carga?.rankingFiscal || [];
                        const yAxisRanking = rankingFiscal.map((f) => f.Fiscal ?? "");
                        const seriesRanking = rankingFiscal.map((f) => parseInt(f.Casos_Resueltos, 10) || 0);

                        const generalEtapas = dep?.data_general_carga?.general_etapas || [];
                        const xAxisDataEtapas = generalEtapas.map((e) => e.Etapa ?? "");
                        const colorPaletteEtapas = ["#5470C6", "#91CC75", "#FAC858", "#EE6666", "#73C0DE"];
                        const dataEtapas = generalEtapas.map((e, i) => ({
                            value: e.Cantidad ?? 0,
                            itemStyle: {
                                color: colorPaletteEtapas[i % colorPaletteEtapas.length],
                            },
                        }));
                        const etapasChartData = {
                            xAxisData: xAxisDataEtapas,
                            legendData: ["Etapas"],
                            seriesData: [
                                {
                                    name: "Etapas",
                                    type: "bar",
                                    data: dataEtapas,
                                },
                            ],
                        };

                        const generalEstado = dep?.data_general_carga?.general_estado || [];
                        const xAxisDataEstado = generalEstado.map((e) => e.Estado ?? "");
                        const colorPaletteEstado = ["#5470C6", "#91CC75", "#FAC858", "#EE6666", "#73C0DE"];
                        const dataEstado = generalEstado.map((e, i) => ({
                            value: e.Cantidad ?? 0,
                            itemStyle: {
                                color: colorPaletteEstado[i % colorPaletteEstado.length],
                            },
                        }));
                        const estadoChartData = {
                            xAxisData: xAxisDataEstado,
                            seriesData: [
                                {
                                    name: "Estados",
                                    type: "bar",
                                    data: dataEstado,
                                },
                            ],
                        };

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

                        return (
                            <DependencyReportingStructure
                                key={dep.codigo || index}
                                containerId={`DeadlineControlE-${index}`}
                                dependencyName={dep.Nombre}
                                workspaces={taxDataWorkspaces}
                                generalSede={generalSede}
                                reportType="D"
                                fiscalChartData={fiscalChartData}
                                pieChartData={pieChartData}
                                rankingData={{ yAxisRanking, seriesRanking }}
                                etapasChartData={etapasChartData}
                                estadoChartData={estadoChartData}
                                onBarChartDataURL={setBarChartDataURL}
                                onChartPieDataURL={setChartPieDataURL}
                                onDeadlineBDataURL={setDeadlineBDataURL}
                                onEtapasChartDataURL={setEtapasChartDataURL}
                                onEstadoChartDataURL={setEstadoChartDataURL}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
