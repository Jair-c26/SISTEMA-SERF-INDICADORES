import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Box, Typography } from '@mui/material';
import FunctionHeaderWL from './components/FunctionHeaderWL';
import FunctionCCR from './components/FunctionCCR';
import FunctionCaseCard from './components/FunctionCaseCard';
import FunctionPCC from './components/FunctionPCC';
import FunctionPFM from './components/FunctionPFM';
import TotalDataFunction from './components/TotalDataFunction';
import { useLocation } from 'react-router-dom';

const WorkLoad = () => {
    const { workloadData } = useAuth();

    if (!workloadData) return <div>No hay datos disponibles.</div>;

    const { nombre_fiscalia, grafico_linea, cantidad_casos, porcentajes_circulo, productividad_fiscal, despachos } = workloadData;

    const totalData = [];
    if (Array.isArray(despachos)) {
        despachos.forEach(despacho => {
            if (Array.isArray(despacho.fiscales)) {
                despacho.fiscales.forEach(fiscal => {
                    if (Array.isArray(fiscal.carga)) {
                        fiscal.carga.forEach(carga => {
                            totalData.push({
                                nombres_f: fiscal.nombres_f,
                                tramitesHistoricos: carga.tramitesHistoricos || 0,
                                resulHistorico: carga.resulHistorico || 0,
                                tramites: carga.tramites || 0,
                                resultado: carga.resultado || 0,
                                ingreso: carga.ingreso || 0,
                            });
                        });
                    }
                });
            }
        });
    }

    return (
        <Box className="flex flex-col gap-4 pt-3 mt-0 px-3 w-full h-full">
            {/* Header */}
            <Box className="flex flex-col md:flex-row gap-4 w-full justify-between">
                <FunctionHeaderWL
                    nombre_funcion="CARGA LABORAL"
                    fecha_registro="01 DE AGOSTO AL 31 DE AGOSTO DEL 2024"
                    nombre_dependencia={nombre_fiscalia}
                />
            </Box>

            {/* Graficos y Tarjetas */}
            <Box className="flex flex-col md:flex-row gap-4 w-full">
                <Box className="flex-1 flex justify-start items-center gap-4 border border-gray-300 shadow-lg rounded-lg bg-white p-4">
                    <FunctionCCR
                        categories={Array.isArray(grafico_linea) ? grafico_linea.map(fiscal => fiscal.nombre) : []}
                        casosResultosData={Array.isArray(grafico_linea) ? grafico_linea.map(fiscal => fiscal.carga?.[0]?.resulHistorico || 0) : []}
                        casosIngresadosData={Array.isArray(grafico_linea) ? grafico_linea.map(fiscal => fiscal.carga?.[0]?.ingreso || 0) : []}
                    />
                </Box>

                <Box className="flex-1 flex flex-col gap-4">
                    <Box className="flex flex-wrap justify-between gap-4">
                        <FunctionCaseCard number={cantidad_casos?.total_resueltos_historicos || 0} description="Total Resueltos Históricos" />
                        <FunctionCaseCard number={cantidad_casos?.total_ingresados || 0} description="Total Ingresados" />
                        <FunctionCaseCard number={cantidad_casos?.total_tramites_historicos || 0} description="Total Trámites Históricos" />
                    </Box>

                    <Box className="flex flex-col items-center justify-center w-full h-full bg-white border border-gray-300 shadow-lg rounded-lg p-4">
                        <Typography variant="h6" className="font-bold text-center text-primary mb-4">
                            PORCENTAJE DE LA CANTIDAD DE CASOS EN TRÁMITE POR FISCALES
                        </Typography>
                        <Box className="w-full h-full flex items-center justify-center">
                            <FunctionPCC
                                nombre_fiscal={Array.isArray(porcentajes_circulo) ? porcentajes_circulo.map(fiscal => fiscal.nombre || 'Desconocido') : []}
                                valor={Array.isArray(porcentajes_circulo) ? porcentajes_circulo.map(fiscal => fiscal.porcentaje_tramites || 0) : []}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Productividad y Totales */}
            <Box className="flex flex-col md:flex-row gap-4 w-full">
                <Box className="flex flex-col gap-2 flex-1">
                    {productividad_fiscal &&
                        Object.keys(productividad_fiscal).map((key, index) => {
                            const despacho = productividad_fiscal[key];
                            return (
                                <Box key={`despacho-${index}`} className="flex flex-col justify-center items-center gap-4">
                                    <Box className="flex h-full w-full bg-white border border-gray-300 shadow-lg rounded-lg p-4">
                                        <FunctionPFM
                                            nombre_fiscal={Array.isArray(despacho.fiscales) ? despacho.fiscales.map(fiscal => fiscal.nombre) : []}
                                            valor={Array.isArray(despacho.fiscales) ? despacho.fiscales.map(fiscal => fiscal.productividad) : []}
                                            nombre_despacho={despacho.nombre_despacho || `Despacho ${index + 1}`}
                                        />
                                    </Box>
                                </Box>
                            );
                        })}
                </Box>

                <Box className="flex-1 border border-gray-300 shadow-lg rounded-lg">
                    <TotalDataFunction data={totalData} />
                </Box>
            </Box>
        </Box>
    );
};

export default WorkLoad;
