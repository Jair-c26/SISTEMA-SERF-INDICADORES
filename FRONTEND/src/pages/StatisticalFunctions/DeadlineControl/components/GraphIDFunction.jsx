import React from 'react';
import ReactApexChart from 'react-apexcharts';

const GraphIDFunction = ({ data, categories, chartTitle }) => {
    // Definimos el estado con los valores por defecto.
    const [state, setState] = React.useState({
        series: [{
            data: data || [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380] // Datos por defecto si no se pasan props
        }],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: false, // Ocultamos la barra de herramientas del gráfico
                },
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    borderRadiusApplication: 'end',
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: false // Deshabilitamos las etiquetas de los datos
            },
            xaxis: {
                categories: categories || ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],
            },
            title: {
                text: chartTitle || 'Gráfico de barras', // Título del gráfico
                align: 'center',
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#152B52',
                },
            },
            tooltip: {
                enabled: true, // Habilitamos los tooltips
                shared: true,
                intersect: false,
            },
        }
    });

    return (
        <div className="graph-container">
            {/* Título del gráfico */}
            <h2 className="graph-title">{state.options.title.text}</h2>

            {/* Gráfico ApexCharts */}
            <div id="chart">
                <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
            </div>
        </div>
    );
};

export default GraphIDFunction;
