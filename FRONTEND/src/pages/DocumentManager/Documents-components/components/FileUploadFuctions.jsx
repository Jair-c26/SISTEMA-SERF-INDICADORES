// FileUploadFuctions.jsx
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { IconFileZip, IconTrash, IconEye } from "@tabler/icons-react";
import { Divider } from "@tremor/react";
import * as XLSX from "xlsx";

import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectContent,
} from "../../../../components/dashboard/Select";
import { Button } from "@/components/dashboard/Button";
import InputSearch from "./inputSearch";
import { Filters } from "./FiltersUI";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "../../../../components/ui/Dialog";

import Preview from "../../../../components/preview-data/preview";
import { useToast } from "../../../../lib/useToast";

// Hook para obtener sedes y dependencias
import { useListDF } from "../../../../hooks/useListDF";

// Importamos los servicios de importación
import importCargaService from '../../../../services/api/fileUpload-list/importCargaService';
import importPlazoService from "../../../../services/api/fileUpload-list/importPlazoService";
import importDelitosService from "../../../../services/api/fileUpload-list/importDelitosService";
import importTipoDelitosService from "../../../../services/api/fileUpload-list/importTipoDelitosService";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

// Opciones de reporte: 
const reportOptions = [
    { value: "carga_laboral", label: "Carga laboral" },
    { value: "control_plazos", label: "Control plazos" },
    { value: "incidencia_delitos", label: "Incidencia delitos" },
    { value: "tipo_delitos", label: "Tipo delitos" },
];

export default function FileUploadFuctions() {
    const [files, setFiles] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("recent");
    const { toast } = useToast();

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => setFiles(acceptedFiles),
    });

    // Selects
    const [select1, setSelect1] = useState(""); // Reporte
    const [select2, setSelect2] = useState(""); // Sede
    const [select3, setSelect3] = useState(""); // Dependencia
    const [select4, setSelect4] = useState("");

    const resetAllSelects = () => {
        setSelect1("");
        setSelect2("");
        setSelect3("");
        setSelect4("");
    };

    // Vista previa
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null);

    // Obtenemos áreas (sedes) y dependencias
    const { data: areasData } = useListDF();
    const selectedArea = areasData?.find((area) => area.nombre === select2);
    const dependencias = selectedArea?.dependencias || [];

    // Manejo de vista previa (parsear Excel)
    const handlePreview = async (file) => {
        if (!file) return;
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                setPreviewData(jsonData);
                setIsPreviewOpen(true);
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error("Error al analizar el archivo:", error);
            toast?.({
                variant: "error",
                title: "Error al previsualizar el archivo",
                description: error.message,
            });
        }
    };

    // Renderizamos la lista de archivos
    const filesList = files.map((file) => (
        <li
            key={file.path || file.name}
            className="relative rounded-tremor-default border border-tremor-border bg-tremor-background p-4 shadow-tremor-input dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:shadow-dark-tremor-input"
        >
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
                {/* Botón eliminar */}
                <button
                    type="button"
                    className="rounded-tremor-small p-2 text-tremor-content-subtle hover:text-tremor-content dark:text-dark-tremor-content-subtle hover:dark:text-dark-tremor-content"
                    aria-label="Remove file"
                    onClick={() =>
                        setFiles((prev) =>
                            prev.filter(
                                (f) => f.path !== file.path && f.name !== file.name
                            )
                        )
                    }
                >
                    <IconTrash className="size-5 shrink-0" aria-hidden />
                </button>
                {/* Botón ver (abre dialog) */}
                <button
                    type="button"
                    className="rounded-tremor-small p-2 text-tremor-content-subtle hover:text-tremor-content dark:text-dark-tremor-content-subtle hover:dark:text-dark-tremor-content"
                    aria-label="Preview file"
                    onClick={() => handlePreview(file)}
                >
                    <IconEye className="size-5 shrink-0" aria-hidden />
                </button>
            </div>
            <div className="flex items-center space-x-3 pr-12">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-tremor-small bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle">
                    <IconFileZip
                        className="size-5 text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis"
                        aria-hidden
                    />
                </span>
                <div>
                    <p className="text-tremor-label font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        {file.path || file.name}
                    </p>
                    <p className="mt-0.5 text-tremor-label text-tremor-content dark:text-dark-tremor-content">
                        {file.size} bytes
                    </p>
                </div>
            </div>
        </li>
    ));

    /**
     * handleUpload:
     * Determina el servicio a utilizar basado en el reporte seleccionado.
     * - "Carga laboral": se envía el archivo y el id de dependencia.
     * - "Control plazos": se envía solo el archivo.
     * - "Incidencia delitos": se envía solo el archivo.
     * - "Tipo delitos": se envía el archivo y el id de dependencia.
     */
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!files.length) {
            toast?.({
                variant: "error",
                title: "No hay ningún archivo seleccionado",
                description: "Seleccione un archivo para cargar.",
            });
            return;
        }

        // Validar que se haya seleccionado dependencia cuando corresponda
        if ((select1 === "carga_laboral" || select1 === "tipo_delitos") && !select3) {
            toast?.({
                variant: "error",
                title: "Falta dependencia",
                description: "Por favor seleccione una dependencia.",
            });
            return;
        }

        // Muestra toast de loading
        const loadingToast = toast?.({
            variant: "loading",
            title: "Subiendo...",
            description: "Su archivo se está cargando. Espere, por favor.",
            disableDismiss: true,
        });

        try {
            const fileToUpload = files[0];
            if (select1 === "carga_laboral" || select1 === "tipo_delitos") {
                // Para ambos casos se requiere enviar también el id_dependencia
                const selectedDep = dependencias.find(
                    (d) => d.nombre_fiscalia === select3
                );
                if (!selectedDep) {
                    throw new Error("Seleccione una dependencia válida");
                }
                if (select1 === "carga_laboral") {
                    await importCargaService.uploadFile(fileToUpload, selectedDep.id);
                } else {
                    await importTipoDelitosService.uploadFile(fileToUpload, selectedDep.id);
                }
            } else if (select1 === "control_plazos") {
                await importPlazoService.uploadFile(fileToUpload);
            } else if (select1 === "incidencia_delitos") {
                await importDelitosService.uploadFile(fileToUpload);
            } else {
                throw new Error("Seleccione un tipo de reporte válido.");
            }

            loadingToast?.dismiss();
            toast?.({
                variant: "success",
                title: "Archivo cargado",
                description: "¡Su archivo fue cargado exitosamente!",
            });
            setFiles([]);
        } catch (error) {
            loadingToast?.dismiss();
            toast?.({
                variant: "error",
                title: "Error de subida",
                description: error.message || "Algo salió mal.",
            });
        }
    };

    return (
        <div className="sm:mx-auto sm:max-w-full">
            <form action="#" method="post" onSubmit={handleUpload}>
                {/* Se han actualizado los textos del encabezado */}
                <h2 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Importación de Archivos
                </h2>
                <p className="mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                    Seleccione el tipo de reporte y cargue su archivo. Recuerde elegir la dependencia cuando sea requerido.
                </p>

                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-6">
                    <div className="col-span-full">
                        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end">
                            {/* Select reporte */}
                            <Select value={select1} onValueChange={setSelect1}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Seleccione reporte" />
                                </SelectTrigger>
                                <SelectContent>
                                    {reportOptions.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Select sede - se habilita para "Carga laboral", "Tipo delitos" */}
                            <Select
                                value={select2}
                                onValueChange={setSelect2}
                                disabled={!(select1 === "carga_laboral" || select1 === "tipo_delitos")}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Seleccione sede" />
                                </SelectTrigger>
                                <SelectContent>
                                    {areasData?.map((area) => (
                                        <SelectItem key={area.id} value={area.nombre}>
                                            {area.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Select dependencia - se habilita para "Carga laboral", "Tipo delitos" */}
                            <Select
                                value={select3}
                                onValueChange={setSelect3}
                                disabled={!(select1 === "carga_laboral" || select1 === "tipo_delitos")}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Seleccione dependencia" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dependencias.map((depen) => (
                                        <SelectItem key={depen.id} value={depen.nombre_fiscalia}>
                                            {depen.nombre_fiscalia}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Botón para resetear selects */}
                            <Button
                                type="button"
                                variant="secondary"
                                className="whitespace-nowrap"
                                onClick={resetAllSelects}
                            >
                                Reset all
                            </Button>
                        </div>
                    </div>

                    {/* Sección de Drag & Drop */}
                    <div className="col-span-full">
                        <label
                            htmlFor="file-upload-2"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Carga de archivos
                        </label>
                        <div
                            {...getRootProps()}
                            className={classNames(
                                isDragActive
                                    ? "border-tremor-brand bg-tremor-brand-faint dark:border-dark-tremor-brand dark:bg-dark-tremor-brand-faint"
                                    : "",
                                "mt-2 flex justify-center rounded-tremor-default border border-dashed border-gray-300 px-6 py-20 dark:border-dark-tremor-border"
                            )}
                        >
                            <div>
                                <IconFileZip
                                    className="mx-auto h-12 w-12 text-tremor-content-subtle dark:text-dark-tremor-content"
                                    aria-hidden
                                />
                                <div className="mt-4 flex text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                                    <p>Arrastre y suelte o seleccione</p>
                                    <label
                                        htmlFor="file-upload-2"
                                        className="relative cursor-pointer rounded-tremor-small pl-1 font-medium text-tremor-brand hover:underline hover:underline-offset-4 dark:text-dark-tremor-brand"
                                    >
                                        <span>el archivo</span>
                                        <input
                                            {...getInputProps()}
                                            id="file-upload-2"
                                            name="file-upload-2"
                                            type="file"
                                            className="sr-only"
                                        />
                                    </label>
                                    <p className="pl-1">que desea cargar</p>
                                </div>
                            </div>
                        </div>
                        <p className="mt-2 text-tremor-label leading-5 text-tremor-content dark:text-dark-tremor-content sm:flex sm:items-center sm:justify-between">
                            <span>Se permite cargar solo tipo de archivos .xls</span>
                            <span className="pl-1 sm:pl-0">Max. size per file: 50MB</span>
                        </p>
                        {filesList.length > 0 && (
                            <>
                                <h4 className="mt-6 text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    File(s) to upload
                                </h4>
                                <ul role="list" className="mt-4 space-y-4">
                                    {filesList}
                                </ul>
                            </>
                        )}
                    </div>
                </div>

                <Divider className="my-4" />

                <div className="flex items-center justify-end space-x-3">
                    <button
                        type="submit"
                        className="whitespace-nowrap rounded-tremor-small bg-tremor-brand px-4 py-2 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input transition-all hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis"
                    >
                        Subir archivo
                    </button>
                </div>
            </form>

            {/* Dialog para vista previa */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Preview of the file</DialogTitle>
                        <DialogDescription>See the contents of your Excel file</DialogDescription>
                    </DialogHeader>
                    <Preview data={previewData} />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
