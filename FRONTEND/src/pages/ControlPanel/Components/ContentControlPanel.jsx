'use client';

import React, { useEffect, useRef } from "react";
import Card from '../../../components/ui/Card';
import { IconBuildings } from '@tabler/icons-react';
import { useListDF } from '../../../hooks/useListDF';
import { useListTaxUser } from '../../../hooks/useListTaxUser';
import { useToast } from '../../../lib/useToast';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function ContentControlPanel() {
    // Obtención de data de áreas
    const { data: fetchedAreas, isLoading, error } = useListDF();
    // Obtención de data de fiscales
    const { data: fetchedFiscales, isLoading: isLoadingFiscales, error: errorFiscales } = useListTaxUser();
    const { toast } = useToast();

    // Referencia para manejar el toast de áreas (se puede implementar de forma similar para fiscales si se desea)
    const toastRef = useRef(null);
    const hasDataLoaded = useRef(false);

    useEffect(() => {
        // Toast para áreas
        if (isLoading && !hasDataLoaded.current && !toastRef.current) {
            toastRef.current = toast({
                variant: "loading",
                title: "Cargando áreas...",
                disableDismiss: true,
            });
        } else if (!isLoading && toastRef.current && !hasDataLoaded.current) {
            const newToast = toastRef.current.update({
                variant: error ? "error" : "success",
                title: error ? "Error" : "Áreas cargadas",
                description: error
                    ? "No se pudieron cargar las áreas."
                    : "Se cargaron las áreas correctamente.",
                disableDismiss: false,
            });
            toastRef.current = newToast;
            hasDataLoaded.current = true;
        }
    }, [isLoading, error, toast]);

    useEffect(() => {
        return () => {
            if (toastRef.current) {
                toastRef.current.dismiss();
                toastRef.current = null;
            }
            hasDataLoaded.current = false;
        };
    }, []);

    // Cálculos de estadísticas:
    // Para SEDES: cantidad de elementos en fetchedAreas.
    const sedeCount = fetchedAreas ? fetchedAreas.length : "Null";
    // Para DEPENDENCIAS: suma de la cantidad de dependencias en cada área.
    const dependenciaCount = fetchedAreas
        ? fetchedAreas.reduce(
            (acc, area) => acc + (area.dependencias ? area.dependencias.length : 0),
            0
        )
        : "Null";
    // Para FISCALES: cantidad de elementos en fetchedFiscales.
    const fiscalesCount = fetchedFiscales ? fetchedFiscales.length : "Null";

    // Se define el arreglo de datos a mostrar en el panel.
    const data = [
        {
            name: 'SEDES',
            stat: sedeCount.toString(),
            change: '+1.3%',
            color: 'bg-blue-500',
        },
        {
            name: 'DEPENDENCIAS',
            stat: dependenciaCount.toString(),
            change: '+9.1%',
            color: 'bg-blue-500',
        },
        {
            name: 'FISCALES',
            stat: fiscalesCount.toString(),
            change: '-4.8%',
            color: 'bg-blue-500',
        },
    ];

    return (
        <div className="mx-auto max-w-full">
            <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((item) => (
                    <Card
                        key={item.name}
                        className={classNames(
                            "border-l-4",
                            item.color.replace("bg-", "border-")
                        )}
                    >
                        <div className="flex space-x-3">
                            <dt className="flex w-full items-center justify-between space-x-3 truncate text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                <span className="truncate">{item.name}</span>
                                <span className="font-medium text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis">
                                    {item.change}
                                </span>
                            </dt>
                        </div>
                        {/* Contenedor del valor */}
                        <div className="mt-2">
                            <dd className="flex items-center text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                <IconBuildings className="mr-2" />
                                <span>{item.stat}</span>
                            </dd>
                        </div>
                    </Card>
                ))}
            </dl>
        </div>
    );
}
