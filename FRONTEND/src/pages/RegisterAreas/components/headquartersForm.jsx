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

import { useListRegion } from '../../../hooks/useListRegion';

/**
 * Genera iniciales a partir de un nombre.
 * Ej: "SEDE DE LORETO" => "SL"
 */
function getInitialsFromName(name = "") {
  const words = name.split(" ").filter(Boolean);
  return words.map((w) => w[0].toUpperCase()).join("");
}

const HeadquartersForm = ({ formData, onChange, onSelectChange }) => {
  const { data: regionList, isLoading, isError } = useListRegion();

  // Genera cod_sede a partir de "nombre"
  useEffect(() => {
    const newCode = getInitialsFromName(formData.nombre || "");
    if (newCode !== (formData.cod_sede || "")) {
      onSelectChange("cod_sede", newCode);
    }
  }, [formData.nombre, formData.cod_sede, onSelectChange]);

  return (
    <div className="space-y-4">
      {/* Primera fila: Nombre sede */}
      <div>
        {/* Aunque el label diga "Nombre sede", el name debe ser "nombre" */}
        <Label className="text-tremor-default font-medium">
          Nombre sede <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          name="nombre"  // El servidor espera "nombre"
          value={formData.nombre || ""}
          onChange={onChange}
          placeholder="Ingresa el nombre de la sede"
          className="mt-2"
        />
      </div>

      {/* Segunda fila: Teléfono y RUC */}
      <div className="grid grid-cols-2 gap-4">
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
      </div>

      {/* Tercera fila: Provincia, Distrito_fiscal y Region */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-tremor-default font-medium">
            Provincia <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            name="provincia"
            value={formData.provincia || ""}
            onChange={onChange}
            placeholder="Ingresa la provincia"
            className="mt-2"
          />
        </div>
        <div>
          <Label className="text-tremor-default font-medium">
            Distrito fiscal <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            name="distrito_fiscal" // El servidor espera "distrito_fiscal"
            value={formData.distrito_fiscal || ""}
            onChange={onChange}
            placeholder="Ingresa el distrito fiscal"
            className="mt-2"
          />
        </div>
        <div>
          <Label className="text-tremor-default font-medium">
            Región <span className="text-red-500">*</span>
          </Label>

          {isLoading && (
            <p className="text-sm text-gray-500 mt-2">Cargando regiones...</p>
          )}
          {isError && (
            <p className="text-sm text-red-500 mt-2">Error al cargar regiones</p>
          )}
          {!isLoading && !isError && (
            <Select
              value={formData.regional_fk || ""}
              onValueChange={(val) => onSelectChange("regional_fk", val)}
            >
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Selecciona la región" />
              </SelectTrigger>
              <SelectContent>
                {regionList?.map((region) => (
                  <SelectItem key={region.id} value={String(region.id)}>
                    {region.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Cuarta fila: Código postal */}
      <div>
        <Label className="text-tremor-default font-medium">
          Código postal <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          name="codigo_postal" // El servidor espera "codigo_postal"
          value={formData.codigo_postal || ""}
          onChange={onChange}
          placeholder="Ingresa el código postal"
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default HeadquartersForm;
