import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';

const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...'; // Agrega "..." al final si el texto es largo
    }
    return text;
};

const CHIColumnChart = ({ data, categories }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Truncamos las categorías para que no sean demasiado largas
    const truncatedCategories = categories.map(category => truncateText(category, 14));

    const handleBarClick = (event, chartContext, config) => {
        const index = config.dataPointIndex;  // Obtiene el índice de la barra seleccionada
        setSelectedCategory(categories[index]);  // Muestra la categoría completa
    };

    const chartOptions = {
        chart: {
            type: 'bar',
            height: 250,
            toolbar: {
                show: false,  // Deshabilita la barra de herramientas (incluye zoom, panning, etc.)
            },
            events: {
                dataPointSelection: handleBarClick,  // Se llama a la función cuando se selecciona una barra
            },
        },
        plotOptions: {
            bar: {
                columnWidth: '45%',
                distributed: true,
            },
        },
        xaxis: {
            categories: truncatedCategories, // Usamos las categorías truncadas
            labels: {
                style: {
                    fontSize: '12px', // Tamaño de fuente para las etiquetas
                },
                rotate: 0, // Rota las categorías para que quepan mejor
            },
            tickPlacement: 'on',
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false, // Esto oculta la leyenda
        },
    };

    const chartSeries = [
        {
            data: data,
        },
    ];

    return (
        <div>
            <ReactApexChart 
                options={chartOptions} 
                series={chartSeries} 
                type="bar" 
                height={250} 
            />
            {selectedCategory && (
                <div className="mt-4 p-4 border border-gray-300 rounded">
                    <h3 className="font-semibold">Categoría Seleccionada:</h3>
                    <p>{selectedCategory}</p>
                </div>
            )}
        </div>
    );
};

CHIColumnChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.number).isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CHIColumnChart;
