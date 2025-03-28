import React, { useState, useMemo, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { GridRowModes, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import QuickFilter from '../DocumentDataGrid/components/QuickFilter';
import OptionalAlert from '../../components/alert/OptionalAlert';

const BUTTON_SIZE = { width: 105, height: 38 };
const ICON_SIZE = { width: 20, height: 20 };

export default function RegisterAreasDataGrid({
  columnsConfig = [],
  title = "Default Title",
  rows = [],
  loading,
  onDeleteRow,
  onEditRow,  // Nueva prop para editar
}) {
  const [filterModel, setFilterModel] = useState({ field: '', operator: 'contains', value: '' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [rowModesModel, setRowModesModel] = useState({});

  const data = useMemo(() => {
    // Se agrega la columna de acciones si no existe.
    const columns = columnsConfig.some(col => col.field === 'actions')
      ? columnsConfig
      : [
          ...columnsConfig,
          {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 100,
            getActions: (params) => {
              const { id, row } = params;
              return [
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  onClick={() => onEditRow(row)}  // Se invoca el callback pasando la fila completa
                  key="edit"
                />,
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Delete"
                  onClick={() => handleDeleteClick(id)}
                  key="delete"
                />,
              ];
            },
          },
        ];

    return {
      columns,
      rows: rows || [],
    };
  }, [columnsConfig, rows, onEditRow]);

  const filteredRows = useMemo(() => {
    if (!Array.isArray(data.rows)) return [];
    return data.rows.filter((row) => {
      const { operator, value } = filterModel;
      if (!value) return true;
      return data.columns.some((col) => {
        const cellValue = row[col.field]?.toString().toLowerCase() || '';
        return operator === 'contains' && cellValue.includes(value.toLowerCase());
      });
    });
  }, [data.rows, filterModel, data.columns]);

  const handleFilterChange = useCallback((value) => {
    setFilterModel({ field: 'any', operator: 'contains', value });
  }, []);

  const handleClickFilterButton = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleDeleteClick = (id) => {
    OptionalAlert({
      title: "Confirmación de eliminación",
      text: "¿Estás seguro de que deseas eliminar?",
      onConfirm: async () => {
        try {
          await onDeleteRow?.(id);
        } catch (error) {
          throw new Error(error.message || 'Ocurrió un error inesperado al intentar eliminar.');
        }
      },
    });
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? 'filter-popover' : undefined;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="semibold" fontFamily={'Teko, sans-serif'}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <QuickFilter onChange={handleFilterChange} />
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <DataGrid
          rows={filteredRows}
          columns={data.columns}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          disableColumnMenu
          pageSize={5}
          loading={loading} // Se pasa la propiedad loading a DataGrid
          slotProps={{
            loadingOverlay: {
              variant: 'skeleton',
              noRowsVariant: 'skeleton',
            },
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
      </Box>
    </Box>
  );
}
