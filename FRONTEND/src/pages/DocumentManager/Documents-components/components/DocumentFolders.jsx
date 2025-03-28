// DocumentFolders.jsx
import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../../../components/dashboard/Accordion"; // Ajusta la ruta
import { IconFolderSymlink } from "@tabler/icons-react";
import FileContent from "./FileContent"; // Ajusta la ruta a tu FileContent.jsx

export default function DocumentFolders({ carpetasData = [] }) {
  // Si no hay datos, se muestra una carpeta por defecto
  const defaultFolder = {
    id: "default",
    codigo_carp: "default",
    nombre_carp: "Carpeta predeterminada",
    usuarios_archivos: [],
  };

  // Se utiliza la carpeta por defecto si el arreglo está vacío
  const folders = carpetasData.length > 0 ? carpetasData : [defaultFolder];

  return (
    <div className="mx-auto max-w-full">
      <Accordion type="multiple" className="mt-3">
        {folders.map((folder) => (
          <AccordionItem
            key={folder.id}
            value={folder.codigo_carp} // valor único para cada carpeta
          >
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <IconFolderSymlink className="size-5 text-blue-500" />
                {folder.nombre_carp}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              {/* Se envía la sección "usuarios_archivos" */}
              <FileContent archivos={folder.usuarios_archivos} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
