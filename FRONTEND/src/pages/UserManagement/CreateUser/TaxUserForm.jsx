import { useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectContent,
    SelectValue,
} from "../../../components/dashboard/Select";
import { Divider } from "../../../components/ui/Divider";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from '../../../lib/useToast';

// Reemplazamos la importación del servicio antiguo por el nuevo
import userTaxListService from '../../../services/api/taxUser-list/userTaxListService';

// Función para generar workspaces dinámicos a partir de rolesData (se mantiene si es requerido en otros campos)
const dynamicWorkspaces = (rolesData) =>
    rolesData.map((role) => {
        const permissionKeys = Object.keys(role.permisos_fk || {});
        const activeCount = permissionKeys.reduce(
            (acc, key) =>
                acc + (role.permisos_fk && role.permisos_fk[key] === 1 ? 1 : 0),
            0
        );
        return {
            id: role.id,
            title: role.roles,
            description: role.descripcion,
            permissions: role.permisos_fk,
            users: `${activeCount} permisos activos`,
        };
    });

// Función para obtener la fecha actual en formato YYYY-MM-DD
function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split("T")[0];
}

// Función para generar id_fiscal a partir de las iniciales de nombres_f
function generateIdFiscal(nombres) {
    if (!nombres) return "";
    // Separa las palabras, toma la primera letra de cada una y las convierte a mayúsculas
    const initials = nombres
        .split(" ")
        .filter(word => word.length > 0)
        .map(word => word[0].toUpperCase())
        .join("");
    return initials;
}

export default function TaxUserForm({ rolesData = [], areasData = [], onCancel }) {
    // Generar workspaces dinámicos a partir de rolesData (si es que se requieren en el formulario)
    const workspaces = dynamicWorkspaces(rolesData);

    // Estados para los campos controlados adicionales (se pueden conservar si se usan en otras secciones)
    const [sexo, setSexo] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");

    // Estado para seleccionar workspace (roles)
    const [selectedWorkspace, setSelectedWorkspace] = useState(
        workspaces[0] || {}
    );

    // Estados para manejar la selección de áreas (sede, dependencia y despacho)
    const [selectedSede, setSelectedSede] = useState("");
    const [selectedDependencia, setSelectedDependencia] = useState("");
    const [selectedDespacho, setSelectedDespacho] = useState("");

    // Estados para controlar la solicitud
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [abortController, setAbortController] = useState(null);

    const { userFormData, setUserFormData } = useAuth();
    const { toast, dismiss } = useToast();

    // Manejo de cambios en los selects de Sede, Dependencia y Despacho
    const handleSedeChange = (value) => {
        const sedeId = value ? Number(value) : null;
        setSelectedSede(sedeId);
        setSelectedDependencia(null);
        setSelectedDespacho(null);
        setUserFormData((prev) => ({
            ...prev,
            sede_fk: sedeId,
            dependencia_fk: null,
            despacho_fk: null,
        }));
    };

    const handleDependenciaChange = (value) => {
        const dependenciaId = value ? Number(value) : null;
        setSelectedDependencia(dependenciaId);
        setSelectedDespacho(null);
        setUserFormData((prev) => ({
            ...prev,
            dependencia_fk: dependenciaId,
            despacho_fk: null,
        }));
    };

    const handleDespachoChange = (value) => {
        const despachoId = value ? Number(value) : null;
        setSelectedDespacho(despachoId);
        setUserFormData((prev) => ({ ...prev, despacho_fk: despachoId }));
    };

    const currentSede = areasData.find((sede) => sede.id === selectedSede);
    const currentDependencia = currentSede?.dependencias?.find(
        (dep) => dep.id === selectedDependencia
    );

    // Función para manejar la cancelación: aborta la solicitud si está en curso y muestra un toast
    const handleCancel = () => {
        if (isSubmitting && abortController) {
            abortController.abort();
            toast({ variant: "warning", title: "Cancelado", description: "La creación del usuario fue cancelada" });
            setIsSubmitting(false);
            setAbortController(null);
        }
        onCancel();
    };

    // handleSubmit modificado para enviar los datos mediante userTaxListService.createTaxUser
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formElements = e.target.elements;
        // Se obtiene el nombre fiscal que servirá para "nombres_f"
        const nombres_f = formElements.nombres_f.value.trim();
        const email_f = formElements.correo.value.trim();
        const dni_f = formElements.dni.value.trim();
        const tipo_fiscal = formElements["tipo-fiscal"].value.trim();
        const espacialidad = formElements.espacialidad.value.trim() || null;

        // Generar id_fiscal basado en las iniciales de nombres_f
        const id_fiscal = generateIdFiscal(nombres_f);

        // Se toma el valor de dependencias_fk y despacho_fk desde los selects
        const dependencias_fk = selectedDependencia || null;
        const despacho_fk = selectedDespacho || null;

        // Construir el objeto de datos para el nuevo usuario fiscal (se usan solo los campos requeridos)
        const newUserData = {
            id_fiscal,       // Generado a partir de las iniciales de nombres_f
            nombres_f,       // Nombre fiscal completo
            email_f,
            dni_f,
            activo: 1,
            ti_fiscal_fk: Number(tipo_fiscal) || 1,  // Se usa el valor del input tipo-fiscal o se asigna 1 por defecto
            despacho_fk,     // Puede ser null
            dependencias_fk, // Se obtiene del select de Dependencia
            espacialidad,    // Especialidad, puede ser null si no se ingresa
        };

        // Bloquear el botón "Guardar" y mostrar toast de carga
        setIsSubmitting(true);
        const controller = new AbortController();
        setAbortController(controller);
        const loadingToast = toast({
            variant: "loading",
            title: "Creando usuario...",
            description: "Por favor, espere."
        });

        try {
            console.log("Datos del usuario fiscal:", newUserData);
            // Se asume que userTaxListService.createTaxUser acepta la opción signal para abortar
            const response = await userTaxListService.createTaxUser(newUserData, { signal: controller.signal });
            console.log("Usuario fiscal creado:", response);
            toast({
                variant: "success",
                title: "Usuario creado",
                description: "El usuario fiscal fue creado exitosamente."
            });
            setTimeout(() => {
                onCancel();
            }, 2000);
        } catch (error) {
            if (error.name === "AbortError") {
                console.error("Solicitud cancelada");
            } else {
                console.error("Error al crear el usuario fiscal:", error);
                toast({
                    variant: "error",
                    title: "Error",
                    description: "No se pudo crear el usuario fiscal."
                });
            }
        } finally {
            setIsSubmitting(false);
            setAbortController(null);
        }
    };

    return (
        <form className="pt-5" onSubmit={handleSubmit} noValidate>
            {/* Sección: Informacion personal */}
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                <div>
                    <h2 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        Información personal
                    </h2>
                    <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                        Ingrese la información personal del usuario fiscal.
                    </p>
                </div>
                <div className="sm:max-w-3xl md:col-span-2">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                        {/* Row 1: Nombre fiscal */}
                        <div className="col-span-full">
                            <Label htmlFor="nombres_f" className="text-tremor-default font-medium">
                                Nombre fiscal <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                id="nombres_f"
                                name="nombres_f"
                                placeholder="Ingresa el nombre fiscal"
                                className="mt-2"
                            />
                        </div>
                        {/* Row 2: Correo */}
                        <div className="col-span-full">
                            <Label htmlFor="correo" className="text-tremor-default font-medium">
                                Correo <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="email"
                                id="correo"
                                name="correo"
                                placeholder="tucorreo@ejemplo.com"
                                className="mt-2"
                            />
                        </div>
                        {/* Row 3: DNI y Tipo Fiscal */}
                        <div className="col-span-full sm:col-span-2">
                            <Label htmlFor="dni" className="text-tremor-default font-medium">
                                DNI <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                id="dni"
                                name="dni"
                                placeholder="Ingresa el DNI"
                                className="mt-2"
                            />
                        </div>
                        <div className="col-span-full sm:col-span-2">
                            <Label htmlFor="tipo-fiscal" className="text-tremor-default font-medium">
                                Tipo Fiscal <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                id="tipo-fiscal"
                                name="tipo-fiscal"
                                placeholder="Ej. 1"
                                className="mt-2"
                            />
                        </div>
                        {/* Row 4: Estado */}
                        <div className="col-span-full sm:col-span-2">
                            <Label htmlFor="estado" className="text-tremor-default font-medium">
                                Estado <span className="text-red-500">*</span>
                            </Label>
                            <Select value={sexo} onValueChange={setSexo}>
                                <SelectTrigger id="estado" className="mt-2 w-full">
                                    <SelectValue placeholder="Selecciona" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Activo</SelectItem>
                                    <SelectItem value="0">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Row 5: Especialidad */}
                        <div className="col-span-full">
                            <Label htmlFor="espacialidad" className="text-tremor-default font-medium">
                                Especialidad
                            </Label>
                            <Input
                                type="text"
                                id="espacialidad"
                                name="espacialidad"
                                placeholder="Ingresa la especialidad"
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Divider className="my-5" />

            {/* Sección: Configuración del Espacio de Trabajo */}
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                <div>
                    <h2 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        Configuración del Espacio de Trabajo
                    </h2>
                    <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                        Selecciona las áreas a las que estarás asignado.
                    </p>
                </div>
                <div className="sm:max-w-3xl md:col-span-2">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                        {/* Sede */}
                        <div className="col-span-full">
                            <Label htmlFor="sede" className="text-tremor-default font-medium">
                                Sede <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={selectedSede ? String(selectedSede) : ""}
                                onValueChange={handleSedeChange}
                            >
                                <SelectTrigger id="sede" className="mt-2 w-full">
                                    <SelectValue placeholder="Selecciona la sede" />
                                </SelectTrigger>
                                <SelectContent>
                                    {areasData.map((sede) => (
                                        <SelectItem key={sede.id} value={String(sede.id)}>
                                            {sede.nombre} ({sede.cod_sede})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Dependencia */}
                        <div className="col-span-full sm:col-span-3">
                            <Label htmlFor="dependencia" className="text-tremor-default font-medium">
                                Dependencia <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={selectedDependencia ? String(selectedDependencia) : ""}
                                onValueChange={handleDependenciaChange}
                                disabled={!selectedSede}
                            >
                                <SelectTrigger id="dependencia" className="mt-2 w-full">
                                    <SelectValue placeholder="Selecciona dependencia" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60 overflow-y-auto">
                                    {currentSede?.dependencias?.map((dep) => (
                                        <SelectItem key={dep.id} value={String(dep.id)}>
                                            {dep.nombre_fiscalia} ({dep.cod_depen})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Despacho */}
                        <div className="col-span-full sm:col-span-3">
                            <Label htmlFor="despacho" className="text-tremor-default font-medium">
                                Despacho <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={selectedDespacho ? String(selectedDespacho) : ""}
                                onValueChange={handleDespachoChange}
                                disabled={!selectedDependencia}
                            >
                                <SelectTrigger id="despacho" className="mt-2 w-full">
                                    <SelectValue placeholder="Selecciona despacho" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currentDependencia?.despachos?.map((despacho) => (
                                        <SelectItem key={despacho.id} value={String(despacho.id)}>
                                            {despacho.nombre_despacho} ({despacho.cod_despa})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
            
            <Divider className="my-5" />
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                    onClick={handleCancel}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Guardar
                </button>
            </div>
        </form>
    );
}
