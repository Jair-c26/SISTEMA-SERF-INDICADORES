// FilterHeaderDataTax.jsx
import React, { useState } from "react";
import { format } from "date-fns";
import { Input } from "../../../../../components/ui/Input";
import { DateRangePicker } from "../../../../../components/ui/DatePicker";
import { Button } from "../../../../../components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../../../../../components/ui/Dialog";
import { IconFileUpload, IconFileTypePdf } from "@tabler/icons-react";
import { useListDF } from "../../../../../hooks/useListDF";
import { useToast } from "../../../../../lib/useToast";
import { generatePdfFromMultipleElements } from "../../../TaxDetails/components/ViewPDF/pdfUtils";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "../../../../../components/dashboard/Select";
// Importar useAuth para obtener el usuario
import { useAuth } from "../../../../../context/AuthContext";
// Importar el hook para fiscales
import { useListTaxUser } from "../../../../../hooks/useListTaxUser";

const SelectSearch = ({ placeholder, options, onChange }) => {
    const [searchText, setSearchText] = useState("");
    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(searchText.toLowerCase())
    );
    return (
        <div className="w-80">
            <Select
                onValueChange={(val) => {
                    setSearchText("");
                    onChange?.(val);
                }}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                    <div className="px-2 py-1">
                        <Input
                            placeholder="Buscar..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                    {filteredOptions.map((option) => (
                        <SelectItem key={option.value} value={String(option.value)}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default function FilterHeaderDataTax({
    containerIds = [],
    useCargaHook,
}) {
    const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false); // Opcional, si se usa PDF
    const [pdfUrl, setPdfUrl] = useState(null); // Opcional, si se usa PDF
    const [isSearching, setIsSearching] = useState(false);
    const { toast, dismiss } = useToast();

    // Obtener sedes para reporte fiscal
    const { data: sedes = [] } = useListDF();
    // Obtener fiscales
    const { data: fiscalesData = [] } = useListTaxUser();
    // Obtener usuario
    const { user } = useAuth();

    // Filtrado de sedes basado en despacho_fk del usuario:
    // Si el usuario tiene asignado un despacho (user.despacho_fk), se filtran
    // para dejar únicamente la sede que contenga una dependencia cuyo id sea igual a
    // user.despacho_fk.dependencia_fk y que, en dicha dependencia, exista un despacho
    // cuyo id sea igual a user.despacho_fk.id.
    let filteredSedes = sedes;
    if (user && user.despacho_fk) {
        const despachoId = Number(user.despacho_fk.id);
        const dependenciaId = Number(user.despacho_fk.dependencia_fk);
        filteredSedes = sedes.filter((sede) =>
            (sede.dependencias || []).some((depen) =>
                Number(depen.id) === dependenciaId &&
                (depen.despachos || []).some(
                    (desp) => Number(desp.id) === despachoId
                )
            )
        );
    }

    const sedeOptions = filteredSedes.map((sede) => ({
        label: sede.nombre,
        value: sede.nombre,
    }));

    const [selectedSedeName, setSelectedSedeName] = useState("");
    const [selectedDepValue, setSelectedDepValue] = useState("");
    const [selectedFiscalId, setSelectedFiscalId] = useState("");
    const [dateRange, setDateRange] = useState(null);

    // Buscar el objeto sede seleccionado de las sedes filtradas
    const selectedSedeObj = filteredSedes.find(
        (sede) => sede.nombre === selectedSedeName
    );

    // Opciones para dependencia a partir de la sede seleccionada
    const dependenciaOptions = selectedSedeObj
        ? selectedSedeObj.dependencias
            .filter((dep) => {
                if (user && user.despacho_fk) {
                    const dependenciaId = Number(user.despacho_fk.dependencia_fk);
                    const despachoId = Number(user.despacho_fk.id);
                    return (
                        Number(dep.id) === dependenciaId &&
                        (dep.despachos || []).some(
                            (desp) => Number(desp.id) === despachoId
                        )
                    );
                }
                return true;
            })
            .map((dep) => ({
                label: dep.fiscalia,
                value: dep.id,
            }))
        : [];

    // Opciones para fiscales:
    // Se filtran los fiscales para mostrar solo aquellos cuyo "dependencias_fk"
    // coincida con el id de la dependencia seleccionada (si existe)
    const fiscalOptions = fiscalesData
        .filter((fiscal) => {
            if (!selectedDepValue) return true;
            let depIdFromFiscal = null;
            if (fiscal.dependencia && fiscal.dependencia.id) {
                depIdFromFiscal = Number(fiscal.dependencia.id);
            } else if (fiscal.dependencias_fk) {
                depIdFromFiscal = Number(fiscal.dependencias_fk);
            }
            return depIdFromFiscal === Number(selectedDepValue);
        })
        .map((fiscal) => ({
            label: fiscal.nombres_f,
            value: fiscal.id,
        }));


    // Actualización de parámetros para useCargaHook:
    // Se envían: id_fiscal, id_dependencia, fe_inicio, fe_fin, estado (siempre null)
    const { refetch } = useCargaHook(
        {
            id_fiscal: selectedFiscalId ? Number(selectedFiscalId) : null,
            id_dependencia: selectedDepValue ? Number(selectedDepValue) : null,
            fe_inicio: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd 00:00:00") : null,
            fe_fin: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd 23:59:59") : null,
            estado: null,
        },
        { enabled: false }
    );

    const handlePrintClick = async () => {
        const loadingToast = toast({
            variant: "loading",
            title: "Generando PDF",
            description: "Espere mientras se generan las páginas...",
        });

        try {
            const url = await generatePdfFromMultipleElements(containerIds);
            setPdfUrl(url);
            setIsPdfDialogOpen(true);
            dismiss(loadingToast.id);
        } catch (error) {
            dismiss(loadingToast.id);
            console.error("Error generando PDF:", error);
            toast({
                variant: "error",
                title: "Error generando PDF",
                description: "Ocurrió un error al generar el PDF.",
            });
        }
    };

    const handleBuscar = async () => {
        if (!selectedSedeName) {
            toast({
                variant: "warning",
                title: "Falta seleccionar sede",
                description: "Por favor, seleccione una sede antes de buscar.",
            });
            return;
        }
        if (!selectedDepValue) {
            toast({
                variant: "warning",
                title: "Falta seleccionar dependencia",
                description: "Por favor, seleccione una dependencia antes de buscar.",
            });
            return;
        }
        if (!selectedFiscalId) {
            toast({
                variant: "warning",
                title: "Falta seleccionar fiscal",
                description: "Por favor, seleccione un fiscal antes de buscar.",
            });
            return;
        }
        if (!dateRange?.from || !dateRange?.to) {
            toast({
                variant: "warning",
                title: "Falta seleccionar rango de fecha",
                description: "Por favor, seleccione un rango de fechas antes de buscar.",
            });
            return;
        }

        setIsSearching(true);
        const loadingToast = toast({
            variant: "loading",
            title: "Cargando",
            description: "Realizando la búsqueda...",
        });

        try {
            await refetch();
            dismiss(loadingToast.id);
            toast({
                variant: "success",
                title: "Búsqueda exitosa",
                description: "La información se actualizó correctamente.",
            });
        } catch (error) {
            dismiss(loadingToast.id);
            toast({
                variant: "error",
                title: "Error en la búsqueda",
                description: "Ocurrió un error al actualizar la información.",
            });
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="space-y-2">
            <h3 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                REPORTE GENERAL DE FISCALES
            </h3>
            <p>Se genera el reporte general filtrado por fiscal y dependencia.</p>

            <div className="block md:flex md:items-center md:justify-between">
                <div className="flex items-center w-full gap-2">
                    <SelectSearch
                        placeholder="Seleccione sede..."
                        options={sedeOptions}
                        onChange={(val) => {
                            setSelectedSedeName(val);
                            setSelectedDepValue("");
                            setSelectedFiscalId("");
                        }}
                    />
                    <SelectSearch
                        placeholder="Seleccione dependencia..."
                        options={dependenciaOptions}
                        onChange={(val) => {
                            setSelectedDepValue(val);
                            setSelectedFiscalId("");
                        }}
                    />
                    <SelectSearch
                        placeholder="Seleccione fiscal..."
                        options={fiscalOptions}
                        onChange={(val) => setSelectedFiscalId(val)}
                    />
                    <div className="lg:flex lg:items-center lg:space-x-3">
                        <DateRangePicker
                            enableYearNavigation
                            disableNavigation={false}
                            value={dateRange}
                            onChange={setDateRange}
                            id="date_1"
                            name="date_1"
                            className="border-tremor-border dark:border-dark-tremor-border"
                        />
                    </div>
                    <Button
                        variant="secondary"
                        className="rounded-tremor-small py-1.5 px-3 font-medium"
                        onClick={handleBuscar}
                        disabled={isSearching}
                    >
                        Buscar..
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        className="flex items-center justify-center gap-x-1 rounded-tremor-small py-1.5 px-3 font-medium"
                        disabled={isSearching}
                    >
                        <IconFileUpload
                            className="size-5 shrink-0 text-tremor-content dark:text-dark-tremor-content"
                            aria-hidden
                        />
                        Exportar
                    </Button>
                    <Button
                        variant="secondary"
                        className="flex items-center justify-center gap-x-1 rounded-tremor-small py-1.5 px-3 font-medium"
                        onClick={handlePrintClick}
                        disabled={isSearching}
                    >
                        <IconFileTypePdf
                            className="size-5 shrink-0 text-tremor-content dark:text-dark-tremor-content"
                            aria-hidden
                        />
                        Imprimir
                    </Button>
                </div>
            </div>

            {/* Dialog para previsualizar PDF (si se utiliza) */}
            <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Vista Previa PDF</DialogTitle>
                        <DialogDescription>
                            Revisa el contenido antes de imprimir o descargar.
                        </DialogDescription>
                    </DialogHeader>
                    {pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            title="Previsualización PDF"
                            style={{ width: "100%", height: "80vh" }}
                        />
                    ) : (
                        <p>Cargando PDF...</p>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
