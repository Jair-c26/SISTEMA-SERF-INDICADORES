import React, { useMemo, useState, useEffect } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import QuickFilter from '../../../components/DocumentDataGrid/components/QuickFilter';
import ExportDocument from '../../../components/DocumentDataGrid/components/ExportDocument';
import FileUpload from '../../../components/DocumentDataGrid/components/FileUpload';

export default function DocumentInformationDataGrid({ rows, loading }) {
    const [displayedRows, setDisplayedRows] = useState(rows);
    const CustomNoRowsOverlay = () => (
        <div className="flex items-center justify-center h-full">
            No se encontraron documentos
        </div>
    );
    useEffect(() => {
        setDisplayedRows(rows);
    }, [rows]);

    const handleEdit = (row) => {
        alert(`Editar documento: ${row.documentName}`);
    };

    const handleDelete = (id) => {
        alert(`Eliminar documento con ID: ${id}`);
    };

    const handleFilterChange = (value) => {
        const filteredRows = rows.filter((row) =>
            String(row.file_name).toLowerCase().includes(String(value).toLowerCase())
        );
        setDisplayedRows(filteredRows);
    };

    const handleExport = () => {
        console.log('Exportar documentos');
    };

    const columns = useMemo(() => [
        { field: 'id', headerName: 'ID', hide: true, sortable: false },
        { field: 'file_name', headerName: 'File Name', flex: 1, sortable: false },
        { field: 'file_type', headerName: 'File Type', flex: 1, sortable: false },
        {
            field: 'created_at',
            headerName: 'Creation Date',
            type: 'date',
            flex: 1,
            valueGetter: ({ row }) => (row?.created_at ? new Date(row.created_at) : null),
            sortable: false
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 150,
            getActions: ({ row }) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Editar"
                    onClick={() => handleEdit(row)}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Eliminar"
                    onClick={() => handleDelete(row.id)}
                />,
            ],
        },
    ], []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%'}}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <QuickFilter onChange={(value) => handleFilterChange(value)} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <ExportDocument onExport={handleExport} />
                    <FileUpload />
                </Box>
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <DataGrid
                    rows={displayedRows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableColumnFilter
                    disableColumnSelector
                    disableDensitySelector
                    disableColumnMenu
                    loading={loading}
                components={{
                    NoRowsOverlay: CustomNoRowsOverlay,
                }}
                slotProps={{
                    loadingOverlay: {
                        variant: 'skeleton',
                        noRowsVariant: 'skeleton',
                    },
                }}
                sx={{
                    '& .MuiDataGrid-skeletonContainer': {
                        backgroundColor: '#f5f5f5',
                    },
                    '& .MuiDataGrid-skeletonCell': {
                        backgroundColor: '#e0e0e0',
                    }
                }}
                />
            </Box>
        </Box>
    );
}
