import React from "react";
import { IconUser } from "@tabler/icons-react";
import logoMP from "../../../../assets/icons/logoMP.svg";
import TaxBurdenHeader from "./TaxBurdenHeader";
// Versión dinámica de DeadlineBarChartY
import DeadlineBarChartY from "../../DeadlineControl/components/charts/DeadlineBarChartY";
// Versión dinámica de ChartPie
import ChartPie from "../../DeadlineControl/components/charts/ChartPie";
import ChartGauge from "../../DeadlineControl/components/charts/Chartgauge";

export default function DetailedTaxBurden({ hoja_fiscal }) {
  // Extraer general_fiscal (primer elemento) para mostrar datos generales
  const generalFiscal =
    hoja_fiscal?.general_fiscal && hoja_fiscal.general_fiscal.length > 0
      ? hoja_fiscal.general_fiscal[0]
      : null;

  // Asignar los valores; si no hay datos se usa "N/A"
  const fiscalName = generalFiscal?.Fiscal || "N/A";
  const dependencia = generalFiscal?.Dependencia || "N/A";
  const despacho = generalFiscal?.Despacho || "N/A";
  const porcentaje = generalFiscal?.Porcentaje_Fiscal_Avanzado || "N/A";

  // Extraer datos de anioFiscal para el gráfico de barras
  const anioFiscal = hoja_fiscal?.anioFiscal || [];
  const xAxisData = anioFiscal.map((item) => item.Anio);
  const seriesData = [
    {
      name: "Casos Ingresados",
      type: "bar",
      data: anioFiscal.map((item) => Number(item.Casos_Ingresados)),
      itemStyle: { color: "#1E87F0" },
    },
    {
      name: "Casos resueltos",
      type: "bar",
      data: anioFiscal.map((item) => Number(item.Casos_Resueltos)),
      itemStyle: { color: "#FA9E00" },
    },
    {
      name: "Casos en trámites",
      type: "bar",
      data: anioFiscal.map((item) => Number(item.Casos_Tramite)),
      itemStyle: { color: "#08B714" },
    },
  ];

  // Extraer datos de cant_estado_fiscal para el gráfico Pie "Total de casos por condición"
  const cantEstadoFiscal = hoja_fiscal?.cant_estado_fiscal || [];
  const pieSeriesData = cantEstadoFiscal.map((item) => ({
    value: Number(item.Cantidad),
    name: item.Condicion,
  }));

  // Extraer datos de mes_actual_carga para el gráfico Pie "Casos por mes actual"
  const mesActualData = hoja_fiscal?.mes_actual_carga || [];
  const mesActualSeriesData = mesActualData.map((item) => ({
    value: Number(item.Cantidad),
    name: item.Condicion,
  }));

  return (
    <div
      id="detailedTaxBurden"
      className="w-full bg-white shadow border border-gray-200 text-gray-700 text-sm font-sans"
    >
      {/* Encabezado superior */}
      <div className="flex items-center justify-between bg-gray-100 px-4 py-2">
        <h2 className="text-base font-semibold uppercase text-gray-800">
          CARGA FISCAL
        </h2>
        <span className="text-xs text-gray-600">
          Fecha de actualización&nbsp;
          <strong>15/03/2025</strong>
        </span>
      </div>

      {/* Contenido principal en tabla */}
      <table className="w-full border-collapse">
        <tbody>
          <tr>
            {/* Sección Izquierda: Ícono y estado */}
            <td
              className="p-2 align-top text-center border border-gray-300"
              style={{ width: "10%" }}
            >
              <div className="flex flex-col items-center gap-1">
                <IconUser className="w-12 h-12 text-gray-600" aria-hidden="true" />
                <span className="text-green-700 bg-green-100 border border-green-300 px-2 py-1 rounded text-xs font-medium">
                  activo
                </span>
              </div>
            </td>

            {/* Sección Central: Datos del fiscal */}
            <td
              className="align-top border border-gray-300 m-0 p-0"
              style={{ width: "75%" }}
            >
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td className="border-b border-r border-gray-300 p-1 py-2 font-medium align-top">
                      Nombre:
                    </td>
                    <td className="border-b border-gray-300 p-1 py-2">{fiscalName}</td>
                  </tr>
                  <tr>
                    <td className="border-b border-r border-gray-300 p-1 py-2 font-medium align-top">
                      Dependencia:
                    </td>
                    <td className="border-b border-gray-300 p-1 py-2">{dependencia}</td>
                  </tr>
                  <tr>
                    <td className="border-r border-gray-300 p-1 py-2 font-medium align-top">
                      Despacho:
                    </td>
                    <td className="border-gray-300 p-1 py-2">{despacho}</td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* Sección Derecha: Logo */}
            <td
              className="align-top text-center border border-gray-300"
              style={{ width: "25%" }}
            >
              <div className="flex items-center justify-center">
                <img
                  src={logoMP}
                  alt="Ministerio Público"
                  className="w-24 h-24 object-contain"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Pie con "RESUMEN" */}
      <div className="bg-gray-100 px-4 py-2">
        <strong className="uppercase text-gray-800">Resumen</strong>
      </div>

      {/* NUEVA TABLA DEBAJO DEL "RESUMEN" */}
      <table className="w-full border-collapse">
        <tbody>
          {/* 1.ª Sección (100%) */}
          <tr>
            <td
              colSpan={1}
              className="border border-gray-300 p-2"
              style={{ width: "100%" }}
            >
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td>
                      <TaxBurdenHeader generalFiscal={generalFiscal} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* 2.ª Sección (70% / 30%) */}
          <tr>
            <td colSpan={1} className="border border-gray-300 p-0 h-96">
              <table className="w-full h-full border-collapse">
                <tbody>
                  <tr>
                    <td className="p-2" style={{ width: "70%" }}>
                      <DeadlineBarChartY
                        title="Casos de condición por años"
                        legendData={[
                          "Casos Ingresados",
                          "Casos resueltos",
                          "Casos en trámites",
                        ]}
                        xAxisData={xAxisData}
                        seriesData={seriesData}
                      />
                    </td>
                    <td
                      className="border-l border-gray-300 p-2"
                      style={{ width: "30%" }}
                    >
                      <ChartGauge
                        title="Productividad fiscal"
                        value={porcentaje}
                        progressWidth={20}
                        axisLineWidth={20}
                        detailFontSize={50}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* 3.ª Sección (50% / 50%) */}
          <tr>
            <td colSpan={1} className="border border-gray-300 p-0 h-96">
              <table className="w-full h-full border-collapse">
                <tbody>
                  <tr>
                    <td className="p-2" style={{ width: "50%" }}>
                      <ChartPie
                        title="Total de casos por condición"
                        seriesName="Fases"
                        seriesData={pieSeriesData}
                      />
                    </td>
                    <td
                      className="border-l border-gray-300 p-2"
                      style={{ width: "50%" }}
                    >
                      <ChartPie
                        title="Casos por mes actual"
                        seriesName="Fases"
                        seriesData={mesActualSeriesData}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Ejemplo extra de DeadlineBarChartY (se puede actualizar de forma similar si se requiere) */}
          <tr>
            <td colSpan={1} className="border border-gray-300 p-0 h-96">
              <table className="w-full h-full border-collapse">
                <tbody>
                  <tr>
                    <td className="p-2" style={{ width: "100%" }}>
                      <DeadlineBarChartY
                        title="Casos de condición por años (Ejemplo extra)"
                        legendData={[
                          "Casos Ingresados",
                          "Casos resueltos",
                          "Casos en trámites",
                        ]}
                        xAxisData={[
                          "enero",
                          "febrero",
                          "marzo",
                          "abril",
                          "mayo",
                          "junio",
                          "julio",
                          "agosto",
                          "septiembre",
                          "octubre",
                          "noviembre",
                          "diciembre",
                        ]}
                        seriesData={[
                          {
                            name: "Casos Ingresados",
                            type: "bar",
                            data: [10, 7, 5, 9, 4, 3, 5, 6, 7, 8, 2, 4],
                            itemStyle: { color: "#1E87F0" },
                          },
                          {
                            name: "Casos resueltos",
                            type: "bar",
                            data: [2, 3, 2, 4, 3, 3, 5, 6, 7, 6, 7, 1],
                            itemStyle: { color: "#FA9E00" },
                          },
                          {
                            name: "Casos en trámites",
                            type: "bar",
                            data: [1, 2, 0, 1, 2, 3, 2, 4, 3, 3, 2, 5],
                            itemStyle: { color: "#08B714" },
                          },
                        ]}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="bg-gray-100 px-4 py-2">
        <strong className="uppercase text-gray-800">Lista de casos ingresados</strong>
      </div>
    </div>
  );
}
