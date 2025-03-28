import React from "react";
// Ajusta la ruta para llegar a Input.jsx y Label.jsx
import { Input } from "../../../../components/ui/Input";
import { Label } from "../../../../components/ui/Label";

export default function InputSearch() {
  return (
    <div className="w-full space-y-2">
      <Input
        placeholder="Search addresses"
        id="search"
        name="search"
        type="search"
        className="w-full mt-2"
      />
    </div>
  );
}
