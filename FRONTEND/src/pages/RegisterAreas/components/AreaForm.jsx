import React, { useState } from "react";
import { Divider } from "../../../components/ui/Divider";
import { Button } from "../../../components/ui/Button";

// Formularios específicos para cada tipo de área
import HeadquartersForm from "./headquartersForm";
import DependencyForm from "./dependencyForm";
import DispatchForm from "./dispatchForm";

export default function AreaForm({ areaType, onSubmit, onCancel }) {
  // Estado local para almacenar los datos del formulario
  const [formData, setFormData] = useState({});

  // Maneja cambios en inputs de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Maneja cambios en componentes <Select> (u otros casos especiales)
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Envía los datos al padre al hacer clic en “Guardar”
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    // Aquí podrías añadir validaciones extra antes de llamar onSubmit
  };

  // Renderiza un formulario diferente según el tipo de área
  const renderFormByType = () => {
    switch (areaType) {
      case "Administracion sede":
        return (
          <HeadquartersForm
            formData={formData}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
          />
        );
      case "Administracion dependencia":
        return (
          <DependencyForm
            formData={formData}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
          />
        );
      case "Administracion despacho":
        return (
          <DispatchForm
            formData={formData}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form className="pt-5" onSubmit={handleSubmit} noValidate>
      {renderFormByType()}
      <Divider className="my-5" />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Guardar
        </Button>
      </div>
    </form>
  );
}
