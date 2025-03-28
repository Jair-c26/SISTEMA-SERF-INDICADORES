import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { Box, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FunctionHeaderCHI from './components/FunctionHeaderCHI';
import CHIColumnChart from './components/CHIColumnChart';
import CHIDoughnutChart from './components/CHIDoughnutChart';
import TaxInformationTable from './components/TaxInformationTable';
import FunctionCLD from './components/FunctionCLD';
import FunctionRCD from './components/FunctionRCD';
import FunctionCCD from './components/FunctionCCD';
import crimesIncidenceService from '../../../services/api/crimesIncidence-list/crimesIncidenceService';


// Define tu tema
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h4: {
            fontWeight: 'bold',
        },
    },
});

const CrimesHighestIncidence = () => {
    const { dependencyId } = useAuth();

    console.log('valor ID:', dependencyId);

    // Estado para almacenar los porcentajes, ranking y datos de la fiscalía
    const [nombreFiscalia, setNombreFiscalia] = useState('');
    const [porcentajes, setPorcentajes] = useState([]);
    const [doughnutCategories, setDoughnutCategories] = useState([]);
    const [ranking, setRanking] = useState([]);
    const [taxData, setTaxData] = useState([]); // Estado para los datos de la tabla
    const [grafLinealData, setGrafLinealData] = useState({
        categories: [],
        cantidadmes1: [],
        cantidadmes2: []
    });

    useEffect(() => {
        // Parámetros para la API
        const crimeId = 3;
        const month = 9;
        const year = 2024;

        // Realizar la petición GET usando el servicio
        crimesIncidenceService.getCrimeIncidence(dependencyId, month, year)
            .then(response => {
                // Obtener los datos de los porcentajes y ranking
                const porcentajeData = response.data.porcentaje;
                const rankingData = response.data.ranking;
                const dependenciaData = response.data.dependencia;
                const delitosMes1Data = response.data.delitos_mes1;
                const grafLineal = response.data.graf_lineal || [];

                // Extraer los valores y los nombres de los delitos
                const porcentajes = porcentajeData.map(item => item.porcentaje);
                const doughnutCategoriesData = porcentajeData.map(item => item.delito);
                setPorcentajes(porcentajes);
                setDoughnutCategories(doughnutCategoriesData);

                // Extraer los valores para el ranking (nombres de delitos y cantidades)
                const ranking = rankingData.map(item => ({
                    x: item.delito,
                    y: item.cantidad,
                }));
                setRanking(ranking);

                // Datos de la fiscalía
                const taxData = [{
                    nombre_fiscalia: dependenciaData.nombre_fiscalia,  // Solo hay una fiscalía en el objeto
                    delitos: delitosMes1Data.map(delito => ({
                        delito: delito.delito,
                        cantidad: delito.cantidad,
                    })),
                }];
                setTaxData(taxData);
                setNombreFiscalia(dependenciaData.nombre_fiscalia);

                // Datos para FunctionCLD y FunctionRCD (graf_lineal)
                if (grafLineal && Array.isArray(grafLineal)) {
                    const categories = grafLineal.map(item => item.delito);
                    const cantidadmes1 = grafLineal.map(item => item.cantidad_mes1);
                    const cantidadmes2 = grafLineal.map(item => item.cantidad_mes2);
                    setGrafLinealData({ categories, cantidadmes1, cantidadmes2 });
                }
            })
            .catch(error => {
                console.error("Hubo un error al obtener los datos del API:", error);
            });
    }, []); // El arreglo vacío asegura que esto solo se ejecute una vez, al montar el componente


    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    width: '100%',
                    height: '100%',
                    padding: 2,
                }}
            >
                {/* Cabecera */}
                <FunctionHeaderCHI nombre_fiscalia={nombreFiscalia} />

                {/* Primer bloque */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                >
                    {/* Primera fila */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 3,
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                padding: 2,
                                backgroundColor: '#fff',
                                borderRadius: '5px',
                                borderColor: '#fff',
                                alignItems: 'center',
                                boxShadow: 3, // Sombra añadida
                            }}
                        >
                            <Typography variant="body1" style={{ fontWeight: '600', fontSize: '18px' }} className="text-lg font-bold text-[#152B52]">
                                PORCENTAJE DE LOS 5 DELITOS MÁS FRECUENTES
                            </Typography>
                            <CHIDoughnutChart
                                data={porcentajes}
                                categories={doughnutCategories}
                            />
                        </Box>
                        <Box
                            sx={{
                                flex: 1,
                                padding: 2,
                                backgroundColor: '#fff',
                                borderColor: '#fff',
                                borderRadius: '8px',
                                boxShadow: 3, // Sombra añadida
                            }}
                        >
                            <Typography variant="body1" style={{ fontWeight: '600', fontSize: '18px' }} className="text-lg font-bold text-[#152B52]">
                                RANKING DE LOS 5 DELITOS MÁS FRECUENTES
                            </Typography>
                            <CHIColumnChart
                                data={ranking.map(item => item.y)} // Valores de las cantidades
                                categories={ranking.map(item => item.x)} // Nombres de los delitos
                            />
                        </Box>
                    </Box>

                    {/* Segunda fila */}
                    <Box
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            flex: 1,
                            boxShadow: 3, // Sombra añadida
                        }}
                    >
                        <TaxInformationTable data={taxData} />
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    width: '100%',
                    height: '100%',
                    padding: 2,
                }}
            >
                {/* Segundo bloque */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                >
                    {/* Primera fila */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 3,
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                padding: 2,
                                backgroundColor: '#fff',
                                borderRadius: '5px',
                                borderColor: '#fff',
                                alignItems: 'center',
                                boxShadow: 3, // Sombra añadida
                            }}
                        >
                            <Typography variant="body1" style={{ fontWeight: '600', fontSize: '18px' }} className="text-lg font-bold pb-4 text-[#152B52] mb-4">
                                COMPARACIÓN LINEAL DE LOS 5 DELITOS MÁS FRECUENTES
                            </Typography>
                            {/* Aquí se implementa el componente FunctionCLD */}
                            {grafLinealData.categories.length > 0 && grafLinealData.cantidadmes1.length > 0 && grafLinealData.cantidadmes2.length > 0 && (
                                <FunctionCLD
                                    categories={grafLinealData.categories}  // Delitos
                                    cantidadmes1={grafLinealData.cantidadmes1}  // Datos mes1
                                    cantidadmes2={grafLinealData.cantidadmes2}  // Datos mes2
                                />
                            )}
                        </Box>
                        <Box
                            sx={{
                                flex: 1,
                                padding: 2,
                                backgroundColor: '#fff',
                                borderColor: '#fff',
                                borderRadius: '8px',
                                boxShadow: 3, // Sombra añadida
                            }}
                        >
                            <Typography variant="body1" style={{ fontWeight: '600', fontSize: '18px' }} className="text-lg font-bold text-[#152B52]">
                                RANKING COMPARATIVO DE LOS 5 DELITOS MÁS FRECUENTES
                            </Typography>
                            {/* Aquí se pasa el mismo estado de datos para el gráfico de barras */}
                            {grafLinealData.categories.length > 0 && grafLinealData.cantidadmes1.length > 0 && grafLinealData.cantidadmes2.length > 0 && (
                                <FunctionRCD
                                    data={grafLinealData.categories.map((delito, index) => ({
                                        x: delito,
                                        y1: grafLinealData.cantidadmes1[index], // Casos mes1
                                        y2: grafLinealData.cantidadmes2[index], // Casos mes2
                                    }))}
                                />
                            )}


                        </Box>
                    </Box>

                    {/* Segunda fila */}
                    <Box
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            flex: 1,
                            boxShadow: 3, // Sombra añadida
                        }}
                    >
                        <Typography variant="body1" style={{ fontWeight: '600', fontSize: '18px' }} className="text-lg font-bold pt-4 text-[#152B52]">
                            CUADRO COMPARATIVO DE LOS 5 DELITOS MÁS FRECUENTES
                        </Typography>
                        {grafLinealData.categories.length > 0 && (
                            <FunctionCCD
                                data={grafLinealData.categories.map((delito, index) => ({
                                    delito,
                                    cantidad_mes1: grafLinealData.cantidadmes1[index],
                                    cantidad_mes2: grafLinealData.cantidadmes2[index],
                                }))}
                            />
                        )}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default CrimesHighestIncidence;
