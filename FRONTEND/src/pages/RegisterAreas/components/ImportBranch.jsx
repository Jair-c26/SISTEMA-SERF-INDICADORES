import React, { useState, useCallback, useRef } from 'react';
import excelSVG from '../../../assets/icons/excel.svg';
import * as XLSX from 'xlsx';
import ImportAreasService from '../../../services/api/exportAreas-list/ImportAreasService';

const FilePreviewTable = ({ data }) => (
    <div className="mt-3 max-h-[600px] max-w-[1200px] overflow-y-auto overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full border-collapse table-auto">
            <thead>
                <tr>
                    {data[0].map((cell, index) => (
                        <th
                            key={index}
                            className="p-2 border border-gray-300 text-center whitespace-nowrap"
                        >
                            {cell}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {data[0].map((_, cellIndex) => (
                            <td
                                key={cellIndex}
                                className="p-2 border border-gray-300 text-center whitespace-nowrap"
                            >
                                {row[cellIndex] || ''}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const ImportBranch = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreviewData, setFilePreviewData] = useState(null);
    const [responseMessage, setResponseMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Ref para el input de archivo
    const fileInputRef = useRef(null);

    const handleFileUpload = useCallback((event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.match(/\.(xls|xlsx)$/)) {
            setResponseMessage({ type: 'error', text: 'Formato de archivo no válido.' });
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                if (!jsonData.length || !jsonData[0].length) {
                    setResponseMessage({ type: 'error', text: 'El archivo está vacío o mal formateado.' });
                    setFilePreviewData(null);
                    return;
                }

                setFilePreviewData(jsonData);
            } catch (error) {
                setResponseMessage({ type: 'error', text: 'Error al procesar el archivo.' });
                setFilePreviewData(null);
            }
        };
        reader.readAsArrayBuffer(file);
    }, []);

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFilePreviewData(null);
        setResponseMessage(null);
        // Reiniciamos el valor del input de archivo
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSave = async () => {
        if (!selectedFile) {
            setResponseMessage({ type: 'error', text: 'Por favor, selecciona un archivo.' });
            return;
        }

        setLoading(true);
        setResponseMessage(null);

        try {
            // Se utiliza el nuevo servicio ImportAreasService y su método exportAreas
            const response = await ImportAreasService.exportAreas(selectedFile);
            setResponseMessage({ type: 'success', text: response.message || 'Archivo importado con éxito.' });
        } catch (error) {
            setResponseMessage({ type: 'error', text: error.response?.data?.message || 'Error al importar áreas.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 px-0 py-4 w-full max-w-[1900px]">
            <div className="flex flex-col bg-white rounded-2xl gap-6 text-start p-5 shadow-lg w-full">
                <h6 className="font-teko text-lg font-medium text-primary">
                    IMPORTAR AREAS
                </h6>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full">
                    <label className="flex flex-col items-center justify-center border rounded-xl bg-gray-100 hover:bg-gray-200 p-4 w-40 h-40 cursor-pointer">
                        <img src={excelSVG} alt="Excel Icon" className="w-12 h-12" />
                        <p className="font-teko text-base font-semibold mt-2">Subir archivo</p>
                        {/* Se asigna el ref al input */}
                        <input 
                            type="file" 
                            accept=".xls,.xlsx" 
                            hidden 
                            onChange={handleFileUpload} 
                            ref={fileInputRef} 
                        />
                    </label>
                    {selectedFile && (
                        <div className="flex flex-col items-center mt-2">
                            <p className="text-sm">{selectedFile.name}</p>
                            <button
                                className="text-sm text-red-500"
                                onClick={handleRemoveFile}
                            >
                                Eliminar archivo
                            </button>
                        </div>
                    )}
                </div>
                {filePreviewData && <FilePreviewTable data={filePreviewData} />}
                {responseMessage && (
                    <div className={`mt-2 p-4 rounded-lg ${responseMessage.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {responseMessage.text}
                    </div>
                )}
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        className="w-32 p-2 border border-gray-300 rounded-lg text-gray-700"
                        onClick={handleRemoveFile}
                    >
                        Cancelar
                    </button>
                    <button
                        className="w-32 p-2 bg-blue-500 text-white rounded-lg"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? 'Subiendo...' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportBranch;
