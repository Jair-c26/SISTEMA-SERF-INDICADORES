import React from "react";
import Card from "../../../../components/ui/Card";
import FilterHeader from "./filterHeader";
import SideContent from "./SideContent";
import DeadlineBarChartY from "./charts/DeadlineBarChartY";
import DeadlineHeader from "./charts/DeadlineHeader";
import DeadlineHeaderC from "./charts/DeadlineHeaderC";
import { useDeadlineControl } from "../../../../hooks/useDeadlineControl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from '../../../../context/AuthContext';
const version = import.meta.env.VITE_VERSION || '1.1.1';
export default function DeadlineControlReport() {
    const { user } = useAuth();
    const fullName = user ? `${user.nombre} ${user.apellido}` : "Administrador";
    const queryClient = useQueryClient();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    const reportType = "S";
    const { data: apiData = {} } = useQuery({
        queryKey: ["deadline-control"],
        queryFn: async () => {
            return queryClient.getQueryData(["deadline-control"]) ?? {};
        },
        staleTime: Infinity,
    });

    // 1) list_dependencias => Para SideContent
    const listDependencias = apiData.list_dependencias || [];
    const generalSede = apiData.general_sede?.[0] || {
        Nombre: "Sin valor",
        Total_Dependencias: "x",
    };
    const transformedWorkspaces = listDependencias.map((dep) => ({
        name: dep.Nombre_Dep,
        code: dep.Codigo_Sede,
        casos: dep.Cantidad_Fiscales,
        status: dep.Estado === "activo" ? "active" : "inactive",
        telefono: dep.Telefono || "999-999-999",
    }));

    // 2) list_depen_plazo => gráfico "Fiscalias por su control de plazos"
    const listPlazos = apiData.list_depen_plazo || [];
    const xAxisDataPlazos = listPlazos.map((item) => item.Nombre_Dep || "");
    const dataVerde = listPlazos.map((item) => item.Cantidad_Verde || 0);
    const dataAmarillo = listPlazos.map((item) => item.Cantidad_Amarillo || 0);
    const dataRojo = listPlazos.map((item) => item.Cantidad_Rojo || 0);

    const numberOfPlazos = xAxisDataPlazos.length;
    const hasManyPlazos = numberOfPlazos > 10;
    const orientationPlazos = hasManyPlazos ? "vertical" : "horizontal";

    // 3) list_depen_cantidad => gráfico "Fiscalias por ingreso de plazos por años"
    const listCantidad = apiData.list_depen_cantidad || [];
    const xAxisDataCantidad = listCantidad.map((dep) => dep.Nombre_Dep || "");

    // Colores distintos para cada barra
    const colorPalette = ["#5470C6", "#91CC75", "#FAC858", "#EE6666", "#73C0DE"];
    const dataCantidad = listCantidad.map((dep, i) => ({
        value: dep.Cantidad_Plazos ?? 0,
        itemStyle: { color: colorPalette[i % colorPalette.length] },
    }));

    const numberOfCantidad = xAxisDataCantidad.length;
    const hasManyCantidad = numberOfCantidad > 10;
    const orientationCantidad = hasManyCantidad ? "vertical" : "horizontal";

    // 4) anios_dependencia_color => "Reporte por años dependencia"
    const aniosData = apiData.anios_dependencia_color || [];
    const generalSedeColor = apiData.general_sede?.[0] || {};
    const chartTitleColor = generalSedeColor.Nombre_Dep
        ? generalSedeColor.Nombre_Dep
        : "Reporte por años dependencia";

    const xAxisDataAnios = aniosData.map((item) => item.Anio ?? "");
    const dataVerdeAnios = aniosData.map((item) => item.Cantidad_Verde || 0);
    const dataAmarilloAnios = aniosData.map((item) => item.Cantidad_Amarillo || 0);
    const dataRojoAnios = aniosData.map((item) => item.Cantidad_Rojo || 0);

    const numberOfAniosColor = xAxisDataAnios.length;
    const hasManyAniosColor = numberOfAniosColor > 10;
    const orientationAniosColor = hasManyAniosColor ? "vertical" : "horizontal";

    return (
        <div className="p-2 space-y-2 min-h-screen">
            <FilterHeader
                containerIds={["DeadlineControlReport"]}
                useCargaHook={useDeadlineControl}
            />

            {/* 
        Quitar “h-full” en el grid y la columna derecha para 
        que no se genere un ancho extra en el PDF.
      */}
            <div className="grid grid-cols-12 gap-3">
                {/* Columna izquierda */}
                <div className="col-span-3 space-y-3">
                    <Card>
                        <div className="border-b border-tremor-border dark:border-dark-tremor-border">
                            <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                Sede Seleccionada
                            </h3>
                        </div>
                        <div className="h-40 p-2">
                            <h2 className="font-medium text-base">{generalSede.Nombre_Sede}</h2>
                            <p className="font-medium text-base">
                                Código: <span className="font-normal text-sm">{generalSede.Codigo_Sede}</span>
                            </p>
                            <p className="font-medium text-base">
                                Cantidad dependencias:{" "}
                                <span className="font-normal text-sm">
                                    {listDependencias.length}
                                </span>
                            </p>
                        </div>
                    </Card>

                    <Card className="flex-1">
                        <div className="border-b border-tremor-border px-4 py-2 dark:border-dark-tremor-border">
                            <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                Dependencias relacionadas:
                            </h3>
                        </div>
                        <div className="p-2">
                            <SideContent workspaces={transformedWorkspaces} />
                        </div>
                    </Card>
                </div>

                {/* Columna derecha */}
                <div id="DeadlineControlReport" className="col-span-9 space-y-3">


                    {/* Encabezado */}
                    <div className="flex items-center justify-between bg-[#274E94] px-4">
                        <h2 className="text-base font-semibold text-white uppercase py-3">
                            CONTROL DE PLAZOS
                        </h2>
                        <div className="text-xs text-white justify-items-end">
                            <p>SERF: {version}</p>
                            <span>
                                Fecha de impresion:&nbsp;
                                <strong>{formattedDate}</strong>
                            </span>
                        </div>
                    </div>
                    <DeadlineHeaderC generalSede={generalSede} reportType={reportType} headerTitle={generalSede.Nombre_Sede} />

                    {/* Gráfico 1: Fiscalias por su control de plazos */}
                    <Card>
                        {hasManyPlazos ? (
                            <div style={{ height: Math.max(400, numberOfPlazos * 40) }}>
                                <DeadlineBarChartY
                                    title="Fiscalias por su control de plazos"
                                    legendData={["Dentro de plazos", "Plazos por vencer", "Plazos vencidos"]}
                                    xAxisData={xAxisDataPlazos}
                                    seriesData={[
                                        {
                                            name: "Dentro de plazos",
                                            type: "bar",
                                            data: dataVerde,
                                            itemStyle: { color: "#008000" },
                                        },
                                        {
                                            name: "Plazos por vencer",
                                            type: "bar",
                                            data: dataAmarillo,
                                            itemStyle: { color: "#FFD700" },
                                        },
                                        {
                                            name: "Plazos vencidos",
                                            type: "bar",
                                            data: dataRojo,
                                            itemStyle: { color: "#FF0000" },
                                        },
                                    ]}
                                    orientation={orientationPlazos}
                                />
                            </div>
                        ) : (
                            <div className="h-96">
                                <DeadlineBarChartY
                                    title="Fiscalias por su control de plazos"
                                    legendData={["Dentro de plazos", "Plazos por vencer", "Plazos vencidos"]}
                                    xAxisData={xAxisDataPlazos}
                                    seriesData={[
                                        {
                                            name: "Dentro de plazos",
                                            type: "bar",
                                            data: dataVerde,
                                            itemStyle: { color: "#008000" },
                                        },
                                        {
                                            name: "Plazos por vencer",
                                            type: "bar",
                                            data: dataAmarillo,
                                            itemStyle: { color: "#FFD700" },
                                        },
                                        {
                                            name: "Plazos vencidos",
                                            type: "bar",
                                            data: dataRojo,
                                            itemStyle: { color: "#FF0000" },
                                        },
                                    ]}
                                    orientation={orientationPlazos}
                                />
                            </div>
                        )}
                    </Card>

                    {/* Gráfico con anios_dependencia_color */}
                    <Card>
                        {hasManyAniosColor ? (
                            <div style={{ height: Math.max(400, numberOfAniosColor * 40) }}>
                                <DeadlineBarChartY
                                    title={chartTitleColor}
                                    legendData={["Dentro de plazos", "Plazos por vencer", "Plazos vencidos"]}
                                    xAxisData={xAxisDataAnios}
                                    seriesData={[
                                        {
                                            name: "Dentro de plazos",
                                            type: "bar",
                                            data: dataVerdeAnios,
                                            itemStyle: { color: "#008000" },
                                        },
                                        {
                                            name: "Plazos por vencer",
                                            type: "bar",
                                            data: dataAmarilloAnios,
                                            itemStyle: { color: "#FFD700" },
                                        },
                                        {
                                            name: "Plazos vencidos",
                                            type: "bar",
                                            data: dataRojoAnios,
                                            itemStyle: { color: "#FF0000" },
                                        },
                                    ]}
                                    orientation={orientationAniosColor}
                                />
                            </div>
                        ) : (
                            <div className="h-96">
                                <DeadlineBarChartY
                                    title={chartTitleColor}
                                    legendData={["Dentro de plazos", "Plazos por vencer", "Plazos vencidos"]}
                                    xAxisData={xAxisDataAnios}
                                    seriesData={[
                                        {
                                            name: "Dentro de plazos",
                                            type: "bar",
                                            data: dataVerdeAnios,
                                            itemStyle: { color: "#008000" },
                                        },
                                        {
                                            name: "Plazos por vencer",
                                            type: "bar",
                                            data: dataAmarilloAnios,
                                            itemStyle: { color: "#FFD700" },
                                        },
                                        {
                                            name: "Plazos vencidos",
                                            type: "bar",
                                            data: dataRojoAnios,
                                            itemStyle: { color: "#FF0000" },
                                        },
                                    ]}
                                    orientation={orientationAniosColor}
                                />
                            </div>
                        )}
                    </Card>

                    {/* Gráfico: Fiscalias por ingreso de plazos por años */}
                    <Card>
                        {hasManyCantidad ? (
                            <div style={{ height: Math.max(400, numberOfCantidad * 40) }}>
                                <DeadlineBarChartY
                                    title="Fiscalias por ingreso de plazos por años"
                                    xAxisData={xAxisDataCantidad}
                                    seriesData={[
                                        {
                                            name: "Plazos",
                                            type: "bar",
                                            data: dataCantidad,
                                        },
                                    ]}
                                    orientation={orientationCantidad}
                                />
                            </div>
                        ) : (
                            <div className="h-96">
                                <DeadlineBarChartY
                                    title="Fiscalias por ingreso de plazos por años"
                                    xAxisData={xAxisDataCantidad}
                                    seriesData={[
                                        {
                                            name: "Plazos",
                                            type: "bar",
                                            data: dataCantidad,
                                        },
                                    ]}
                                    orientation={orientationCantidad}
                                />
                            </div>
                        )}
                    </Card>


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
            </div>
        </div>
    );
}
