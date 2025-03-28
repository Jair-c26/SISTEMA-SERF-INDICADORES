import React, { useState, useEffect } from 'react';
import RoleCard from './RoleCard';
import CreateRoleCard from './CreateRoleCard';
import rsaSVG from '../../../assets/icons/rsa.svg';
import raSVG from '../../../assets/icons/ra.svg';
import rusSVG from '../../../assets/icons/rus.svg';
import ruSVG from '../../../assets/icons/ru.svg';
import RoleInfoDataGrid from './RoleInfoDataGrid';
import rolesService from '../../../services/api/roles-list/rolesService';

const RoleManagement = () => {
  const [roleData, setRoleData] = useState([]);
  const [dataGridRows, setDataGridRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const response = await rolesService.getAllRoles();
        if (response && response.data) {
          const formattedRoles = response.data.map(role => ({
            id: role.id,
            roles: role.roles,
            descripcion: role.descripcion,
            permisos_id: role.permisos_fk?.id || null,
            permisos_descripcion: getPermissionDescription(role.permisos_fk), // Se genera la descripción
            Icon_Rol: getRoleIcon(role.roles),
          }));
          setRoleData(formattedRoles);
          setDataGridRows(formattedRoles);
        }
      } catch (error) {
        console.error('Error obteniendo los roles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoles();
  }, []);

  // Función para asignar el icono del rol
  const getRoleIcon = (roleName) => {
    switch (roleName) {
      case 'Administrador':
        return rsaSVG;
      case 'Sub Administrador':
        return raSVG;
      case 'Usuario Estadístico':
        return rusSVG;
      case 'Usuario':
        return ruSVG;
      default:
        return ruSVG;
    }
  };

  // Función para generar la descripción de los permisos
  const getPermissionDescription = (permisos) => {
    if (!permisos) return 'Sin permisos asignados';

    const { panel_control, ges_user, ges_areas, configuracion } = permisos;

    if (panel_control && ges_user && ges_areas && configuracion) {
      return 'Acceso total a todas las funciones';
    } else if (panel_control && ges_user) {
      return 'Acceso a gestión de usuarios y panel de control';
    } else if (ges_areas) {
      return 'Acceso a gestión de áreas';
    } else {
      return 'Acceso limitado';
    }
  };

  const handleCardClick = (filteredRoles) => {
    setDataGridRows(filteredRoles);
  };

  const handleDoubleClick = () => {
    setDataGridRows(roleData);
  };

  const handleEdit = (row) => {
    alert(`Editar rol: ${row.roles}`);
  };

  const handleDelete = (id) => {
    alert(`Eliminar rol con ID: ${id}`);
  };

  return (
    <div className="flex flex-col gap-8 w-full font-teko">
      <div className="flex flex-col text-left">
        <h2 className="text-xl font-medium">Roles de Usuario</h2>
        <p className="text-lg text-gray-700">
          Un rol proporciona acceso a menús y funciones predefinidos para que, dependiendo del rol asignado, un administrador pueda tener acceso a lo que el usuario necesita.
        </p>
      </div>

      <div className="flex flex-wrap gap-8 justify-start text-start">
        {roleData.map((role) => (
          <RoleCard
            key={role.id}
            Icon_Rol={role.Icon_Rol}
            Rol_Asignado={role.roles}
            Total_rol={1}
            onClick={() => handleCardClick([role])}
            onDoubleClick={handleDoubleClick}
          />
        ))}
        <CreateRoleCard />
      </div>

      <div className="flex flex-col bg-white p-6 rounded-xl shadow-lg w-full">
        <RoleInfoDataGrid
          rows={dataGridRows}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default RoleManagement;
