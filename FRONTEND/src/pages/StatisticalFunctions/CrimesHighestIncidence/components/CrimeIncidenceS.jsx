// CrimeIncidenceS.jsx
import React from "react";
import Card from "../../../../components/ui/Card";
import FilterHeader from "../../DeadlineControl/components/filterHeader";
import SideContent from "../../DeadlineControl/components/SideContent";
import DeadlineHeader from "../../DeadlineControl/components/charts/DeadlineHeader";
import { useIncidenciaDelitoS } from "../../../../hooks/useIncidenciaDelitoS";
import { useAuth } from "../../../../context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "../../../../components/dashboard/Accordion";

const version = import.meta.env.VITE_VERSION || '1.1.1';

export default function CrimeIncidenceS() {
    const { user } = useAuth();
    const fullName = user ? `${user.nombre} ${user.apellido}` : "Administrador";
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    
    const reportType = "S";

    // Leer la data de "incidencia-delito" desde la caché de React Query
    const queryClient = useQueryClient();
    const { data: apiData = {} } = useQuery({
        queryKey: ["incidencia-delito"],
        queryFn: async () => {
            return queryClient.getQueryData(["incidencia-delito"]) ?? {};
        },
        staleTime: Infinity,
    });

    const listSedesDependencia = apiData.list_sedes_dependencia || {};
    const depenAllDeli = listSedesDependencia.depen_all_deli || [];

    // Se extrae el primer objeto de general_sede (si existe)
    const generalSede = apiData.general_sede?.[0] || {
        Nombre: "Sin valor",
        Total_Dependencias: "x",
    };

    // Extraer la lista de dependencias (delitos por dependencia)
    const listDependencia = apiData.list_dependencia || [];

    // Transformar list_dependencia para SideContent
    const transformedWorkspaces = listDependencia.map((dep) => ({
        name: dep.Nombre_Dep,
        code: dep.Codigo_Dependencia,
        casos: dep.Casos_Ingresados,
        status: dep.Estado === "activo" ? "active" : "inactive",
        telefono: dep.Telefono,
    }));

    return (
        <div className="p-2 space-y-2 min-h-screen">
            {/* Se envía el nuevo parámetro cantidadDelitos con valor 5 */}
            <FilterHeader
                containerIds={["CargoReportS"]}
                useCargaHook={useIncidenciaDelitoS}
                cantidadDelitos={5}
            />

            <div className="grid grid-cols-12 gap-3 h-full">
                {/* Columna izquierda: Sede y Dependencias */}
                <div className="col-span-3 flex flex-col space-y-3 h-full">
                    {/* Sede Seleccionada */}
                    <Card>
                        <div className="border-b border-tremor-border dark:border-dark-tremor-border">
                            <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                Sede Seleccionada
                            </h3>
                        </div>
                        <div className="h-40 p-2">
                            {/* Se utiliza el valor dinámico obtenido de general_sede */}
                            <h2 className="font-medium text-base">{generalSede.Nombre}</h2>
                            <p className="font-medium text-base">
                                Código: <span className="font-normal text-sm">SC</span>
                            </p>
                            <p className="font-medium text-base">
                                Cantidad dependencias:{" "}
                                <span className="font-normal text-sm">
                                    {generalSede.Total_Dependencias}
                                </span>
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
                        <div className="p-2 h-full">
                            <SideContent workspaces={transformedWorkspaces} />
                        </div>
                    </Card>
                </div>

                {/* Columna derecha */}
                <div id="CargoReportS" className="col-span-9 space-y-3">
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

                    {/* Se pasa generalSede a DeadlineHeader */}
                    <DeadlineHeader generalSede={generalSede} reportType={reportType} headerTitle={generalSede.Nombre} />

                    <div className="flex items-center justify-between bg-[#E6E6E6] px-4">
                        <h3 className="text-base font-semibold uppercase py-2">
                            LISTA DE FISCALIAS CON SUS DELITOS CORRESPONDIENTES
                        </h3>
                    </div>

                    <div className="mx-auto">
                        <h1 className="text-md font-semibold text-gray-900 dark:text-gray-50">
                            {generalSede.Nombre}
                        </h1>
                        {/* Generación dinámica de AccordionItems basados en depen_all_deli */}
                        <Accordion type="multiple" className="px-5 mt-3">
                            {depenAllDeli.map((item, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger>
                                        {item.n_depen}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {item.delitos && item.delitos.map((delitoItem, i) => (
                                            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                                                <div>
                                                    1.{i + 1} {delitoItem.Delito}
                                                </div>
                                                <div>{delitoItem.Cantidad}</div>
                                            </div>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
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
            </div>
        </div>
    );
}
