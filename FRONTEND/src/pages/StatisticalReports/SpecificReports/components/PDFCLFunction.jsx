import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress } from '@mui/material';
import dependencyService from '../../../../services/api/dependency-list/dependencyService';
import reportService from '../../../../services/api/report-list/reportService';

const PDFCLFunction = () => {
    const [formData, setFormData] = useState({ dependencias: '', year: '', month: '' });
    const [dependencias, setDependencias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchDependencias = async () => {
            try {
                const data = await dependencyService.getAllDependencies();
                setDependencias(data?.data || []);
            } catch (error) {
                console.error('Error al cargar las dependencias:', error);
            }
        };
        fetchDependencias();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearchReport = async () => {
        const { dependencias, year, month } = formData;
        if (!dependencias || !year || !month) {
            alert('Por favor, selecciona todos los campos requeridos.');
            return;
        }

        try {
            setLoading(true);
            setShowSpinner(true);
            setPdfUrl('');
            const user = JSON.parse(localStorage.getItem('user'));
            const uuid = user?.uuid;

            if (!uuid) {
                alert('Error: No se pudo obtener el UUID del usuario.');
                return;
            }

            const response = await reportService.getReportByDate(dependencias, month, year, uuid);
            setPdfUrl(response.url); // URL generada por la API
        } catch (error) {
            console.error('Error al obtener el reporte:', error);
            alert('Error al obtener el reporte. Por favor, verifica los datos seleccionados.');
        } finally {
            setLoading(false);
            setShowSpinner(false);
        }
    };

    return (
        <Box className="flex flex-col w-full h-full items-start">
            <Typography variant="h6" component="h2" fontWeight="bold">
                Reportes Estadísticos
            </Typography>
            <Box className="flex flex-row gap-4 mt-4">
                <FormControl fullWidth sx={{ minWidth: 700 }}>
                    <InputLabel id="dependencias-select-label">Dependencias</InputLabel>
                    <Select
                        labelId="dependencias-select-label"
                        id="dependencias-select"
                        name="dependencias"
                        value={formData.dependencias}
                        onChange={handleChange}
                        MenuProps={{
                            PaperProps: { style: { maxHeight: 500, overflow: 'auto' } },
                        }}
                    >
                        {dependencias.map((depen) => (
                            <MenuItem key={depen.id} value={depen.id}>
                                {depen.nombre_fiscalia}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ minWidth: 200 }}>
                    <InputLabel id="year-select-label">Año</InputLabel>
                    <Select
                        labelId="year-select-label"
                        id="year-select"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                    >
                        {[2023, 2024, 2025].map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ minWidth: 200 }}>
                    <InputLabel id="month-select-label">Mes</InputLabel>
                    <Select
                        labelId="month-select-label"
                        id="month-select"
                        name="month"
                        value={formData.month}
                        onChange={handleChange}
                    >
                        {[...Array(12)].map((_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString('es', { month: 'long' })}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                
            </Box>
            
            <iframe src={`/CargaPDF.html?dependencias=${formData.dependencias}&year=${formData.year}&month=${formData.month}`} width="100%" height="1200px" title="HTML Ejemplo"></iframe>
        </Box>
    );
};

export default PDFCLFunction;
