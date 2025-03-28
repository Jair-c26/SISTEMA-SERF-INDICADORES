import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { DataGrid, GridActionsCellItem, GridRowModes } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import CustomFilterUser from '../../../components/UserManagement/CustomFilterUser';
import QuickFilter from '../../../components/DocumentDataGrid/components/QuickFilter';
import userListService from '../../../services/api/user-list/userListService';
import DeleteUser from '../DeleteUser/DeleteUser';
import CustomNoRowsOverlay from '../../../components/CustomNoRowsOverlay/CustomNoRowsOverlay';

export default function UserDataGrid({ columnsConfig = [], title = "Lista de usuarios" }) {
  const [filterModel, setFilterModel] = useState({
    role: '',
    office: '',
    status: '',
    user: '', // Filtro para 'user'
  });

  const [rowModesModel, setRowModesModel] = useState({});
  const [users, setUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await userListService.getAllUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const data = useMemo(() => {
    const columns = [
      { field: 'user', headerName: 'Usuario', flex: 1, sortable: false },
      { field: 'role', headerName: 'Rol', flex: 1, sortable: false },
      { field: 'office', headerName: 'Despacho', flex: 1, sortable: false },
      { field: 'status', headerName: 'Estado', flex: 1, sortable: false },
      {
        field: 'actions',
        headerName: 'Acciones',
        type: 'actions',
        width: 100,
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem 
                key="save" 
                icon={<SaveIcon />} 
                label="Guardar" 
                onClick={handleSaveClick(id)} 
              />,
              <GridActionsCellItem 
                key="cancel" 
                icon={<CancelIcon />} 
                label="Cancelar" 
                onClick={handleCancelClick(id)} 
              />,
            ];
          }

          return [
            <GridActionsCellItem 
              key="edit" 
              icon={<EditIcon />} 
              label="Editar" 
              onClick={handleEditClick(id)} 
            />,
            <GridActionsCellItem 
              key="delete" 
              icon={<DeleteIcon />} 
              label="Eliminar" 
              onClick={handleDeleteClick(id)} 
            />,
          ];
        },
      }
    ];

    const rows = users.map(user => ({
      id: user.id,
      user: `${user.nombre} ${user.apellido}`,
      role: user.roles_fk?.roles || 'Sin rol',
      office: user.despacho_fk || 'Sin despacho',
      status: user.estado === 1 ? 'Activo' : 'Inactivo',
    }));

    return { columns, rows };
  }, [users, rowModesModel]);

  const filteredRows = useMemo(() => {
    return data.rows.filter((row) => {
      return (
        (!filterModel.role || row.role === filterModel.role) &&
        (!filterModel.office || row.office === filterModel.office) &&
        (!filterModel.status || row.status === filterModel.status) &&
        (!filterModel.user || row.user.toLowerCase().includes(filterModel.user.toLowerCase()))
      );
    });
  }, [filterModel, data.rows]);

  const handleFilterChange = useCallback((filters) => {
    setFilterModel(filters);
  }, []);

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    // Aquí puedes agregar la lógica para enviar los cambios al backend
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = users.find((user) => user.id === id);
    if (editedRow?.isNew) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleDeleteClick = (id) => () => {
    const user = users.find((user) => user.id === id);
    if (user) {
      setUserToDelete(user);  // Se guarda el usuario a eliminar
    }
  };

  const handleUserDeleted = (id) => {
    setUsers(prevUsers => prevUsers.filter((user) => user.id !== id)); 
    setUserToDelete(null);
  };

  return (
    <div className="flex flex-col h-full font-teko">
      <div className="mb-2">
        <CustomFilterUser onFilterChange={handleFilterChange} />
      </div>

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex flex-col items-end">
          <QuickFilter
            onChange={(value) => setFilterModel({ ...filterModel, user: value })}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <DataGrid
          rows={filteredRows}
          columns={data.columns}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          disableColumnMenu
          pageSize={5}
          loading={loading}
          slotProps={{
            loadingOverlay: {
              variant: 'skeleton',
              noRowsVariant: 'skeleton',
            },
          }}
          components={{
            NoRowsOverlay: CustomNoRowsOverlay,
          }}
          sx={{
            height: '100%',
            '& .MuiDataGrid-footer': {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1,
            },
          }}
        />
      </div>

      {userToDelete && (
        <DeleteUser
          userId={userToDelete.id}
          onUserDeleted={handleUserDeleted}
        />
      )}
    </div>
  );
}
