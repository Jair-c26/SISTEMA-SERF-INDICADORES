
import React from "react";

import Card from "../../../../components/ui/Card";
import { IconUsers, IconPhone } from "@tabler/icons-react";

export default function SideContent({ workspaces = [], onCardClick }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {workspaces.map((workspace, index) => (
        <Card
          key={index}
          className="rounded-tremor-small p-4 cursor-pointer"
          onClick={() => onCardClick?.(workspace)}
        >
          {/* Nombre o título principal */}
          <h4 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            {workspace.name}
          </h4>

          {/* Sección con código, número de casos, estado y teléfono */}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {/* Código */}
            <span className="text-sm text-tremor-content dark:text-dark-tremor-content">
              Código: <strong>{workspace.code}</strong>
            </span>

            {/* Cantidad de casos/despachos */}
            <div className="flex items-center space-x-1.5">
              <IconUsers className="size-4 text-gray-600" aria-hidden="true" />
              <span className="text-sm font-medium">{workspace.casos}</span>
            </div>

            {/* Estado activo/inactivo */}
            {workspace.status === "active" && (
              <span className="inline-flex items-center rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-800">
                activo
              </span>
            )}
            {workspace.status === "inactive" && (
              <span className="inline-flex items-center rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-800">
                inactivo
              </span>
            )}

            {/* Teléfono (opcional) */}
            {workspace.telefono && (
              <div className="flex items-center space-x-1.5">
                <IconPhone className="size-4 text-gray-600" aria-hidden="true" />
                <span className="text-sm text-tremor-content dark:text-dark-tremor-content">
                  {workspace.telefono}
                </span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
