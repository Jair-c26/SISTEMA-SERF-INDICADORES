import React, { useEffect } from 'react';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from '../../../components/dashboard/Select';

// Importamos el Switch (asegúrate de la ruta correcta)
import { Switch } from '../../../components/ui/Switch';

// Importamos el hook para obtener la lista de áreas
import { useListDF } from '../../../hooks/useListDF';

/**
 * Genera iniciales a partir de un texto.
 * Ej: "FISCALIA SUPERIOR PENAL DE MADRE DE DIOS" => "FSPMDD"
 */
function getInitialsFromName(name = "") {
  const words = name.split(" ").filter(Boolean);
  return words.map((w) => w[0].toUpperCase()).join("");
}

const DependencyForm = ({ formData, onChange, onSelectChange }) => {
  // Obtenemos la lista de sedes (áreas) desde el servidor
  const { data: areaList, isLoading, isError } = useListDF();

  // Cada vez que cambie "fiscalia", recalculamos "cod_depen" a partir de las iniciales
  useEffect(() => {
    const newCode = getInitialsFromName(formData.fiscalia || "");
    if (newCode !== (formData.cod_depen || "")) {
      onSelectChange("cod_depen", newCode);
    }
  }, [formData.fiscalia, formData.cod_depen, onSelectChange]);

  return (
    <div className="space-y-4">
      {/* Primera fila: fiscalia */}
      <div>
        <Label className="text-tremor-default font-medium">
          Fiscalía <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          name="fiscalia"         // El servidor espera "fiscalia"
          value={formData.fiscalia || ""}
          onChange={onChange}
          placeholder="Ingresa la fiscalía"
          className="mt-2"
        />
      </div>

      {/* Segunda fila: tipo_fiscalia y nombre_fiscalia */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-tremor-default font-medium">
            Tipo de fiscalía <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            name="tipo_fiscalia"   // El servidor espera "tipo_fiscalia"
            value={formData.tipo_fiscalia || ""}
            onChange={onChange}
            placeholder="Ingresa el tipo de fiscalía"
            className="mt-2"
          />
        </div>
        <div>
          <Label className="text-tremor-default font-medium">
            Nombre fiscalía <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            name="nombre_fiscalia" // El servidor espera "nombre_fiscalia"
            value={formData.nombre_fiscalia || ""}
            onChange={onChange}
            placeholder="Ingresa el nombre de la fiscalía"
            className="mt-2"
          />
        </div>
      </div>

      {/* Tercera fila: ruc y telefono */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-tremor-default font-medium">
            RUC <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            name="ruc"
            value={formData.ruc || ""}
            onChange={onChange}
            placeholder="Ingresa el RUC"
            className="mt-2"
          />
        </div>
        <div>
          <Label className="text-tremor-default font-medium">
            Teléfono <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            name="telefono"
            value={formData.telefono || ""}
            onChange={onChange}
            placeholder="Ingresa el teléfono"
            className="mt-2"
          />
        </div>
      </div>

      {/* Cuarta fila: sede_fk (Select) */}
      <div>
        <Label className="text-tremor-default font-medium">
          Sede <span className="text-red-500">*</span>
        </Label>

        {isLoading && (
          <p className="text-sm text-gray-500 mt-2">Cargando sedes...</p>
        )}
        {isError && (
          <p className="text-sm text-red-500 mt-2">Error al cargar sedes</p>
        )}

        {/* Solo renderiza el Select cuando no hay error ni está cargando */}
        {!isLoading && !isError && (
          <Select
            value={formData.sede_fk || ""}
            onValueChange={(val) => onSelectChange("sede_fk", val)}
          >
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder="Selecciona la sede" />
            </SelectTrigger>
            <SelectContent>
              {areaList?.map((sede) => (
                <SelectItem key={sede.id} value={String(sede.id)}>
                  {sede.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Quinta fila: Switches para opciones (orden vertical) */}
      <div className="space-y-4 mt-4">
        {/* Switch para Habilitar carga laboral */}
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.carga === 1}
            onCheckedChange={(checked) =>
              onSelectChange("carga", checked ? 1 : 0)
            }
          />
          <Label className="text-tremor-default font-medium">
            Habilitar carga laboral
          </Label>
        </div>
        {/* Switch para Habilitar control plazos */}
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.plazo === 1}
            onCheckedChange={(checked) =>
              onSelectChange("plazo", checked ? 1 : 0)
            }
          />
          <Label className="text-tremor-default font-medium">
            Habilitar control plazos
          </Label>
        </div>
        {/* Switch para Habilitar Incidencia delitos */}
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.delitos === 1}
            onCheckedChange={(checked) =>
              onSelectChange("delitos", checked ? 1 : 0)
            }
          />
          <Label className="text-tremor-default font-medium">
            Habilitar Incidencia delitos
          </Label>
        </div>
      </div>
    </div>
  );
};

export default DependencyForm;
