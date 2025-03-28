import React, { useEffect, useState } from 'react';
import OptionListCard from '../../../../components/OptionListCard/OptionListCard';
import sedeSVG from '../../../../assets/icons/sede.svg';
import Box from '@mui/material/Box';
import rolesService from '../../../../services/api/roles-list/rolesService';
import { useAuth } from '../../../../context/AuthContext';

const RoleInformation = () => {
  const { userFormData, setUserFormData } = useAuth();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await rolesService.getAllRoles();
        const formattedRoles = response.data.map(role => ({
          text: role.roles,
          value: role.id,
        }));
        setRoles(formattedRoles);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleRoleChange = (value) => {
    setUserFormData({ ...userFormData, roles_fk: value }); // Actualizado para almacenar en roles_fk
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <OptionListCard
        icon={sedeSVG}
        primaryText="SELECCIONE ROL"
        secondaryText="VISTA GENERAL"
        checkboxItems={roles}
        necessaryValue="11"
        onChange={handleRoleChange}
      />
    </Box>
  );
};

export default RoleInformation;
