import React from "react";
import Card from "../../../../components/ui/Card";
import FilterHeaderDataTax from "./ViewPDF/FilterHeaderDataTax";
import SideContent from '../../DeadlineControl/components/SideContent';
import DetailedTaxBurden from "./DetailedTaxBurden";
import { useFiscalCarga } from "../../../../hooks/useFiscalCarga";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import TaxData from "../../DeadlineControl/components/charts/TaxData";

export default function TaxBurdenReport() {
    const queryClient = useQueryClient();

    const { data: apiData = {} } = useQuery({
        queryKey: ["fiscal-carga"],
        queryFn: async () => {
            return queryClient.getQueryData(["fiscal-carga"]) ?? {};
        },
        staleTime: Infinity,
    });
    const listaFiscal = apiData.list_user || [];
    const taxDataWorkspaces = listaFiscal.map((f) => ({
        name: f.Fiscal || "Sin nombre",
        metrics: {
            dentroPlazo: {
                quantity: f.Casos_Ingresados ?? 0,
                label: "Casos Ingresados",
            },
            porVencer: {
                quantity: f.Casos_Resueltos ?? 0,
                label: "Casos Resueltos",
            },
            vencidos: {
                quantity: f.Casos_Tramite ?? 0,
                label: "Casos Tramite",
            },
            total: {
                percentage: f.Avanzados_Resueltos ? `${f.Avanzados_Resueltos}` : "0%",
                label: "Avanzados Resultos",
            },
        },
    }));

    // fiscalData contiene la sección hoja_fiscal de la respuesta
    const fiscalData = apiData.hoja_fiscal || null;

    // Capturar la dependencia del fiscal.
    // Se asume que "general_fiscal" es un array con al menos un elemento.
    const dependenciaSeleccionada =
        fiscalData && fiscalData.general_fiscal && fiscalData.general_fiscal.length > 0
            ? fiscalData.general_fiscal[0].Dependencia
            : "N/A";

    return (
        <div className="p-2 space-y-2 min-h-screen">
            <FilterHeaderDataTax containerIds={["detailedTaxBurden"]} useCargaHook={useFiscalCarga} />

            <div className="grid grid-cols-12 gap-3 h-full">
                {/* Columna izquierda: Sede y Dependencias */}
                <div className="col-span-3 flex flex-col space-y-3 h-full">
                    {/* Dependencia Seleccionada */}
                    <Card>
                        <div className="border-b border-tremor-border dark:border-dark-tremor-border">
                            <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                Dependencia seleccionada
                            </h3>
                        </div>
                        <div className="h-24 p-2">
                            <h2 className="font-medium text-base">{dependenciaSeleccionada}</h2>
                        </div>
                    </Card>

                    {/* Fiscales relacionados */}
                    <Card className="flex-1">
                        <div className="border-b border-tremor-border px-4 py-2 dark:border-dark-tremor-border">
                            <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                Fiscales relacionados
                            </h3>
                        </div>
                        <div className="p-2 h-full">
                            <TaxData workspaces={taxDataWorkspaces} />
                        </div>
                    </Card>
                </div>

                {/* Columna derecha: DashboardHeader + Gráficos y Tabla */}
                <div id="detailedTaxBurden" className="col-span-9 space-y-3">
                    <DetailedTaxBurden hoja_fiscal={fiscalData} />
                </div>
            </div>
        </div>
    );
}
