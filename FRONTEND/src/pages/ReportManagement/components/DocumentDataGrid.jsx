import React, { useState, useMemo, useCallback } from 'react';
import { DataGrid, GridToolbarFilterButton } from '@mui/x-data-grid';
import { Box, Button, Popover } from '@mui/material';
import QuickFilter from '../../../components/DocumentDataGrid/components/QuickFilter';
import ExportDocument from '../../../components/DocumentDataGrid/components/ExportDocument';
import CustomFilter from '../../../components/DocumentDataGrid/components/CustomFilter';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FileUpload from '../../../components/DocumentDataGrid/components/FileUpload';
const VISIBLE_FIELDS = ['documentName', 'author', 'date', 'status'];
const BUTTON_SIZE = { width: 105, height: 38 };
const ICON_SIZE = { width: 20, height: 20 };

export default function DocumentDataGrid() {
  const [filterModel, setFilterModel] = useState({ field: 'documentName', operator: 'contains', value: '' });
  const [anchorEl, setAnchorEl] = useState(null);

  const data = useMemo(() => ({
    columns: [
      { field: 'id', headerName: 'ID', hide: true },
      { field: 'documentName', headerName: 'Nombre del Documento', flex: 1 },
      { field: 'author', headerName: 'Autor', flex: 1 },
      {
        field: 'date',
        headerName: 'Fecha',
        type: 'date',
        flex: 1,
        valueGetter: ({ row }) => (row?.date ? new Date(row.date) : null),
      },
      { field: 'status', headerName: 'Estado', flex: 1 },
    ],
    rows: [
      { id: 1, documentName: 'Reporte Anual', author: 'Juan Pérez', date: '2025-01-01', status: 'Aprobado' },
      { id: 2, documentName: 'Informe de Ventas', author: 'Ana López', date: '2025-01-02', status: 'Pendiente' },
      { id: 3, documentName: 'Plan Estratégico', author: 'Luis Gómez', date: '2025-01-03', status: 'En revisión' },
    ],
  }), []);

  const columns = useMemo(() => data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)), [data.columns]);

  const filteredRows = useMemo(() => data.rows.filter((row) => {
    const { field, operator, value } = filterModel;
    if (!value) return true;
    const cellValue = row[field]?.toString().toLowerCase() || '';
    const filterValue = value.toLowerCase();

    switch (operator) {
      case 'contains':
        return cellValue.includes(filterValue);
      case 'equals':
        return cellValue === filterValue;
      case 'startsWith':
        return cellValue.startsWith(filterValue);
      default:
        return true;
    }
  }), [filterModel, data.rows]);

  const handleExport = useCallback(() => {
    alert('Exportar datos');
  }, []);

  const handleFilterChange = useCallback((field, operator, value) => {
    setFilterModel({ field, operator, value });
  }, []);

  const handleClickFilterButton = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? 'filter-popover' : undefined;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 1, marginBottom: 2 }}>
        <QuickFilter onChange={(value) => handleFilterChange(filterModel.field, filterModel.operator, value)} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ExportDocument onExport={handleExport} />
          <Button
            variant="contained"
            onClick={handleClickFilterButton}
            sx={{ ...BUTTON_SIZE, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}
            startIcon={<FilterAltIcon sx={ICON_SIZE} />}
          >
            Filtros
          </Button>
          <FileUpload />
        </Box>
      </Box>
      <Popover id={id} open={open} anchorEl={anchorEl} onClose={handleClosePopover} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Box sx={{ padding: 2, minWidth: 300 }}>
          <CustomFilter onFilterChange={handleFilterChange} />
        </Box>
      </Popover>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          disableColumnMenu
          pageSize={5}
          components={{
            Toolbar: () => (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 1 }}>
                <GridToolbarFilterButton />
              </Box>
            ),
          }}
          sx={{
            height: '100%',  // Esto asegura que ocupe el 100% de la altura disponible
            '& .MuiDataGrid-footer': {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1, // Asegura que la paginación esté visible en todo momento
            },
          }}
        />
      </Box>
    </Box>
  );
}
