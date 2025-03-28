import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import areasService from "../../../services/api/areas-list/AreasService";

const UserDispatch = ({ profileData, isEditing }) => {
  const [areas, setAreas] = useState([]);
  const [selectedSede, setSelectedSede] = useState("");
  const [selectedDependencia, setSelectedDependencia] = useState("");
  const [selectedDespacho, setSelectedDespacho] = useState("");

  const [dependencias, setDependencias] = useState([]);
  const [despachos, setDespachos] = useState([]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await areasService.getAllAreas();
        setAreas(response.data);
      } catch (error) {
        console.error("Error al cargar las áreas:", error);
      }
    };
    fetchAreas();
  }, []);

  // Preselección con profileData
  useEffect(() => {
    if (
      profileData &&
      profileData.area &&
      profileData.area.dependencia_fk &&
      profileData.area.dependencia_fk.sede_fk
    ) {
      setSelectedSede(profileData.area.dependencia_fk.sede_fk.id);
      setSelectedDependencia(profileData.area.dependencia_fk.id);
      setSelectedDespacho(profileData.area.id);
    }
  }, [profileData]);

  useEffect(() => {
    if (areas.length && selectedSede) {
      const area = areas.find((a) => a.id === selectedSede);
      setDependencias(area ? area.dependencias : []);
      if (!selectedDependencia) {
        setDespachos([]);
        setSelectedDespacho("");
      }
    }
  }, [areas, selectedSede, selectedDependencia]);

  useEffect(() => {
    if (dependencias.length && selectedDependencia) {
      const dependencia = dependencias.find((d) => d.id === selectedDependencia);
      setDespachos(dependencia ? dependencia.despachos : []);
      if (!selectedDespacho) {
        setSelectedDespacho("");
      }
    }
  }, [dependencias, selectedDependencia, selectedDespacho]);

  const handleSedeChange = (event) => {
    const sedeId = event.target.value;
    setSelectedSede(sedeId);
    setSelectedDependencia("");
    setDespachos([]);
    setSelectedDespacho("");
  };

  const handleDependenciaChange = (event) => {
    const dependenciaId = event.target.value;
    setSelectedDependencia(dependenciaId);
    setSelectedDespacho("");
  };

  const handleDespachoChange = (event) => {
    setSelectedDespacho(event.target.value);
  };

  const handleGuardar = () => {
    console.log("Sede:", selectedSede);
    console.log("Dependencia:", selectedDependencia);
    console.log("Despacho:", selectedDespacho);
  };

  return (
    <div className="flex flex-col w-full pt-8 gap-8 bg-white font-teko font-normal">
      <div className="flex flex-col w-full gap-6 px-5">
        <div className="flex gap-6 w-full">
          <div className="flex flex-col w-full gap-4 text-start">
            {/* Campo Sede */}
            <div className="flex gap-4 items-center">
              <label className="text-lg w-36">Sede:</label>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel id="sede-label">Sede</InputLabel>
                <Select
                  labelId="sede-label"
                  id="sede-select"
                  value={areas.length ? selectedSede : ""}
                  label="Sede"
                  onChange={handleSedeChange}
                  disabled={!isEditing}
                >
                  {areas.map((area) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Campo Dependencia */}
            <div className="flex gap-4 items-center">
              <label className="text-lg w-36">Dependencia:</label>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel id="dependencia-label">Dependencia</InputLabel>
                <Select
                  labelId="dependencia-label"
                  id="dependencia-select"
                  value={dependencias.length ? selectedDependencia : ""}
                  label="Dependencia"
                  onChange={handleDependenciaChange}
                  disabled={!isEditing || !dependencias.length}
                >
                  {dependencias.map((dep) => (
                    <MenuItem key={dep.id} value={dep.id}>
                      {dep.fiscalia || dep.nombre_fiscalia}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Campo Despacho */}
            <div className="flex gap-4 items-center">
              <label className="text-lg w-36">Despacho:</label>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel id="despacho-label">Despacho</InputLabel>
                <Select
                  labelId="despacho-label"
                  id="despacho-select"
                  value={despachos.length ? selectedDespacho : ""}
                  label="Despacho"
                  onChange={handleDespachoChange}
                  disabled={!isEditing || !despachos.length}
                >
                  {despachos.map((despacho) => (
                    <MenuItem key={despacho.id} value={despacho.id}>
                      {despacho.nombre_despacho}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDispatch;
