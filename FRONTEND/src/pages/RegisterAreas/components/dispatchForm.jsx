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

// Hook para obtener sedes (con dependencias)
import { useListDF } from '../../../hooks/useListDF';

const DispatchForm = ({ formData, onChange, onSelectChange }) => {
  // Obtener todas las sedes y sus dependencias
  const { data: areaList, isLoading, isError } = useListDF();

  // Aplanar dependencias en un array
  const allDependencias = areaList?.flatMap((sede) => sede.dependencias || []) || [];

  /**
   * Cada vez que se seleccione o cambie la dependencia_fk,
   * generamos un nuevo 'cod_despa' con la forma 'cod_depen-ND',
   * donde N es el siguiente índice de despacho + 1.
   */
  useEffect(() => {
    if (formData.dependencia_fk) {
      const selectedDep = allDependencias.find(
        (dep) => dep.id === parseInt(formData.dependencia_fk, 10)
      );
      if (selectedDep) {
        const existingCount = selectedDep.despachos?.length || 0;
        const nextIndex = existingCount + 1;
        const newCode = `${selectedDep.cod_depen}-${nextIndex}D`;
        if (newCode !== (formData.cod_despa || "")) {
          onSelectChange("cod_despa", newCode);
        }
      }
    }
  }, [formData.dependencia_fk, formData.cod_despa, onSelectChange, allDependencias]);

  return (
    <div className="space-y-4">
      {/* Primera fila: nombre_despacho */}
      <div>
        <Label className="text-tremor-default font-medium">
          Nombre despacho <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          name="nombre_despacho"
          value={formData.nombre_despacho || ""}
          onChange={onChange}
          placeholder="Ingresa el nombre del despacho"
          className="mt-2"
        />
      </div>

      {/* Segunda fila: cod_despa, Teléfono y RUC */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-tremor-default font-medium">
            Código despacho <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            name="cod_despa"
            value={formData.cod_despa || ""}
            onChange={onChange}
            placeholder="Se genera automáticamente"
            className="mt-2"
            readOnly
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

      {/* Tercera fila: dependencia_fk (Select) */}
      <div>
        <Label className="text-tremor-default font-medium">
          Dependencia <span className="text-red-500">*</span>
        </Label>

        {isLoading && (
          <p className="text-sm text-gray-500 mt-2">Cargando dependencias...</p>
        )}
        {isError && (
          <p className="text-sm text-red-500 mt-2">Error al cargar dependencias</p>
        )}

        {!isLoading && !isError && (
          <Select
            value={formData.dependencia_fk || ""}
            onValueChange={(val) => onSelectChange("dependencia_fk", val)}
          >
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder="Selecciona la dependencia" />
            </SelectTrigger>
            {/* 
              Añadimos las clases "max-h-60 overflow-y-auto" para que
              el listado sea desplazable si excede 15rem de altura 
            */}
            <SelectContent className="max-h-60 overflow-y-auto">
              {allDependencias.map((dep) => (
                <SelectItem key={dep.id} value={String(dep.id)}>
                  {dep.fiscalia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

export default DispatchForm;
