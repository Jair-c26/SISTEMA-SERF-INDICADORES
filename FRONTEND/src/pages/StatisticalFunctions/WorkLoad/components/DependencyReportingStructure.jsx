// DependencyReportingStructure.jsx
import React from "react";
import Card from "../../../../components/ui/Card";
import DeadlineHeader from "../../DeadlineControl/components/charts/DeadlineHeader";
import TaxData from "../../DeadlineControl/components/charts/TaxData";
import DeadlineBarChartY from "../../DeadlineControl/components/charts/DeadlineBarChartY";
import ChartPie from "../../DeadlineControl/components/charts/ChartPie";
import DeadlinedependenceB from "../../DeadlineControl/components/charts/DeadlinedependenceB";
import { useAuth } from '../../../../context/AuthContext';

const version = import.meta.env.VITE_VERSION || '1.1.1';
/**
 * @param {string}  containerId
 * @param {Array}   workspaces
 * @param {string}  dependencyName
 * @param {object}  generalSede
 * @param {string}  reportType
 * @param {object}  fiscalChartData
 * @param {Array}   pieChartData
 * @param {object}  rankingData
 * @param {object}  etapasChartData
 * @param {object}  estadoChartData
 */
export default function DependencyReportingStructure({
    containerId = "DeadlineControlE",
    workspaces = [],
    dependencyName = "Dependencia sin nombre",
    generalSede = {},
    reportType = "D",
    fiscalChartData = {
        xAxisData: [],
        dataResueltos: [],
        dataIngresados: [],
        dataTramite: [],
    },
    pieChartData = [],
    rankingData = {
        yAxisRanking: [],
        seriesRanking: [],
    },
    etapasChartData = {
        xAxisData: [],
        legendData: [],
        seriesData: [],
    },
    estadoChartData = { xAxisData: [], legendData: [], seriesData: [] },
    onBarChartDataURL,
    onChartPieDataURL,
    onDeadlineBDataURL,
    onEtapasChartDataURL,
    onEstadoChartDataURL,
}) {
    const { user } = useAuth();
    const fullName = user ? `${user.nombre} ${user.apellido}` : "Administrador";
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    // Detectar si hay muchos fiscales
    const hasManyFiscales = workspaces.length >= 10;
    const orientation = hasManyFiscales ? "vertical" : "horizontal";

    return (
        <div id={containerId} className="col-span-9 space-y-3">
            {/* Encabezado superior */}
            <div className="flex items-center justify-between bg-[#274E94] px-4">
                <h2 className="text-base font-semibold text-white uppercase py-3">
                    CARGA LABORAL
                </h2>
                <div className="text-xs text-white justify-items-end">
                    <p>SERF: {version}</p>
                    <span>
                        Fecha de impresion:&nbsp;
                        <strong>{formattedDate}</strong>
                    </span>
                </div>
            </div>

            {/* DeadlineHeader con la data de generalSede y reportType */}
            <DeadlineHeader generalSede={generalSede} reportType={reportType} headerTitle={dependencyName} />

            {/* Contenedor principal */}
            <div className="grid grid-cols-12 gap-3">
                {/* Columna de TaxData */}
                <div className="col-span-3 flex flex-col h-full">
                    <Card className="flex-1">
                        <div className="border-b border-tremor-border py-2 dark:border-dark-tremor-border">
                            <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                FISCALES ACTIVOS / VIGENTES
                            </h3>
                        </div>
                        <div className="py-2 h-full">
                            <TaxData workspaces={workspaces} />
                        </div>
                    </Card>
                </div>

                {/* Columna de gráficos principales */}
                <div className="col-span-9 space-y-3">
                    {/* Gráfico principal: Casos x Fiscal */}
                    {/* Gráfico principal: Casos x Fiscal */}
                    <Card>
                        {(() => {
                            // 1) Determinar cuántos fiscales hay en el eje x
                            const numberOfFiscales = fiscalChartData.xAxisData.length;
                            // 2) Cálculo de altura dinámica mínimo 400px, o 40px por fiscal (ajusta a tu preferencia)
                            const dynamicHeight = Math.max(400, numberOfFiscales * 40);

                            // 3) Condicional: si hay más de 10 fiscales, se usa la altura dinámica
                            if (numberOfFiscales > 10) {
                                return (
                                    <div style={{ height: dynamicHeight }} className="flex justify-center items-center">
                                        <div className="w-full h-full bg-white">
                                            <DeadlineBarChartY
                                                title="Casos ingresados y resueltos por fiscal"
                                                legendData={["casos resueltos", "casos ingresados", "casos tramite"]}
                                                xAxisData={fiscalChartData.xAxisData}
                                                seriesData={[
                                                    {
                                                        name: "casos resueltos",
                                                        type: "bar",
                                                        data: fiscalChartData.dataResueltos,
                                                        itemStyle: { color: "#91CC75" },
                                                    },
                                                    {
                                                        name: "casos ingresados",
                                                        type: "bar",
                                                        data: fiscalChartData.dataIngresados,
                                                        itemStyle: { color: "#5470C6" },
                                                    },
                                                    {
                                                        name: "casos tramite",
                                                        type: "bar",
                                                        data: fiscalChartData.dataTramite,
                                                        itemStyle: { color: "#F09400" },
                                                    },
                                                ]}
                                                orientation={orientation}
                                                onDataURLReady={onBarChartDataURL}
                                            />
                                        </div>
                                    </div>
                                );
                            } else {
                                // 4) Si hay 10 o menos fiscales, usar h-96 fijo
                                return (
                                    <div className="h-96 flex justify-center items-center">
                                        <div className="w-full h-full bg-white">
                                            <DeadlineBarChartY
                                                title="Casos ingresados y resueltos por fiscal"
                                                legendData={["casos resueltos", "casos ingresados", "casos tramite"]}
                                                xAxisData={fiscalChartData.xAxisData}
                                                seriesData={[
                                                    {
                                                        name: "casos resueltos",
                                                        type: "bar",
                                                        data: fiscalChartData.dataResueltos,
                                                        itemStyle: { color: "#91CC75" },
                                                    },
                                                    {
                                                        name: "casos ingresados",
                                                        type: "bar",
                                                        data: fiscalChartData.dataIngresados,
                                                        itemStyle: { color: "#5470C6" },
                                                    },
                                                    {
                                                        name: "casos tramite",
                                                        type: "bar",
                                                        data: fiscalChartData.dataTramite,
                                                        itemStyle: { color: "#F09400" },
                                                    },
                                                ]}
                                                orientation={orientation}
                                                onDataURLReady={onBarChartDataURL}
                                            />
                                        </div>
                                    </div>
                                );
                            }
                        })()}
                    </Card>


                    {/* Fila con ChartPie y Ranking */}
                    <div className="grid grid-cols-2 gap-3">
                        <Card>
                            <div className="h-96 bg-red-200 flex justify-center items-center">
                                <div className="w-full h-full bg-white">
                                    <ChartPie
                                        title="PORCENTAJE FISCAL POR CASOS RESUELTOS DEL ULTIMO MES"
                                        seriesName="Fiscales"
                                        seriesData={pieChartData}
                                        onDataURLReady={onChartPieDataURL}
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="h-96 bg-red-200 flex justify-center items-center">
                                <div className="w-full h-full bg-white">
                                    <DeadlinedependenceB
                                        title="RANKING 5 FISCALES CON MAYOR CASOS RESUELTOS"
                                        yAxisData={rankingData.yAxisRanking}
                                        seriesData={rankingData.seriesRanking}
                                        onDataURLReady={onDeadlineBDataURL}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {hasManyFiscales && (
                        <>
                            <Card>
                                <div className="h-96 bg-red-200 flex justify-center items-center">
                                    <div className="w-full h-full bg-white">
                                        <DeadlineBarChartY
                                            title="CANTIDAD DE ETAPAS POR DEPENDENCIA"
                                            xAxisData={etapasChartData.xAxisData}
                                            seriesData={etapasChartData.seriesData}
                                            onDataURLReady={onEtapasChartDataURL} 
                                        />
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <div className="h-96 bg-red-200 flex justify-center items-center">
                                    <div className="w-full h-full bg-white">
                                        <DeadlineBarChartY
                                            title="ESTADO DE CASOS POR ESTADO FISCAL"
                                            xAxisData={estadoChartData.xAxisData}
                                            seriesData={estadoChartData.seriesData}
                                            onDataURLReady={onEstadoChartDataURL} 
                                        />
                                    </div>
                                </div>
                            </Card>
                        </>
                    )}
                </div>
            </div>
            {!hasManyFiscales && (
                <>
                    <Card>
                        <div className="h-96 bg-red-200 flex justify-center items-center">
                            <div className="w-full h-full bg-white">
                                <DeadlineBarChartY
                                    title="CANTIDAD DE ETAPAS POR DEPENDENCIA"
                                    xAxisData={etapasChartData.xAxisData}
                                    seriesData={etapasChartData.seriesData}
                                    onDataURLReady={onEtapasChartDataURL}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="h-96 bg-red-200 flex justify-center items-center">
                            <div className="w-full h-full bg-white">
                                <DeadlineBarChartY
                                    title="ESTADO DE CASOS POR ESTADO FISCAL"
                                    xAxisData={estadoChartData.xAxisData}
                                    seriesData={estadoChartData.seriesData}
                                    onDataURLReady={onEstadoChartDataURL} 
                                />
                            </div>
                        </div>
                    </Card>
                </>
            )}

            <div className="flex items-center justify-between bg-[#274E94] px-4 py-2">
                <div className="text-xs text-white">
                    <p className="font-semibold">
                        Elaborado por el Área de Gestión e Indicadores
                    </p>
                    <p>
                        Ministerio Público del Distrito Fiscal de Madre de Dios
                    </p>
                </div>

                <div className="flex flex-col text-xs text-white justify-items-end">
                    <span>Usuario:&nbsp;<strong>{fullName}</strong></span>
                    <span>
                        IP:&nbsp;
                        <strong>192.168.1.56</strong>
                    </span>
                </div>
            </div>
        </div>
    );
}
