// ListSede.jsx
import React, { useEffect, useRef } from "react";
import { IconBuildings, IconMapPin, IconUser } from "@tabler/icons-react";
import Card from "../../../components/ui/Card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../../components/ui/Dialog";
import DependencyList from "./DependencyList";
import { useListDF } from "../../../hooks/useListDF";
import { useToast } from "../../../lib/useToast";
import { useAuth } from "../../../context/AuthContext";

export default function ListSede({ activeTab = "Areas fiscal" }) {
  const { user } = useAuth();
  console.log("Despacho del usuario:", user?.despacho_fk);
  const { data: fetchedAreas = [], isLoading, error } = useListDF();

  const { toast } = useToast();

  const toastRef = useRef(null);
  const hasDataLoaded = useRef(false);

  useEffect(() => {
    if (activeTab === "Areas fiscal") {
      if (isLoading && !hasDataLoaded.current && !toastRef.current) {
        toastRef.current = toast({
          variant: "loading",
          title: "Cargando datos...",
          disableDismiss: true,
        });
      } else if (!isLoading && toastRef.current && !hasDataLoaded.current) {
        const newToast = toastRef.current.update({
          variant: error ? "error" : "success",
          title: error ? "Error" : "Éxito",
          description: error ? "Error al cargar datos." : "Datos cargados correctamente.",
          disableDismiss: false,
        });
        toastRef.current = newToast;
        hasDataLoaded.current = true;
      }
    }
  }, [activeTab, isLoading, error, toast]);

  useEffect(() => {
    return () => {
      if (toastRef.current) {
        toastRef.current.dismiss();
        toastRef.current = null;
      }
      hasDataLoaded.current = false;
    };
  }, [activeTab]);

  const getStatusLabel = (activo) => (activo === 1 ? "Activa" : "Inactiva");
  const statusColor = (activo) =>
    activo === 1
      ? "bg-blue-50 text-blue-700 ring-blue-600/20"
      : "bg-red-50 text-red-700 ring-red-600/20";

  // Si el usuario tiene un despacho_fk, se filtran las sedes
  let areasToDisplay = fetchedAreas || [];
  if (user && user.despacho_fk) {
    const despachoId = Number(user.despacho_fk.id);
    const dependenciaId = Number(user.despacho_fk.dependencia_fk);

    areasToDisplay = fetchedAreas.filter((sede) =>
      (sede.dependencias || []).some((depen) =>
        Number(depen.id) === dependenciaId &&
        (depen.despachos || []).some((desp) => Number(desp.id) === despachoId)
      )
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {areasToDisplay.length > 0 ? (
        areasToDisplay.map((sede) => {
          // Filtrar las dependencias: solo conservar aquella que tenga:
          // depen.id === dependenciaId y despachos con id === despachoId
          const dependenciasToShow =
            user && user.despacho_fk
              ? (sede.dependencias || []).filter((depen) =>
                  Number(depen.id) === Number(user.despacho_fk.dependencia_fk) &&
                  (depen.despachos || []).some(
                    (desp) => Number(desp.id) === Number(user.despacho_fk.id)
                  )
                )
              : (sede.dependencias || []);

          return (
            <Dialog key={sede.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer">
                  <div className="flex items-center justify-between space-x-4 sm:justify-start sm:space-x-2">
                    <h4 className="truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                      Distrito fiscal Madre de Dios
                    </h4>
                    <span
                      className={`inline-flex items-center whitespace-nowrap rounded px-1.5 py-0.5 text-tremor-label font-medium ring-1 ring-inset ${statusColor(
                        sede.activo
                      )}`}
                      aria-hidden="true"
                    >
                      {getStatusLabel(sede.activo)}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-3">
                    <div className="flex items-center space-x-1">
                      <IconBuildings className="size-5 text-tremor-content-subtle dark:text-dark-tremor-content-subtle" aria-hidden="true" />
                      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                        {sede.nombre}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <IconMapPin className="size-5 text-tremor-content-subtle dark:text-dark-tremor-content-subtle" aria-hidden="true" />
                      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                        Madre de Dios, {sede.provincia}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <IconUser className="size-5 text-tremor-content-subtle dark:text-dark-tremor-content-subtle" aria-hidden="true" />
                      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                        Dr. ***
                      </p>
                    </div>
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dependencias de {sede.nombre}</DialogTitle>
                  <DialogDescription>
                    Información de las dependencias asociadas a esta sede.
                  </DialogDescription>
                </DialogHeader>
                <DependencyList dependencias={dependenciasToShow} id_sede={sede.id} />
                <DialogFooter>
                  <DialogClose asChild>
                    <button className="px-4 py-2 border rounded hover:bg-gray-100">
                      Cancelar
                    </button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          );
        })
      ) : (
        <p className="text-gray-500">Cargando sedes disponibles...</p>
      )}
    </div>
  );
}
