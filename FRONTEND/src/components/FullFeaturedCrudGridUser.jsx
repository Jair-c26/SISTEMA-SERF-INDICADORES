import React, { useState, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    DataGrid,
    GridActionsCellItem,
    GridRowModes,
    GridRowEditStopReasons,
    GridToolbarContainer,
} from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';

const initialRows = [
    { id: randomId(), name: 'David Wagner', createDate: '24 Oct, 2015', role: 'Super Admin' },
    { id: randomId(), name: 'David Wagner', createDate: '24 Oct, 2015', role: 'Super Admin' },
    { id: randomId(), name: 'David Wagner', createDate: '24 Oct, 2015', role: 'Super Admin' },
    { id: randomId(), name: 'David Wagner', createDate: '24 Oct, 2015', role: 'Super Admin' },
    { id: randomId(), name: 'David Wagner', createDate: '24 Oct, 2015', role: 'Super Admin' },
];

const EditToolbar = ({ setRows, setRowModesModel }) => {
    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [...oldRows, { id, name: '', createDate: '', role: '', isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
        </GridToolbarContainer>
    );
};

const FullFeaturedCrudGridUser = () => {
    const [rows, setRows] = useState(initialRows);
    const [rowModesModel, setRowModesModel] = useState({});

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        { field: 'name', headerName: 'Name', width: 120, editable: true },
        { field: 'createDate', headerName: 'Create Date', width: 120, editable: true },
        { field: 'role', headerName: 'Role', width: 120, editable: true },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Action',
            flex: 1,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem icon={<SaveIcon />} label="Save" sx={{ color: 'primary.main' }} onClick={handleSaveClick(id)} />,
                        <GridActionsCellItem icon={<CancelIcon />} label="Cancel" className="textPrimary" onClick={handleCancelClick(id)} color="inherit" />,
                    ];
                }

                return [
                    <GridActionsCellItem icon={<EditIcon />} label="Edit" className="textPrimary" onClick={handleEditClick(id)} color="inherit" />,
                    <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} color="inherit" />,
                ];
            },
        },
    ];

    return (
        <Box sx={{ height: '100%', width: 470, backgroundColor: 'white', borderRadius: 4, '& .actions': { color: 'text.secondary' }, '& .textPrimary': { color: 'text.primary' } }}>
            <div style={{ display: "flex", flexDirection: "column"}}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", marginLeft: "20px", paddingTop: "20px", paddingBottom: "16px" }}>
                        <h1 style={{ fontWeight: "600", fontSize: "16px", margin: "0" }}>Total Users</h1>
                    </div>  
                </div>
                <DataGrid
                    sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', borderTopLeftRadius: '0px', borderTopRightRadius: '0px', '& .MuiDataGrid-columnHeaderTitle': { fontWeight: '600' }, }}
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slotProps={{ toolbar: { setRows, setRowModesModel } }}
                />
            </div>

        </Box>
    );
};

export default FullFeaturedCrudGridUser;
