// DeadlineHeader.jsx
import React from "react";
import { IconUser, IconBuildings, IconCalendar, IconFileText } from "@tabler/icons-react";
import logoMP from "../../../../../assets/icons/logoMP.svg";
import Barcode from "react-barcode";

const Metric = ({ label, value, IconComponent, valueClassName = "text-xl" }) => {
  return (
    <div className="flex flex-col flex-1 items-center justify-center border-r-2 border-tremor-border dark:border-dark-tremor-border pr-3">
      {label && <p className="text-sm text-center py-2 font-medium">{label}</p>}
      {IconComponent ? (
        <div className="flex items-center justify-center space-x-1.5">
          <IconComponent className="size-8 text-gray-600" aria-hidden="true" />
          <span className={`font-medium ${valueClassName} text-gray-600 text-center`}>
            {value}
          </span>
        </div>
      ) : (
        <span className={`font-medium ${valueClassName} text-gray-600 text-center`}>
          {value}
        </span>
      )}
    </div>
  );
};

/**
 * @param {object} props
 * @param {object} [props.generalSede] - { Casos_Ingresados, Total_Fiscales, Total_Dependencias }
 * @param {string} [props.code_barras] - valor para el barcode (opcional)
 * @param {string} [props.reportType="S"] - "S" => CargoReportS, "D" => CargoReportD
 * @param {string} [props.headerTitle] - texto adicional que se mostrará encima de las métricas
 */
export default function DeadlineHeader({
  generalSede = {},
  code_barras,
  reportType = "S",
  headerTitle = "",
}) {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Decide la etiqueta según sea "S" (CargoReportS) o "D" (CargoReportD)
  const thirdLabel = reportType === "D" ? "Cantidad de despachos" : "Cantidad de dependencias";

  return (
    <div className="border-b border-tremor-border py-2 dark:border-dark-tremor-border">
      {/* (1) Título adicional, si existe */}
      {headerTitle && (
        <div className="px-3 pb-2">
          <h2 className="text-base font-semibold text-gray-700 uppercase">
            {headerTitle}
          </h2>
        </div>
      )}

      {/* (2) Contenedor de métricas */}
      <div className="flex flex-row gap-3 w-full px-3">
        <Metric
          label="Cantidad de casos ingresados"
          value={generalSede.Casos_Ingresados ?? 0}
          IconComponent={IconFileText}
        />
        <Metric
          label="Cantidad de fiscales"
          value={generalSede.Total_Fiscales ?? 0}
          IconComponent={IconUser}
        />
        <Metric
          label={thirdLabel}
          value={generalSede.Total_Dependencias ?? 0}
          IconComponent={IconBuildings}
        />
        <Metric
          label="Fecha registro"
          value={formattedDate}
          IconComponent={IconCalendar}
          valueClassName="text-sm"
        />
        <Metric
          label="Código Reporte"
          value={
            <Barcode
              value={code_barras || "Sin code_barras"}
              className="w-32 h-24"
            />
          }
        />
        <Metric
          // Logo del MP
          value={<img src={logoMP} alt="Logo" className="w-40 h-auto" />}
        />
      </div>
    </div>
  );
}
