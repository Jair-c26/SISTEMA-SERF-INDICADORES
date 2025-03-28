// DependencyList.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { List, ListItem } from "@tremor/react";
import { Divider } from "../../../components/ui/Divider";
import Card from "../../../components/ui/Card";
import { Label } from "../../../components/ui/Label";
import { Input } from "../../../components/ui/Input";
import { DateRangePicker } from "../../../components/ui/DatePicker";
import { IconBuildings } from "@tabler/icons-react";
import { IconClockHour3 } from "@tabler/icons-react";
import { IconUsers } from "@tabler/icons-react";
import { IconArrowsUpDown } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../../components/dashboard/DropdownMenu";
import { Button } from "@/components/dashboard/Button";
import { useToast } from "../../../lib/useToast";
// Importar el hook para llamar a la API de carga fiscal
import { useCargaFiscal } from "../../../hooks/useCargaFiscal";

// Diccionario de íconos para capacity
const capacityIcon = {
  users: IconBuildings,
  storage: IconUsers,
  lastEdited: IconClockHour3,
};

// Función para formatear el tiempo relativo desde updated_at
function getRelativeTime(dateStr) {
  if (!dateStr) return "";
  const updated = new Date(dateStr);
  const now = new Date();
  const diff = now - updated; // Diferencia en milisegundos

  const diffInMinutes = Math.floor(diff / (1000 * 60));
  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes}m`;
  }
  const diffInHours = Math.floor(diff / (1000 * 60 * 60));
  if (diffInHours < 24) {
    return `Hace ${diffInHours}h`;
  }
  const days = Math.floor(diffInHours / 24);
  return `Hace ${days}d`;
}

/**
 * Transforma cada dependencia a la estructura usada en el UI original (workspaces).
 */
function transformDependencyToWorkspace(dependency) {
  return {
    id: dependency.id, // Se usa cod_depen como id
    name: dependency.cod_depen,
    status: dependency.activo === 1 ? "active" : "inactive",
    type: dependency.fiscalia,
    database: "Fiscal titular",
    capacity: [
      {
        label: "users",
        value: dependency.despachos ? dependency.despachos.length : 0,
      },
      {
        label: "storage",
        value: 1,
      },
      {
        label: "lastEdited",
        value: getRelativeTime(dependency.updated_at),
      },
    ],
  };
}

export default function DependencyList({
  dependencias = [],
  isLoading = false,
  error = null,
  activeTab = "Reports",
  id_sede,
}) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const toastRef = useRef(null);
  const hasDataLoaded = useRef(false);

  // Estados para Dropdown, búsqueda y resaltado
  const [sorting, setSorting] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightReportes, setHighlightReportes] = useState(false);

  // Estado para almacenar la dependencia seleccionada
  const [selectedDependency, setSelectedDependency] = useState(null);

  // Rango estático: último mes (simple ejemplo)
  const today = new Date();
  const fe_inicio = today.toISOString().split("T")[0];
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);
  const fe_fin = nextMonth.toISOString().split("T")[0];

  // useCargaFiscal con clave fija
  const { data: cargaData, isLoading: cargaLoading, error: cargaError, refetch } = useCargaFiscal(
    selectedDependency
      ? {
          id_sede,
          id_dependencia: selectedDependency.id,
          fe_inicio,
          fe_fin,
          estado: null,
        }
      : {},
    {
      enabled: false,
      queryKey: ["carga-fiscal"],
    }
  );

  // Efecto para disparar la consulta cuando se selecciona una dependencia
  useEffect(() => {
    if (selectedDependency) {
      // Agregar el console.log aquí para mostrar los datos enviados al servidor
      console.log("Enviando al servidor con useCargaFiscal:", {
        id_sede,
        id_dependencia: selectedDependency.id,
        fe_inicio,
        fe_fin,
        estado: null,
      });

      if (!toastRef.current) {
        toastRef.current = toast({
          variant: "loading",
          title: "Cargando datos fiscales...",
          disableDismiss: true,
        });
      } else {
        toastRef.current.update({
          variant: "loading",
          title: "Cargando datos fiscales...",
        });
      }
      refetch();
    }
  }, [selectedDependency, id_sede, fe_inicio, fe_fin, refetch, toast]);

  // Efecto para manejar el resultado de la llamada
  useEffect(() => {
    if (!cargaLoading && selectedDependency) {
      if (cargaError) {
        if (toastRef.current) {
          toastRef.current.update({
            variant: "error",
            title: "Error",
            description: "Error al cargar datos fiscales.",
            disableDismiss: false,
          });
        }
      } else if (cargaData) {
        if (toastRef.current) {
          toastRef.current.update({
            variant: "success",
            title: "Éxito",
            description: "Datos fiscales cargados correctamente.",
            disableDismiss: false,
          });
        }
        setTimeout(() => {
          navigate("/dashboard/estadisticas/TaxBurden");
        }, 1000);
      }
    }
  }, [cargaLoading, cargaData, cargaError, selectedDependency, navigate]);

  // Efecto para manejo de toasts durante la carga de dependencias
  useEffect(() => {
    if (activeTab === "Reports") {
      if (isLoading && !hasDataLoaded.current) {
        if (!toastRef.current) {
          toastRef.current = toast({
            variant: "loading",
            title: "Cargando dependencias...",
            disableDismiss: true,
          });
        }
      } else if (!isLoading && toastRef.current && !hasDataLoaded.current) {
        const newToast = toastRef.current.update({
          variant: error ? "error" : "success",
          title: error ? "Error" : "Éxito",
          description: error
            ? "Error al cargar dependencias."
            : "Dependencias cargadas correctamente.",
          disableDismiss: false,
        });
        toastRef.current = newToast;
        hasDataLoaded.current = true;
      }
    }
  }, [isLoading, error, activeTab, toast]);

  useEffect(() => {
    return () => {
      if (toastRef.current) {
        toastRef.current.dismiss();
        toastRef.current = null;
      }
    };
  }, [activeTab]);

  // Transformar dependencias a workspaces
  const regionData = {
    region: "Dependencies",
    workspaces: dependencias.map(transformDependencyToWorkspace),
  };

  // Opciones del menú de reporte
  const radioItems = [
    { value: "control-plazos", label: "Control plazos", hint: "Z-A" },
    { value: "carga-fiscal", label: "Carga fiscal", hint: "Z-A" },
    { value: "incidencia-delitos", label: "Incidencia delitos", hint: "Z-A" },
    { value: "detallado-fiscal", label: "Detallado fiscal", hint: "Z-A" },
  ];

  // Manejo del clic en cada tarjeta
  const handleCardClick = (workspace) => {
    if (!sorting) {
      setHighlightReportes(true);
      toast?.({
        variant: "warning",
        title: "No se seleccionó reporte",
        description: "Por favor, seleccione un tipo de reporte antes de continuar.",
      });
      return;
    }

    if (sorting !== "carga-fiscal") {
      if (sorting === "control-plazos") {
        navigate("/dashboard/estadisticas/DeadlineControl");
      } else if (sorting === "detallado-fiscal") {
        navigate("/dashboard/estadisticas/TaxDetails");
      } else if (sorting === "incidencia-delitos") {
        navigate("/dashboard/estadisticas/CrimeIncidence");
      }

      return;
    }

    // Para "carga-fiscal": establecer la dependencia seleccionada
    setSelectedDependency(workspace);
  };

  // Filtrado de workspaces por búsqueda
  const filteredWorkspaces = regionData.workspaces.filter((workspace) =>
    workspace.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Barra de herramientas superior */}
      <div className="block md:flex md:items-center md:justify-between pt-4">
        <Input
          placeholder="Buscar dependencia..."
          className="h-9 w-full rounded-tremor-small md:max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="lg:flex lg:items-center lg:space-x-3">
          {/* Dropdown Menu: Tipo de reporte */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                className="flex items-center gap-x-2 rounded-tremor-small border border-tremor-border bg-tremor-background py-1 pl-3 pr-1.5 !text-tremor-default font-medium text-tremor-content-strong shadow-tremor-input transition hover:bg-tremor-background-muted hover:text-tremor-content-strong focus:z-10 focus:outline-none dark:border-dark-tremor-border dark:bg-white-950 dark:text-dark-tremor-content-strong dark:shadow-dark-tremor-input hover:dark:bg-white-950/50"
              >
                <IconArrowsUpDown
                  className="-ml-px size-5 shrink-0 text-tremor-content dark:text-dark-tremor-content"
                  aria-hidden={true}
                />
                Tipo de reporte:{" "}
                <span
                  className={`rounded bg-tremor-brand-faint px-2 py-1 text-tremor-label font-semibold dark:bg-tremor-brand-subtle/10 dark:text-dark-tremor-brand ${
                    highlightReportes ? "text-blue-600" : "text-tremor-brand"
                  }`}
                >
                  {sorting
                    ? radioItems.find((item) => item.value === sorting)?.label
                    : "Reportes"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="!min-w-[calc(var(--radix-dropdown-menu-trigger-width))]"
              align="start"
            >
              <DropdownMenuRadioGroup
                value={sorting}
                onValueChange={(val) => {
                  setSorting(val);
                  setHighlightReportes(false);
                }}
              >
                {radioItems.map((item) => (
                  <DropdownMenuRadioItem
                    key={item.value}
                    value={item.value}
                    hint={item.hint}
                  >
                    {item.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Divider />

      {/* Grid de workspaces */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {filteredWorkspaces.map((workspace, index) => (
          <Card
            key={`${workspace.id}-${index}`}
            className="rounded-tremor-small p-4 cursor-pointer"
            onClick={() => handleCardClick(workspace)}
          >
            {/* Fila superior: Nombre y estado */}
            <div className="flex items-center space-x-2">
              <h4 className="truncate text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                <a href={workspace.href} className="focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {workspace.name}
                </a>
              </h4>
              {workspace.status === "active" && (
                <span className="inline-flex items-center rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-400/10 dark:text-blue-400">
                  active
                </span>
              )}
              {workspace.status === "inactive" && (
                <span className="inline-flex items-center rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-400/10 dark:text-red-400">
                  inactive
                </span>
              )}
            </div>

            {/* Fila inferior: Descripción */}
            <List className="mt-3 divide-none">
              <ListItem className="justify-start space-x-2 py-1">
                <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  {workspace.type}
                </span>
              </ListItem>
              <ListItem className="justify-start space-x-2 py-1">
                <span className="font-medium text-base text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  Fiscal titular:
                </span>
                <span className="text-sm">{workspace.database}</span>
              </ListItem>
            </List>

            {/* Capacidad */}
            <div className="mt-5 flex flex-wrap gap-4">
              {workspace.capacity.map((item) => {
                const Icon = capacityIcon[item.label];
                return (
                  <div key={item.label} className="flex items-center space-x-1.5">
                    {Icon && (
                      <Icon
                        className="size-4 text-tremor-content-subtle dark:text-dark-tremor-content-subtle"
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-xs font-medium text-tremor-content dark:text-dark-tremor-content">
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
