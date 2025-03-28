import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import ArticleIcon from '@mui/icons-material/Article';
import {
    DataGrid,
    GridActionsCellItem,
    GridRowModes,
    GridRowEditStopReasons,
    GridToolbarContainer,
} from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';

const initialRows = [
    { id: randomId(), icon: <ArticleIcon />, nameDoc: 'Lorem ipsum', context: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.' },
    { id: randomId(), icon: <ArticleIcon />, nameDoc: 'Lorem ipsum', context: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.' },
    { id: randomId(), icon: <ArticleIcon />, nameDoc: 'Lorem ipsum', context: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.' },
    { id: randomId(), icon: <ArticleIcon />, nameDoc: 'Lorem ipsum', context: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.' },
    { id: randomId(), icon: <ArticleIcon />, nameDoc: 'Lorem ipsum', context: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.' },
];

const EditToolbar = ({ setRows, setRowModesModel }) => {
    const handleClick = () => {
        const id = randomId();
        const today = new Date().toLocaleDateString('en-CA'); // Formato YYYY-MM-DD
        setRows((oldRows) => [
            ...oldRows, 
            { id, icon: <ArticleIcon />, nameDoc: '', context: '', createdAt: today, isNew: true }
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'nameDoc' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add Document
            </Button>
        </GridToolbarContainer>
    );
};



const FullFeaturedCrudGridDocuments = () => {
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
        { field: 'icon', headerName: '', width: 50, sortable: false, renderCell: (params) => <ArticleIcon /> },
        { field: 'nameDoc', headerName: 'Name Doc', width: 100, editable: true},
        { field: 'context', headerName: 'Context', width: 500, editable: true },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
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
        <Box sx={{ height: '100%', width: 780, backgroundColor: 'white', borderRadius: 3, '& .actions': { color: 'text.secondary' }, '& .textPrimary': { color: 'text.primary' } }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", marginLeft: "20px", paddingTop: "20px", paddingBottom: "16px" }}>
                        <h1 style={{ fontWeight: "600", fontSize: "16px", margin: "0" }}>Total Documents</h1>
                        <span style={{ color: "#1C1C1C", marginLeft: "10px" }}>Operating Status</span>
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

export default FullFeaturedCrudGridDocuments;
