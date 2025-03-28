// FileContent.jsx
import React, { useMemo, useState } from "react";
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
import { IconTrash, IconDownload } from "@tabler/icons-react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { Input } from "../../../../components/ui/Input";
import { Label } from "../../../../components/ui/Label";
import { useToast } from "../../../../lib/useToast";
// Importa el Dialog y sus componentes
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../../../components/ui/Dialog";

import OptionalAlert from "../../../../components/alert/OptionalAlert"; // Ajusta la ruta

// Importa el linkService para la descarga
import linkService from "../../../../services/api/fileUpload-list/linkService";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Componente interno para el Dialog de descarga
function DownloadDialog({ fileRow, folder }) {
  const [caducidad, setCaducidad] = useState("");
  const [tempUrl, setTempUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const handleDownload = async () => {
    const caducidadNum = parseInt(caducidad, 10);
    if (isNaN(caducidadNum) || caducidadNum < 1 || caducidadNum > 10) {
      toast({
        variant: "warning",
        title: "Valor inválido",
        description: "Ingrese un número entre 1 y 10 en Caducidad.",
      });
      return;
    }

    // Bloquear botones y mostrar toast de loading
    setIsDownloading(true);
    // Crea el toast de loading y guarda la referencia
    const downloadToast = toast({
      variant: "loading",
      title: "Descargando...",
      description: "Esperar a que se genere el link.!",
      disableDismiss: true,
    });

    try {
      // Se toma el id del primer archivo del usuario
      const fileId = fileRow.usuario.archivos_del_usuario?.[0]?.id;
      if (!fileId) {
        console.error("No se encontró el id del archivo.");
        // Actualiza el toast a error y desbloquea
        downloadToast.update({
          variant: "error",
          title: "Error",
          description: "No se encontró el archivo.",
          disableDismiss: false,
        });
        setIsDownloading(false);
        return;
      }
      const data = await linkService.downloadFile(fileId, caducidad);
      setTempUrl(data.temporary_url);
      
      // Crear un elemento <a> para disparar la descarga automáticamente
      const a = document.createElement("a");
      a.href = data.temporary_url;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Actualiza el toast a success
      downloadToast.update({
        variant: "success",
        title: "Descarga exitosa",
        description: "El archivo se descargó correctamente.",
        disableDismiss: false,
      });
    } catch (error) {
      console.error("Error en la descarga", error);
      // Actualiza el toast a error
      downloadToast.update({
        variant: "error",
        title: "Error en la descarga",
        description: "No se pudo descargar el archivo.",
        disableDismiss: false,
      });
    } finally {
      // Desbloquea botones al finalizar la llamada
      setIsDownloading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center rounded-md px-2 py-1.5 text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-100"
        >
          <IconDownload className="size-4" aria-hidden />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Descargar archivo</DialogTitle>
          <DialogDescription>
            Complete la información para la descarga:
          </DialogDescription>
        </DialogHeader>
        {/* Formulario de inputs */}
        <div className="space-y-4">
          {/* Primera fila: Nombre y email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nombre</Label>
              <Input value={fileRow.usuario.nombre} disabled />
            </div>
            <div>
              <Label>email</Label>
              <Input value={fileRow.usuario.email} disabled />
            </div>
          </div>
          {/* Segunda fila: Archivo */}
          <div>
            <Label>Archivo</Label>
            <Input
              value={fileRow.usuario.archivos_del_usuario?.[0]?.nombre || ""}
              disabled
            />
          </div>
          {/* Tercera fila: Codigo archivo, Carpeta y Caducidad */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Codigo archivo</Label>
              <Input
                value={
                  fileRow.usuario.archivos_del_usuario?.[0]?.codigo || ""
                }
                disabled
              />
            </div>
            <div>
              <Label>Carpeta</Label>
              <Input value={folder?.nombre_carp || ""} disabled />
            </div>
            <div>
              <Label>Caducidad</Label>
              <Input
                value={caducidad}
                placeholder="Ingrese caducidad"
                onChange={(e) => setCaducidad(e.target.value)}
              />
            </div>
          </div>
          {/* Mostrar la temporary_url si existe */}
          {tempUrl && (
            <div className="mt-4">
              <Label>Link descarga:</Label>
              <div className="text-blue-600 break-all">{tempUrl}</div>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <button className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200" disabled={isDownloading}>
              Cancelar
            </button>
          </DialogClose>
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            Descargar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function FileContent({ archivos = [], folder }) {
  // Mantenemos el array de archivos en un estado local
  const [fileData, setFileData] = useState(archivos);

  // Para “eliminar” un archivo, simulamos la acción con OptionalAlert
  const handleDelete = (file) => {
    OptionalAlert({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      onConfirm: async () => {
        // Simulamos proceso asíncrono:
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Removemos el archivo del state local
        setFileData((prev) => prev.filter((f) => f.usuario.id !== file.usuario.id));
      },
    });
  };

  // Columnas de la tabla actualizadas
  const columns = useMemo(
    () => [
      {
        header: "Nombre",
        id: "nombre",
        enableSorting: false,
        meta: { align: "text-left" },
        cell: ({ row }) => {
          const user = row.original.usuario;
          return (
            <div className="inline-flex flex-col">
              <span className="font-medium text-sm text-gray-800">{user.nombre}</span>
              <span className="text-sm text-gray-500">{user.email}</span>
            </div>
          );
        },
      },
      {
        header: "Código de archivo",
        id: "codigo",
        enableSorting: false,
        meta: { align: "text-left" },
        cell: ({ row }) => {
          const codigo = row.original.usuario.archivos_del_usuario?.[0]?.codigo || "N/A";
          return <span>{codigo}</span>;
        },
      },
      {
        header: "Tamaño",
        id: "tamanio",
        enableSorting: false,
        meta: { align: "text-left" },
        cell: ({ row }) => {
          const peso = row.original.usuario.archivos_del_usuario?.[0]?.peso_arch || "N/A";
          return <span>{peso}</span>;
        },
      },
      {
        header: "Fecha de creación",
        id: "fecha",
        enableSorting: false,
        meta: { align: "text-right" },
        cell: ({ row }) => {
          const rawDate = row.original.usuario.archivos_del_usuario?.[0]?.created_at || "";
          if (!rawDate) return "";
          const dateObj = new Date(rawDate);
          if (isNaN(dateObj.getTime())) return "Fecha inválida";
          const yyyy = dateObj.getFullYear();
          const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
          const dd = String(dateObj.getDate()).padStart(2, "0");
          return `${yyyy}-${mm}-${dd}`;
        },
      },
      {
        header: "Acciones",
        id: "actions",
        meta: { align: "text-right" },
        cell: ({ row }) => {
          const fileRow = row.original;
          return (
            <div className="inline-flex items-center space-x-1">
              {/* Botón Eliminar */}
              <button
                type="button"
                className="inline-flex items-center rounded-md px-2 py-1.5 text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-100"
                onClick={() => handleDelete(fileRow)}
              >
                <IconTrash className="size-4" aria-hidden />
              </button>
              {/* Botón Descargar: se utiliza el componente DownloadDialog */}
              <DownloadDialog fileRow={fileRow} folder={folder} />
            </div>
          );
        },
      },
    ],
    [folder] // Se agrega folder a la dependencia, ya que se utiliza en el DownloadDialog
  );

  // Configuramos la tabla con React Table
  const table = useReactTable({
    data: fileData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 3,
      },
    },
  });

  // Índices para "Showing X - Y of Z"
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const startIndex = pageIndex * pageSize + 1;
  const endIndex = Math.min(startIndex + pageSize - 1, totalRows);

  return (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex flex-col items-start space-y-2">
          <h4 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Archivos
          </h4>
          <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            Lista de archivos de la carpeta
          </p>
        </div>
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-tremor-border dark:border-dark-tremor-border"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHeaderCell
                      key={header.id}
                      className={classNames(header.column.columnDef.meta.align)}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHeaderCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getPaginationRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="group hover:bg-tremor-background-muted hover:dark:bg-dark-tremor-background-muted"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={classNames(cell.column.columnDef.meta.align, "relative")}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Showing{" "}
              <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {startIndex}-{endIndex}
              </span>{" "}
              of{" "}
              <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {totalRows}
              </span>
            </p>
            <div className="inline-flex items-center rounded-lg border border-gray-200 px-1 shadow-sm dark:border-gray-200">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RiArrowLeftSLine className="size-5 text-gray-600 dark:text-gray-300" aria-hidden="true" />
                <span className="sr-only">Previous</span>
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RiArrowRightSLine className="size-5 text-gray-600 dark:text-gray-300" aria-hidden="true" />
                <span className="sr-only">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
