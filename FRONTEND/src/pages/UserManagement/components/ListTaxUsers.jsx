// src/pages/Users/components/ListUsers.jsx

import React, { useMemo, useState, useEffect } from "react";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from "@tremor/react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { IconUserCircle, IconTrash, IconPencil } from "@tabler/icons-react";
import { Button } from "../../../components/ui/Button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../../../components/ui/Dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerBody,
    DrawerFooter,
    DrawerClose,
} from "../../../components/ui/Drawer";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Divider } from "../../../components/ui/Divider";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "../../../components/dashboard/Select";
import userListService from "../../../services/api/user-list/userListService";
import userTaxListService from "../../../services/api/taxUser-list/userTaxListService";
import OptionalAlert from "../../../components/alert/OptionalAlert";
import UserForm from "./UserForm";
import TaxUserForm from "../CreateUser/TaxUserForm";
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
export default function ListTaxUsers({
    usersTaxData = [],
    rolesData = [],
    areasData = [],
}) {
    // Se usa un estado local para manejar modificaciones (como eliminación)
    const [tableData, setTableData] = useState(usersTaxData);
    useEffect(() => {
        setTableData(usersTaxData);
    }, [usersTaxData]);
    // Control del Drawer de edición
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    // estado local para guardar el “workspace” (rol) seleccionado
    const [editSelectedWorkspace, setEditSelectedWorkspace] = useState(null);
    function buildWorkspaces(roles) {
        return roles.map((role) => {
            // Contar permisos activos
            const permissionKeys = role.permisos_fk ? Object.keys(role.permisos_fk) : [];
            const activeCount = permissionKeys.reduce((acc, key) => {
                return acc + (role.permisos_fk[key] === 1 ? 1 : 0);
            }, 0);
            return {
                id: role.id,
                title: role.roles,
                description: role.descripcion,
                permissions: role.permisos_fk,
                users: `${activeCount} permisos activos`,
            };
        });
    }
    // 3) Generar la lista de workspaces a partir de rolesData
    const allWorkspaces = useMemo(() => buildWorkspaces(rolesData), [rolesData]);
    useEffect(() => {
        if (selectedUser) {
            // Si el usuario tiene un roles_fk, buscarlo en rolesData
            const userRoleId = selectedUser.roles_fk?.id;
            if (userRoleId) {
                // Buscar en rolesData el que coincida
                const foundRole = rolesData.find((r) => r.id === userRoleId);
                if (foundRole) {
                    // Transformarlo a workspace
                    const roleWorkspace = buildWorkspaces([foundRole])[0];
                    setEditSelectedWorkspace(roleWorkspace);
                } else {
                    setEditSelectedWorkspace(null);
                }
            } else {
                setEditSelectedWorkspace(null);
            }
        } else {
            setEditSelectedWorkspace(null);
        }
    }, [selectedUser, rolesData]);
    // Función para “eliminar” un usuario (actualiza su estado a “Inactivo”)
    const handleDeleteUser = (rowData) => {
        OptionalAlert({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esto!",
            onConfirm: async () => {
                try {
                    await userTaxListService.deleteTaxUser(rowData.id);
                    setTableData((prev) => prev.filter((user) => user.id !== rowData.id));
                    console.log("Usuario eliminado correctamente");
                } catch (error) {
                    console.error("Error al eliminar usuario:", error.response?.data);
                }
            },
        });
    };
    // Columnas de la tabla
    const columns = useMemo(
        () => [
            {
                header: "ID Fiscal",
                accessorKey: "id_fiscal",
                meta: { align: "text-left" },
            },
            {
                header: "Nombre / Correo",
                id: "nombreEmail",
                enableSorting: false,
                meta: { align: "text-left" },
                cell: ({ row }) => (
                    <div className="inline-flex items-start gap-2">
                        <IconUserCircle className="size-5 text-gray-600" />
                        <div className="flex flex-col">
                            <span className="font-medium text-sm text-gray-800">
                                {row.original.nombres_f}
                            </span>
                            <span className="text-sm text-gray-500">
                                {row.original.email_f}
                            </span>
                        </div>
                    </div>
                ),
            },
            {
                header: "Especialidad",
                accessorKey: "espacialidad",

                enableSorting: false,
                meta: { align: "text-left" },
                cell: ({ row }) => row.original.espacialidad || "N/A",
            },
            {
                header: "Dependencia",
                accessorKey: "dependencias_fk",
                enableSorting: false,
                meta: { align: "text-left" },
                cell: ({ row }) => row.original.dependencia?.nombre_fiscalia || "N/A",
            },
            {
                header: "Acciones",
                id: "acciones",
                meta: { align: "text-right" },
                cell: ({ row }) => {
                    const rowData = row.original;
                    const isInactive = rowData.activo === 0;
                    return (
                        <div className="inline-flex items-center gap-2">
                            <button
                                type="button"
                                className="inline-flex items-center rounded-md px-2 py-1.5 text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-100"
                                onClick={() => {
                                    setSelectedUser(rowData);
                                    setIsDrawerOpen(true);
                                }}
                            >
                                <IconPencil className="size-4" aria-hidden />
                            </button>
                            {/* Botón Eliminar */}
                            <button
                                type="button"
                                onClick={() => handleDeleteUser(rowData)}
                                disabled={isInactive}
                                className={`inline-flex items-center rounded-md px-2 py-1.5 text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <IconTrash className="size-4" aria-hidden />
                            </button>
                        </div>
                    );
                },
            },
        ],
        []
    );
    // Configuración de la tabla con react-table
    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 8,
            },
        },
    });
    const totalRows = table.getFilteredRowModel().rows.length;
    const pageIndex = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    const startIndex = pageIndex * pageSize + 1;
    const endIndex = Math.min(startIndex + pageSize - 1, totalRows);
    const [editSelectedSede, setEditSelectedSede] = useState("");
    const [editSelectedDependencia, setEditSelectedDependencia] = useState("");
    const [editSelectedDespacho, setEditSelectedDespacho] = useState("");
    useEffect(() => {
        if (selectedUser) {
            // Reiniciar los selects en caso no se encuentre nada
            setEditSelectedSede("");
            setEditSelectedDependencia("");
            setEditSelectedDespacho("");
            const despachoId = selectedUser.despacho_fk;
            if (despachoId) {
                // 1) Encontrar la sede que contenga esa dependencia con ese despacho
                const foundSede = areasData.find((sede) =>
                    sede.dependencias?.some((dep) =>
                        dep.despachos?.some((d) => d.id === despachoId)
                    )
                );
                if (foundSede) {
                    setEditSelectedSede(String(foundSede.id));
                    // 2) Dentro de esa sede, encontrar la dependencia
                    const foundDep = foundSede.dependencias?.find((dep) =>
                        dep.despachos?.some((d) => d.id === despachoId)
                    );
                    if (foundDep) {
                        setEditSelectedDependencia(String(foundDep.id));
                        // 3) Dentro de esa dependencia, setear el despacho
                        const foundDesp = foundDep.despachos?.find(
                            (d) => d.id === despachoId
                        );
                        if (foundDesp) {
                            setEditSelectedDespacho(String(foundDesp.id));
                        }
                    }
                }
            }
        } else {
            // Si no hay selectedUser, limpiar
            setEditSelectedSede("");
            setEditSelectedDependencia("");
            setEditSelectedDespacho("");
        }
    }, [selectedUser, areasData]);
    const handleChangeSede = (sedeId) => {
        setEditSelectedSede(sedeId);
        // Al cambiar la sede, limpiamos la dependencia y despacho
        setEditSelectedDependencia("");
        setEditSelectedDespacho("");
    };
    const handleChangeDependencia = (depId) => {
        setEditSelectedDependencia(depId);
        // Al cambiar la dependencia, limpiamos el despacho
        setEditSelectedDespacho("");
    };
    const handleChangeDespacho = (despId) => {
        setEditSelectedDespacho(despId);
    };
    const currentSede = areasData.find((s) => String(s.id) === editSelectedSede);
    const dependencias = currentSede?.dependencias || [];
    const currentDep = dependencias.find(
        (dep) => String(dep.id) === editSelectedDependencia
    );
    const despachos = currentDep?.despachos || [];
    return (
        <div className="flex items-start">
            {/* Panel Izquierdo */}
            <div className="w-1/4 flex flex-col space-y-1">
                <h4 className="font-semibold text-base text-gray-800">
                    Lista de Usuarios
                </h4>
                <p className="text-sm text-gray-600 pb-1">
                    Ejemplo de tabla generada a partir de datos recibidos.
                </p>
                {/* Dialog para crear nuevo usuario */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-fit">Nuevo usuario</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Crear nuevo usuario</DialogTitle>
                            <DialogDescription>
                                Completa los campos para agregar un usuario.
                            </DialogDescription>
                        </DialogHeader>
                        <TaxUserForm
                            rolesData={rolesData}
                            areasData={areasData}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            {/* Tabla de usuarios */}
            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHeaderCell key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHeaderCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody>
                        {table.getPaginationRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* Paginación */}
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing{" "}
                        <span className="font-medium text-gray-800">
                            {startIndex}-{endIndex}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-gray-800">{totalRows}</span>
                    </p>
                    <div className="inline-flex items-center rounded-lg border border-gray-200 px-1 shadow-sm">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RiArrowLeftSLine className="size-5 text-gray-600" aria-hidden />
                            <span className="sr-only">Previous</span>
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RiArrowRightSLine className="size-5 text-gray-600" aria-hidden />
                            <span className="sr-only">Next</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* Drawer para Editar Usuario */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Editar Usuario</DrawerTitle>
                        <DrawerDescription>
                            Modifica los datos del usuario seleccionado
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerBody>
                        {!selectedUser ? (
                            <p className="text-sm text-gray-500">
                                No se ha seleccionado ningún usuario.
                            </p>
                        ) : (
                            <div className="space-y-6">
                                {/* Sección de edición de información personal */}
                                <section>
                                    <h2 className="font-semibold text-gray-800 text-base">
                                        Informacion personal
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Ingrese la información personal del usuario y otros datos de identificación.
                                    </p>
                                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label
                                                htmlFor="nombre"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Nombre <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                id="nombre"
                                                name="nombre"
                                                className="mt-1"
                                                value={selectedUser.nombre}
                                                onChange={() => { }}
                                            />
                                        </div>

                                        <div className="col-span-full">
                                            <Label
                                                htmlFor="correo"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Correo <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="email"
                                                id="correo"
                                                name="correo"
                                                className="mt-1"
                                                value={selectedUser.email}
                                                onChange={() => { }}
                                            />
                                        </div>
                                        {/* ... Resto de campos para edición */}
                                        {/* Row 3: DNI, Fecha */}
                                        <div>
                                            <Label
                                                htmlFor="dni"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                DNI <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                id="dni"
                                                name="dni"
                                                className="mt-1"
                                                value={selectedUser.dni}
                                                onChange={() => { }}
                                            />
                                        </div>

                                        <div className="col-span-full">
                                            <Label
                                                htmlFor="tipo-fiscal"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Tipo Fiscal <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="text"
                                                id="tipo-fiscal"
                                                name="tipo-fiscal"
                                                className="mt-1"
                                                value={selectedUser.tipo_fiscal}
                                                onChange={() => { }}
                                            />
                                        </div>
                                        {/* Row 7: Password*, Confirmar Password* */}
                                        <div>
                                            <Label
                                                htmlFor="password"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Password <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="password"
                                                id="password"
                                                name="password"
                                                className="mt-1"
                                                placeholder="********"
                                                value="(sin data)"
                                                onChange={() => { }}
                                            />
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor="confirm-password"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Confirmar Password <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="password"
                                                id="confirm-password"
                                                name="confirm-password"
                                                className="mt-1"
                                                placeholder="********"
                                                value="(sin data)"
                                                onChange={() => { }}
                                            />
                                        </div>
                                    </div>
                                </section>
                                <Divider className="my-5" />
                                {/* Sección: Configuración del Espacio de Trabajo */}
                                <section>
                                    <h2 className="font-semibold text-gray-800 text-base">
                                        Configuración del Espacio de Trabajo
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Selecciona las areas al que estarás asignado dentro de la organización.
                                    </p>
                                    <div className="mt-3 grid grid-cols-1 gap-4">
                                        {/* Sede */}
                                        <div>
                                            <Label
                                                htmlFor="sede"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Sede <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={editSelectedSede}
                                                onValueChange={handleChangeSede}
                                            >
                                                <SelectTrigger id="sede" className="mt-1 w-full">
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
                                        <div>
                                            <Label
                                                htmlFor="dependencia"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Dependencia <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={editSelectedDependencia}
                                                onValueChange={handleChangeDependencia}
                                                disabled={!editSelectedSede}
                                            >
                                                <SelectTrigger id="dependencia" className="mt-1 w-full">
                                                    <SelectValue placeholder="Selecciona la dependencia" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-60 overflow-y-auto">
                                                    {dependencias.map((dep) => (
                                                        <SelectItem key={dep.id} value={String(dep.id)}>
                                                            {dep.nombre_fiscalia} ({dep.cod_depen})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {/* Despacho */}
                                        <div>
                                            <Label
                                                htmlFor="despacho"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Despacho <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={editSelectedDespacho}
                                                onValueChange={handleChangeDespacho}
                                                disabled={!editSelectedDependencia}
                                            >
                                                <SelectTrigger id="despacho" className="mt-1 w-full">
                                                    <SelectValue placeholder="Selecciona el despacho" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {despachos.map((desp) => (
                                                        <SelectItem key={desp.id} value={String(desp.id)}>
                                                            {desp.nombre_despacho} ({desp.cod_despa})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}
                    </DrawerBody>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <button className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200">
                                Cancelar
                            </button>
                        </DrawerClose>
                        <button
                            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            Guardar
                        </button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
