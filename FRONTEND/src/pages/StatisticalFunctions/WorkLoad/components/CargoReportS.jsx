import React, { useState } from "react";
import Card from "../../../../components/ui/Card";
import FilterHeader from "../../DeadlineControl/components/filterHeader";
import SideContent from "../../DeadlineControl/components/SideContent";
import DeadlineHeader from "../../DeadlineControl/components/charts/DeadlineHeader";
import TableDeadline from "../../DeadlineControl/components/charts/TableDeadline";
import ChartBarLine from "../../DeadlineControl/components/charts/ChartBarLine";
import DeadlineBarChartY from "../../DeadlineControl/components/charts/DeadlineBarChartY";
import DeadlinedependenceB from "../../DeadlineControl/components/charts/DeadlinedependenceB";
import { useCargaFiscal } from "../../../../hooks/useCargaFiscal";
import { useAuth } from '../../../../context/AuthContext';
// Importar useQuery y useQueryClient
import { useQuery, useQueryClient } from "@tanstack/react-query";
const version = import.meta.env.VITE_VERSION || '1.1.1';
export default function CargoReportS() {
  const { user } = useAuth();
  const fullName = user ? `${user.nombre} ${user.apellido}` : "Administrador";
  // Estado para el texto de búsqueda en el Select (ejemplo estático)
  const [searchText, setSearchText] = useState("");
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  // Lista estática de ejemplo para el select

  const reportType = "S";
  // Leer la data de "carga-fiscal" desde la caché de React Query (sin refetch adicional)
  const queryClient = useQueryClient();
  const { data: apiData = {} } = useQuery({
    queryKey: ["carga-fiscal"],
    // queryFn que solo lee del caché (dummy):
    queryFn: async () => {
      return queryClient.getQueryData(["carga-fiscal"]) ?? {};
    },
    staleTime: Infinity,
  });



  // 2. Extraer data_generalSede: ahora se extrae el primer elemento del array
  const generalSede = apiData.data_generalSede?.[0] || {
    Nombre: "Sin valor",
    Total_Dependencias: "x",
  };

  // 3. Extraer list_dependencias
  const listDependencias = apiData.list_dependencias || [];

  // 4. Extraer graf_ingreso_caso_depens (para el Gráfico 1)
  const grafData = apiData.graf_ingreso_caso_depens || [];
  const xAxisData = grafData.map((item) => item.Dependencia);
  const casosResueltosData = grafData.map((item) => item.Casos_Concluidos);
  const casosIngresadosData = grafData.map((item) => item.Casos_Ingresados);

  // 5. Extraer Casos_año_depen para el Gráfico 2 (DeadlineBarChartY)
  const casosAnioDepen = apiData.Casos_año_depen || [];
  const xAxisDataAnio = casosAnioDepen.map((item) => item.Anio.toString());
  const casosResueltosAnio = casosAnioDepen.map((item) => parseInt(item.Casos_Concluidos, 10));
  const casosIngresadosAnio = casosAnioDepen.map((item) => item.Casos_Ingresados);

  // Sección "dependencia" para el título del Gráfico 2
  const selectedDep = apiData.dependencia?.[0];
  const depTitle = selectedDep ? selectedDep.fiscalia : "Sin dependencia";

  // 6. Extraer ranking_dependencias para el Gráfico 3 (DeadlinedependenceB)
  const rankingData = apiData.ranking_dependencias || [];
  const yAxisRanking = rankingData.map((item) => item.Dependencia);
  const seriesRanking = rankingData.map((item) => parseInt(item.Casos_Concluidos, 10));

  // 7. Transformar list_dependencias para SideContent
  const transformedWorkspaces = listDependencias.map((dep) => ({
    name: dep.Nombre_Dep,
    code: dep.Codigo_Dependencia,
    casos: dep.Casos_Ingresados,
    status: dep.Estado === "activo" ? "active" : "inactive",
    telefono: dep.Telefono,
  }));

  return (
    <div className="p-2 space-y-2 min-h-screen">
      {/* Filtro */}
      {/* Se pasa containerIds con un solo elemento: "CargoReportS" */}
      <FilterHeader containerIds={["CargoReportS"]} useCargaHook={useCargaFiscal} />

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
            <div className="border-b border-tremor-border px-4 py-2 dark:border-dark-tremor-border">
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
        {/* Usamos el id="CargoReportS" para que FilterHeader/JS PDF lo capture */}
        <div id="CargoReportS" className="col-span-9 space-y-3">
          {/* Encabezado */}
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

          {/* Se pasa generalSede y code_barras a DeadlineHeader */}
          <DeadlineHeader generalSede={generalSede} reportType={reportType} headerTitle={generalSede.Nombre} />

          {/* Gráfico 1 */}
          <Card>
            <div className="h-96 flex justify-center items-center">
              <div className="flex-1 w-full h-full">
                <ChartBarLine
                  title="Casos ingresados y resueltos por dependencias"
                  legendData={["casos resueltos", "casos ingresados"]}
                  xAxisData={xAxisData}
                  seriesData={[
                    {
                      name: "casos resueltos",
                      type: "bar",
                      stack: "Ad",
                      data: casosResueltosData,
                      itemStyle: { color: "#91CC75" },
                    },
                    {
                      name: "casos resueltos",
                      type: "line",
                      data: casosResueltosData,
                      itemStyle: { color: "#91CC75" },
                    },
                    {
                      name: "casos ingresados",
                      type: "bar",
                      data: casosIngresadosData,
                      itemStyle: { color: "#5470C6" },
                    },
                    {
                      name: "casos ingresados",
                      type: "line",
                      data: casosIngresadosData,
                      itemStyle: { color: "#5470C6" },
                    },
                  ]}
                />
              </div>
            </div>
          </Card>

          {/* Gráfico 2 */}
          <Card className="col-span-6">
            <div className="h-96 flex justify-center items-center">
              <div className="w-full h-full bg-white">
                <DeadlineBarChartY
                  title={depTitle}
                  legendData={["casos resueltos", "casos ingresados"]}
                  xAxisData={xAxisDataAnio}
                  seriesData={[
                    {
                      name: "casos resueltos",
                      type: "bar",
                      data: casosResueltosAnio,
                      itemStyle: { color: "#91CC75" },
                    },
                    {
                      name: "casos ingresados",
                      type: "bar",
                      data: casosIngresadosAnio,
                      itemStyle: { color: "#5470C6" },
                    },
                  ]}
                />
              </div>
            </div>
          </Card>
          {/* Gráfico 3 */}
          <Card className="col-span-6">
            <div className="h-96 flex justify-center items-center">
              <div className="w-full h-full bg-white">
                <DeadlinedependenceB
                  title="Ranking de 5 dependencias con mayor casos resueltos *"
                  yAxisData={yAxisRanking}
                  seriesData={seriesRanking}
                />
              </div>
            </div>
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
