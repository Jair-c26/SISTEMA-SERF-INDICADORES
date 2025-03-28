// CustomTooltips.jsx
import React from "react";
import { cx, formatters } from "@/lib/utils";

// Ejemplo de props que recibirían data de un chart
// payload, active, etc.

export function CustomTooltip({ payload, active }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="flex w-56 items-start justify-between rounded-md border border-gray-200 bg-white p-2 text-sm shadow-md">
      <div className="space-y-2">
        {payload.map((category, index) => (
          <div key={index} className="flex space-x-2.5">
            <span className={cx("w-1 rounded", "bg-blue-500")} aria-hidden="true" />
            <div className="space-y-0.5">
              <p className="text-xs text-gray-500">{category.category}</p>
              <p className="font-medium text-gray-900">{category.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Otros tooltips (CustomTooltip2, 3, 4) se omiten por brevedad, 
// pero puedes agregarlos igual con la misma estructura.
