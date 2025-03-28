import React, { useState, useEffect, useRef } from "react";
import { useListUser } from '../../hooks/useListUser';
import ListTaxUsers from "./components/ListTaxUsers";
import { useListTaxUser } from '../../hooks/useListTaxUser';
import { useListRol } from '../../hooks/useListRol';
import { useListDF } from '../../hooks/useListDF';
import importUserService from '../../services/api/import-user/importUserService';
import { TabNavigation, TabNavigationLink } from "../../pages/DocumentManager/Documents-components/TabNavigation";
import FileUpload from "../DocumentManager/Documents-components/components/FileUpload";
import { IconUsersPlus, IconFilePlus } from "@tabler/icons-react";
import { useToast } from '../../lib/useToast';

export default function TaxUsers() {
    const [activeTab, setActiveTab] = useState("Usuarios");
    const { toast, dismiss } = useToast(); // Añadir dismiss aquí
    const toastRef = useRef(null);
    const hasDataLoaded = useRef(false);

    // Obtener estados de carga
    const {
        data: usersTaxData = [],
        error: errorUsers,
        isLoading: usersLoading
    } = useListTaxUser();
    
    const {
        data: rolesData,
        error: errorRoles,
        isLoading: rolesLoading
    } = useListRol();

    const {
        data: areasData,
        error: errorAreas,
        isLoading: areasLoading
    } = useListDF();

    const error = errorUsers || errorRoles || errorAreas;
    const isLoading = usersLoading || rolesLoading || areasLoading;
    const dataLoaded = usersTaxData && rolesData && areasData;

    useEffect(() => {
        if (activeTab === "Usuarios") {
            if (isLoading && !hasDataLoaded.current) {
                // Crear nuevo toast de loading
                toastRef.current = toast({
                    variant: "loading",
                    title: "Cargando datos...",
                    description: "Espere a que se cargen los datos",
                    disableDismiss: true,

                });
            } else if (!isLoading && toastRef.current) {
                // Actualizar toast existente
                const newToast = toastRef.current.update({
                    variant: error ? "error" : "success",
                    title: error ? "Error" : "Éxito",
                    description: error ? "Error al cargar datos." : "Datos cargados correctamente.",
                    disableDismiss: false,

                });

                // Mantener referencia actualizada
                toastRef.current = newToast;
                hasDataLoaded.current = true;
            }
        }
    }, [isLoading, activeTab, error, toast]);

    // Limpiar al cambiar pestaña (modificado)
    useEffect(() => {
        return () => {
            if (toastRef.current) {
                // Usar dismiss del objeto toast en lugar de por ID
                toastRef.current.dismiss();
                toastRef.current = null;
            }
        };
    }, [activeTab]);

    return (
        <div className="p-2 space-y-4">
            <h1 className="text-base font-semibold">GESTOR DE USUARIOS FISCALES</h1>

            <TabNavigation>
                <TabNavigationLink
                    className="inline-flex gap-2"
                    href="#"
                    active={activeTab === "Usuarios"}
                    onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("Usuarios");
                    }}
                >
                    <IconUsersPlus className="size-4" aria-hidden="true" />
                    Usuarios
                </TabNavigationLink>

                <TabNavigationLink
                    className="inline-flex gap-2"
                    href="#"
                    active={activeTab === "importar"}
                    onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("importar");
                    }}
                >
                    <IconFilePlus className="size-4" aria-hidden="true" />
                    Importar
                </TabNavigationLink>
            </TabNavigation>

            {activeTab === "Usuarios" && (
                <div>
                    {dataLoaded && (
                        <ListTaxUsers
                            usersTaxData={usersTaxData || []}
                            rolesData={rolesData}
                            areasData={areasData}
                        />
                    )}
                </div>
            )}

            {activeTab === "importar" && (
                <div>
                    <FileUpload uploadService={importUserService.importUsers} />
                </div>
            )}
        </div>
    );
}