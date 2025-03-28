// AreasList.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Divider } from "../../../components/ui/Divider";
import AreaListContent from './AreaListContent';
// Importamos el hook para obtener la data de la API
import { useListDF } from '../../../hooks/useListDF';
// Importamos el hook para mostrar toasts
import { useToast } from '../../../lib/useToast';

const areasDataOptions = [
  {
    title: 'Administracion sede',
    description: 'Gestiona las operaciones administrativas y recursos humanos.',
    linkText: 'Ver detalles',
    href: '#',
  },
  {
    title: 'Administracion dependencia',
    description: 'Controla las operaciones diarias y la logística de la organización.',
    linkText: 'Ver detalles',
    href: '#',
  },
  {
    title: 'Administracion despacho',
    description: 'Supervisa y mejora la infraestructura tecnológica.',
    linkText: 'Ver detalles',
    href: '#',
  },
];

export default function AreasList() {
  // Estado para almacenar la opción seleccionada; por defecto, la primera opción ("Administracion sede")
  const [selectedArea, setSelectedArea] = useState(areasDataOptions[0]);

  // Obtenemos la data completa de áreas desde la API, incluyendo isLoading y error
  const { data: fetchedAreas, isLoading, error } = useListDF();

  // Hook para mostrar toasts
  const { toast, dismiss } = useToast();
  // Referencia para mantener el toast actual y evitar duplicados
  const toastRef = useRef(null);
  // Flag para saber si ya se cargaron los datos al menos una vez
  const hasDataLoaded = useRef(false);

  // Efecto para manejar los toasts según el estado de carga
  useEffect(() => {
    if (isLoading && !hasDataLoaded.current) {
      if (!toastRef.current) {
        toastRef.current = toast({
          variant: "loading",
          title: "Cargando datos de áreas...",
          disableDismiss: true,
        });
      }
    } else {
      if (toastRef.current) {
        const newToast = toastRef.current.update({
          variant: error ? "error" : "success",
          title: error ? "Error" : "Datos cargados",
          description: error
            ? error.message || "Error al cargar datos de áreas."
            : "Los datos se han cargado correctamente.",
          disableDismiss: false,
        });
        toastRef.current = newToast;
        hasDataLoaded.current = true;
      }
    }
  }, [isLoading, error, fetchedAreas, toast]);

  // Al desmontar el componente se limpia el toast
  useEffect(() => {
    return () => {
      if (toastRef.current) {
        toastRef.current.dismiss();
        toastRef.current = null;
      }
    };
  }, []);

  // Función para transformar la data según el tipo de área seleccionado
  const getTableData = () => {
    if (!fetchedAreas) return [];
    if (selectedArea.title === "Administracion sede") {
      return fetchedAreas.map(area => ({
        combinedName: `${area.nombre} (${area.cod_sede})`,
        ruc: area.ruc,
        activo: area.activo,
        codigo_postal: area.codigo_postal,
        regional_fk: area.regional_fk,
      }));
    } else if (selectedArea.title === "Administracion dependencia") {
      let dependencias = [];
      fetchedAreas.forEach(area => {
        if (area.dependencias && area.dependencias.length > 0) {
          area.dependencias.forEach(depen => {
            dependencias.push({
              combinedFiscalia: `${depen.fiscalia} (${depen.cod_depen})`,
              tipo_fiscalia: depen.tipo_fiscalia,
              sede_fk: depen.sede_fk,
              ruc: depen.ruc,
              activo: depen.activo,
            });
          });
        }
      });
      return dependencias;
    } else if (selectedArea.title === "Administracion despacho") {
      let despachos = [];
      fetchedAreas.forEach(area => {
        if (area.dependencias && area.dependencias.length > 0) {
          area.dependencias.forEach(depen => {
            if (depen.despachos && depen.despachos.length > 0) {
              depen.despachos.forEach(despa => {
                despachos.push({
                  combinedDespacho: `${despa.nombre_despacho} (${despa.cod_despa})`,
                  dependencia_fk: despa.dependencia_fk,
                  activo: despa.activo,
                  ruc: despa.ruc,
                });
              });
            }
          });
        }
      });
      return despachos;
    }
    return [];
  };

  const tableData = getTableData();

  return (
    <div className="p-2 space-y-2">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {areasDataOptions.map((area) => (
          <div
            key={area.title}
            className="flex flex-col items-start justify-between py-1 pl-4"
          >
            <div>
              <p className="-ml-2 border-l-2 border-[#0052f5] border-tremor-brand pl-2 text-tremor-default font-medium text-tremor-content-strong dark:border-dark-tremor-brand dark:text-dark-tremor-content-strong">
                {area.title}
              </p>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setSelectedArea(area);
              }}
              className="mt-2 text-tremor-default font-medium text-tremor-brand hover:text-tremor-brand-emphasis dark:text-dark-tremor-brand hover:dark:text-dark-tremor-brand-emphasis"
            >
              {area.linkText} &#8594;
            </a>
          </div>
        ))}
      </div>
      <Divider className="my-5" />
      <div>
        {/* Se renderiza el componente AreaListContent pasándole:
            - title: para determinar qué columnas y formularios se deben mostrar.
            - tableData: la data transformada según la opción seleccionada.
        */}
        <AreaListContent title={selectedArea.title} tableData={tableData} />
      </div>
    </div>
  );
}
