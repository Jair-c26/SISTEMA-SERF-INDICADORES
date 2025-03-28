// src/components/reports/CIReportingStructure.jsx
import React from "react";
import DeadlineHeader from "../../DeadlineControl/components/charts/DeadlineHeader";
import { useAuth } from "../../../../context/AuthContext";
const version = import.meta.env.VITE_VERSION || "1.1.1";
import ChartPie from "../../DeadlineControl/components/charts/ChartPie"; // Asegurarse de que esté importado
import DeadlinedependenceB from "../../DeadlineControl/components/charts/DeadlinedependenceB";
import DeadlineBarChartY from "../../DeadlineControl/components/charts/DeadlineBarChartY";
import Card from "../../../../components/ui/Card";
import TaxData from "../../DeadlineControl/components/charts/TaxData";
export default function CIReportingStructure({
    containerId,
    generalSede = {},
    workspaces = [], // Aseguramos que siempre sea un array
    delitosPorDependencia = [],
    delitosPorcentaje = [],
    delitosPorAnios = [],
}) {

    const { user } = useAuth();
    const fullName = user ? `${user.nombre} ${user.apellido}` : "Administrador";
    const seriesDataPie = delitosPorcentaje.map(item => ({
        name: item.Delito,
        value: item.Cantidad,
    }));
    const seriesData = delitosPorDependencia.map(item => ({
        name: item.Delito,
        value: item.Cantidad,
    }));
    const yAxisData = delitosPorDependencia.map(item => item.Delito);


    // Datos para ranking por años: 


    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    const reportType = "D";


    // Agrupar delitosPorAnios por año
    // Agrupar delitosPorAnios por año
    const groupedByYear = {};
    delitosPorAnios.forEach(item => {
        const year = item.Anio;
        if (!groupedByYear[year]) {
            groupedByYear[year] = [];
        }
        groupedByYear[year].push(item);
    });

    // Obtener años únicos ordenados
    const uniqueYears = Object.keys(groupedByYear).sort();

    // Obtener lista única de delitos a lo largo de los años
    const uniqueDelitos = Array.from(
        new Set(delitosPorAnios.map(item => item.Delito))
    );

    // Construir series para el gráfico: cada serie representa un delito y sus cantidades por año
    const seriesDataAnios = uniqueDelitos.map(delito => ({
        name: delito,
        type: 'bar',
        data: uniqueYears.map(year => {
            const items = groupedByYear[year].filter(item => item.Delito === delito);
            // Si no hay registros para ese delito en este año, retornar null en lugar de 0
            if (items.length === 0) return null;
            return items.reduce((sum, item) => sum + Number(item.Cantidad || 0), 0);
        }),
    }));

    // Definir el eje X con los años únicos
    const yAxisDataAnios = uniqueYears;






    return (
        <div id={containerId} className="col-span-9 space-y-3">
            {/* Encabezado */}
            <div className="flex items-center justify-between bg-[#274E94] px-4">
                <h2 className="text-base font-semibold text-white uppercase py-3">
                    INCIDENCIA DE DELITOS
                </h2>
                <div className="text-xs text-white justify-items-end">
                    <p>SERF: {version}</p>
                    <span>
                        Fecha de impresion:&nbsp;
                        <strong>{formattedDate}</strong>
                    </span>
                </div>
            </div>

            <DeadlineHeader
                generalSede={generalSede}
                reportType={reportType}
                headerTitle={generalSede.Nombre}
            />


            <div className="grid grid-cols-12 gap-3">
                {/* Columna de TaxData */}
                <div className="col-span-3 flex flex-col h-full">
                    <Card className="flex-1">
                        <div className="border-b border-tremor-border py-2 dark:border-dark-tremor-border">
                            <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                FISCALES
                            </h3>
                        </div>
                        <div className="py-2 h-full">
                            <TaxData workspaces={workspaces} />
                        </div>
                    </Card>
                </div>

                <div className="col-span-9 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <Card>
                            <div className="h-96 bg-red-200 flex justify-center items-center">
                                <div className="w-full h-full bg-white">
                                    <ChartPie
                                        title="Porcentaje de cantidad delitos"
                                        seriesName="Porcentaje"
                                        seriesData={seriesDataPie}
                                    />
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="h-96 bg-red-200 flex justify-center items-center">
                                <div className="w-full h-full bg-white">
                                    <DeadlinedependenceB
                                        title="Ranking 5 delitos mas frecuentes"
                                        yAxisData={yAxisData}
                                        seriesData={seriesData}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                    <Card>
                        <div className="h-96 flex justify-center items-center">
                            <div className="w-full h-full bg-white">
                                <DeadlineBarChartY
                                    title="Cantidad de mayor delitos por años"
                                    //legendData={seriesDataAnios}
                                    xAxisData={yAxisDataAnios}
                                    seriesData={seriesDataAnios}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Pie de página */}
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