import React from "react";
import { IconFileSymlink, IconCalculator, IconClipboardText, IconGavel, IconUserEdit } from "@tabler/icons-react";

// Helper: Divide el texto en grupos de 3 palabras y retorna con saltos de línea
function chunkLabel(label) {
  if (!label) return "";
  const words = label.split(" ");
  const lines = [];
  for (let i = 0; i < words.length; i += 3) {
    lines.push(words.slice(i, i + 3).join(" "));
  }
  return lines.join("\n");
}

// Subcomponente para cada métrica
const Metric = ({ label, value, IconComponent }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Etiqueta de la métrica (dividida en grupos de 3 palabras) */}
      <p className="text-sm text-gray-500 mb-1 whitespace-pre-line">
        {chunkLabel(label)}
      </p>
      {/* Contenido principal (icono + valor), centrado */}
      <div className="flex items-center space-x-2">
        <IconComponent className="w-6 h-6 text-gray-700" aria-hidden="true" />
        <span className="text-xl font-semibold text-gray-700">{value}</span>
      </div>
    </div>
  );
};

export default function TaxBurdenHeader({ generalFiscal }) {
  // Se extraen los valores numéricos; si no hay datos se utiliza 0
  const ingresados = Number(generalFiscal?.Casos_Ingresados) || 0;
  const resueltos = Number(generalFiscal?.Casos_Resueltos) || 0;
  const tramite = Number(generalFiscal?.Casos_Tramite) || 0;

  // Calcular la suma total
  const totalIngresados = ingresados + resueltos + tramite;

  return (
    <div className="border-tremor-border dark:border-dark-tremor-border py-2">
      <div className="flex flex-row w-full justify-around items-center">
        {/* Métricas alineadas en una sola fila */}
        <Metric label="Cantidad total de casos ingresados" value={totalIngresados} IconComponent={IconFileSymlink} />
        <Metric label="Cantidad de casos ingresados del mes" value={ingresados} IconComponent={IconCalculator} />
        <Metric label="Cantidad total de casos resueltos" value={resueltos} IconComponent={IconClipboardText} />
        <Metric label="Cantidad de casos resueltos del mes" value={tramite} IconComponent={IconGavel} />
        <Metric label="Meta del mes" value="x" IconComponent={IconUserEdit} />
      </div>
    </div>
  );
}
