import React, { useMemo, useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow
} from '@tremor/react';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { Button } from '../../../components/ui/Button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '../../../components/ui/Dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose
} from '../../../components/ui/Drawer';
import { Input } from '../../../components/ui/Input';
import OptionalAlert from '../../../components/alert/OptionalAlert';
import AreaForm from './AreaForm';

// Formularios para edición
import HeadquartersForm from './headquartersForm';
import DependencyForm from './dependencyForm';
import DispatchForm from './dispatchForm';

// IMPORTAR SERVICIOS (Ajusta rutas según tu estructura)
import sedeService from '../../../services/api/sede-list/sedeService';
import dependencyService from '../../../services/api/dependency-list/dependencyService';
import dispatchesService from '../../../services/api/dispatches-list/dispatchesService';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Badge para el estado del área
function StatusBadge({ status }) {
  let colorClasses = "";
  switch (status) {
    case "Activo":
      colorClasses = "bg-green-100 text-green-700";
      break;
    case "Inactivo":
      colorClasses = "bg-red-100 text-red-700";
      break;
    default:
      colorClasses = "bg-yellow-100 text-yellow-700";
      break;
  }
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ${colorClasses}`}
    >
      {status}
    </span>
  );
}

export default function AreaListContent({ title, tableData }) {

  const [localTableData, setLocalTableData] = useState(tableData);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    setLocalTableData(tableData);
  }, [tableData]);

  const filteredData = useMemo(() => {
    if (!searchText) return localTableData;

    const lowerSearch = searchText.toLowerCase();

    if (title === "Administracion sede") {
      return localTableData.filter((item) =>
        (item.combinedName || "").toLowerCase().includes(lowerSearch) ||
        (item.ruc || "").toLowerCase().includes(lowerSearch)
      );
    } else if (title === "Administracion dependencia") {
      return localTableData.filter((item) =>
        (item.combinedFiscalia || "").toLowerCase().includes(lowerSearch) ||
        (item.tipo_fiscalia || "").toLowerCase().includes(lowerSearch) ||
        (item.ruc || "").toLowerCase().includes(lowerSearch)
      );
    } else if (title === "Administracion despacho") {
      return localTableData.filter((item) =>
        (item.combinedDespacho || "").toLowerCase().includes(lowerSearch) ||
        (item.ruc || "").toLowerCase().includes(lowerSearch)
      );
    }

    return localTableData;
  }, [searchText, localTableData, title]);

  // (columns definition remains the same)

  // handleCreateArea remains the same

  // Drawer states remain the sam

  const columns = useMemo(() => {
    if (title === "Administracion sede") {
      return [
        {
          header: "Sede",
          accessorKey: "combinedName",
          meta: { align: "text-left" },
        },
        {
          header: "RUC",
          accessorKey: "ruc",
          meta: { align: "text-left" },
        },
        {
          header: "Activo",
          accessorKey: "activo",
          meta: { align: "text-left" },
        },
        {
          header: "Código Postal",
          accessorKey: "codigo_postal",
          meta: { align: "text-left" },
        },
        {
          header: "Regional",
          accessorKey: "regional_fk",
          meta: { align: "text-left" },
        },
        {
          header: "Acciones",
          id: "acciones",
          meta: { align: "text-right" },
          cell: ({ row }) => {
            const rowData = row.original;
            return (
              <div className="inline-flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedArea(rowData);
                    setIsDrawerOpen(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    OptionalAlert({
                      title: "¿Estás seguro?",
                      text: "Esta acción no se puede revertir.",
                      onConfirm: async () => {
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                        setLocalTableData((prev) =>
                          prev.filter((item) => item.id !== rowData.id)
                        );
                      },
                    });
                  }}
                >
                  Eliminar
                </Button>
              </div>
            );
          },
        },
      ];
    } else if (title === "Administracion dependencia") {
      return [
        {
          header: "Fiscalía",
          accessorKey: "combinedFiscalia",
          meta: { align: "text-left" },
        },
        {
          header: "Tipo de Fiscalía",
          accessorKey: "tipo_fiscalia",
          meta: { align: "text-left" },
        },
        {
          header: "Sede",
          accessorKey: "sede_fk",
          meta: { align: "text-left" },
        },
        {
          header: "RUC",
          accessorKey: "ruc",
          meta: { align: "text-left" },
        },
        {
          header: "Activo",
          accessorKey: "activo",
          meta: { align: "text-left" },
        },
        {
          header: "Acciones",
          id: "acciones",
          meta: { align: "text-right" },
          cell: ({ row }) => {
            const rowData = row.original;
            return (
              <div className="inline-flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedArea(rowData);
                    setIsDrawerOpen(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    OptionalAlert({
                      title: "¿Estás seguro?",
                      text: "Esta acción no se puede revertir.",
                      onConfirm: async () => {
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                        setLocalTableData((prev) =>
                          prev.filter((item) => item.id !== rowData.id)
                        );
                      },
                    });
                  }}
                >
                  Eliminar
                </Button>
              </div>
            );
          },
        },
      ];
    } else if (title === "Administracion despacho") {
      return [
        {
          header: "Despacho",
          accessorKey: "combinedDespacho",
          meta: { align: "text-left" },
        },
        {
          header: "Dependencia",
          accessorKey: "dependencia_fk",
          meta: { align: "text-left" },
        },
        {
          header: "Activo",
          accessorKey: "activo",
          meta: { align: "text-left" },
        },
        {
          header: "RUC",
          accessorKey: "ruc",
          meta: { align: "text-left" },
        },
        {
          header: "Acciones",
          id: "acciones",
          meta: { align: "text-right" },
          cell: ({ row }) => {
            const rowData = row.original;
            return (
              <div className="inline-flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedArea(rowData);
                    setIsDrawerOpen(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    OptionalAlert({
                      title: "¿Estás seguro?",
                      text: "Esta acción no se puede revertir.",
                      onConfirm: async () => {
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                        setLocalTableData((prev) =>
                          prev.filter((item) => item.id !== rowData.id)
                        );
                      },
                    });
                  }}
                >
                  Eliminar
                </Button>
              </div>
            );
          },
        },
      ];
    }
    return [];
  }, [title, localTableData]);

  // Maneja la creación de un nuevo área
  const handleCreateArea = async (formData) => {
    try {
      let newArea;
      if (title === "Administracion sede") {
        newArea = await sedeService.createSede(formData);
      } else if (title === "Administracion dependencia") {
        newArea = await dependencyService.createDependency(formData);
      } else if (title === "Administracion despacho") {
        newArea = await dispatchesService.createDispatch(formData);
      }
      // Actualiza la tabla local (opcional)
      setLocalTableData((prev) => [...prev, newArea]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error al crear área:", error);
      // Aquí podrías mostrar un toast o alerta de error
    }
  };

  // Estados para el Drawer, diálogo de edición y área seleccionada
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  const table = useReactTable({
    
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  const totalRows = table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const startIndex = pageIndex * pageSize + 1;
  const endIndex = Math.min(startIndex + pageSize - 1, totalRows);

  // Renderiza el formulario de edición mediante el componente correspondiente
  const renderEditForm = () => {
    switch (title) {
      case "Administracion sede":
        return <HeadquartersForm selectedArea={selectedArea} />;
      case "Administracion dependencia":
        return <DependencyForm selectedArea={selectedArea} />;
      case "Administracion despacho":
        return <DispatchForm selectedArea={selectedArea} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="flex gap-4 items-center justify-between mb-4">
        <Input
          placeholder="Search addresses"
          id="search"
          name="search"
          type="search"
          className="flex-1 max-w-[400px]"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* Diálogo para crear nueva área */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-fit">Nueva área</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nueva área</DialogTitle>
              <DialogDescription>
                Completa los campos para agregar una nueva área.
              </DialogDescription>
            </DialogHeader>
            {/* Llamamos a AreaForm, pasando onSubmit para crear el área */}
            <AreaForm
              areaType={title}
              onCancel={() => setIsDialogOpen(false)}
              onSubmit={handleCreateArea}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b border-gray-200">
              {headerGroup.headers.map((header) => (
                <TableHeaderCell
                  key={header.id}
                  className={classNames(
                    header.column.columnDef.meta.align,
                    "font-semibold text-sm text-gray-600"
                  )}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHeaderCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getPaginationRowModel().rows.map((row) => (
            <TableRow key={row.id} className="group hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={classNames(
                    cell.column.columnDef.meta.align,
                    "relative text-sm text-gray-600"
                  )}
                >
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
          Mostrando{" "}
          <span className="font-medium text-gray-800">
            {startIndex}-{endIndex}
          </span>{" "}
          de{" "}
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

      {/* Drawer para editar área */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Editar Área</DrawerTitle>
            <DrawerDescription>
              Modifica los datos del área seleccionada.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            {!selectedArea ? (
              <p className="text-sm text-gray-500">
                No se ha seleccionado ninguna área.
              </p>
            ) : (
              <div className="space-y-6">{renderEditForm()}</div>
            )}
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200">
                Cancelar
              </Button>
            </DrawerClose>
            <Button
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              onClick={() => setIsDrawerOpen(false)}
            >
              Guardar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
