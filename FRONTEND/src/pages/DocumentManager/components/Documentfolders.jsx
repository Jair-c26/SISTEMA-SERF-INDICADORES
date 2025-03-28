import React, { useState, useEffect } from 'react';
import DocumentCard from './DocumentCard';
import DocumentInformationDataGrid from './DocumentInformationDataGrid';
import folderService from '../../../services/api/folder-list/folderService';
import fileFolderService from '../../../services/api/fileFolder-list/fileFolderService';
import CreateFolder from '../../DocumentManager/components/CreateFolder';

const Documentfolders = () => {
    const [folders, setFolders] = useState([]);
    const [allFiles, setAllFiles] = useState([]);
    const [dataGridRows, setDataGridRows] = useState([]);
    const [loadingFolders, setLoadingFolders] = useState(true);
    const [loadingFiles, setLoadingFiles] = useState(false);

    // Fetch folders on mount
    useEffect(() => {
        const fetchFolders = async () => {
            setLoadingFolders(true);
            try {
                const response = await folderService.getFolder();
                if (response.data && Array.isArray(response.data)) {
                    setFolders(response.data);
                } else {
                    setFolders([]);
                }
            } finally {
                setLoadingFolders(false);
            }
        };
        fetchFolders();
    }, []);

    // Fetch all files on mount (for global view)
    useEffect(() => {
        const fetchFiles = async () => {
            setLoadingFiles(true);
            try {
                const response = await fileFolderService.getFiles();
                // Mapear todos los archivos, incluyendo el código de la carpeta para poder filtrar después
                const allMappedFiles = response.data.flatMap(folder => 
                    folder.archivos.map(file => ({
                        id: file.id,
                        folderCode: folder.codigo_carp,  // Se agrega el código de la carpeta
                        nombre_carp: folder.nombre_carp,
                        file_name: file.nombre,
                        file_type: file.tipo_arch,
                        created_at: new Date(file.created_at).toLocaleDateString(),
                    }))
                );
                setAllFiles(allMappedFiles);
                setDataGridRows(allMappedFiles);
            } catch (error) {
                console.error('Error al obtener los archivos:', error);
            } finally {
                setLoadingFiles(false);
            }
        };
        fetchFiles();
    }, []);

    // Handle folder click: filtrar los archivos globales según el código de la carpeta
    const handleCardClick = (folderCode) => {
        // Se filtran los archivos del estado global 'allFiles'
        const filteredFiles = allFiles.filter(file => file.folderCode === folderCode);
        setDataGridRows(filteredFiles);
    };

    return (
        <div className="flex flex-col gap-3 text-start font-teko">
            <h2 className="text-xl font-medium">Mis Documentos</h2>

            <div className="flex flex-wrap gap-3 justify-start">
                {folders.map((folder) => (
                    <DocumentCard
                        key={folder.codigo_carp}
                        file_name={folder.nombre_carp}
                        file_code={folder.codigo_carp}
                        file_quantity={folder.cant_archivos}
                        onClick={() => handleCardClick(folder.codigo_carp)}
                    />
                ))}
                <CreateFolder />
            </div>

            <div className="flex rounded-xl bg-white p-4 shadow-lg">
                <DocumentInformationDataGrid
                    rows={dataGridRows}
                    loading={loadingFiles}
                    columns={[
                        { field: 'id', headerName: 'ID', width: 90 },
                        { field: 'file_name', headerName: 'File Name', flex: 1 },
                        { field: 'file_type', headerName: 'File Type', flex: 1 },
                        { field: 'created_at', headerName: 'Creation Date', flex: 1 }
                    ]}
                />
            </div>
        </div>
    );
};

export default Documentfolders;
