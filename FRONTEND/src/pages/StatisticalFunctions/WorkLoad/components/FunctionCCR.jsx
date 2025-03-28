import { Padding } from '@mui/icons-material';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const FunctionCCR = ({ categories, casosResultosData, casosIngresadosData }) => {

    // Define las series como una constante
    const series = [
        {
            name: "RESUELTO HISTORICO",
            data: casosResultosData
        },
        {
            name: "CASOS INGRESADOS",
            data: casosIngresadosData
        }
    ];

    // Define las opciones para el gráfico
    const options = {
        chart: {
            height: 350,
            type: 'line',
            dropShadow: { enabled: true, color: '#000', top: 18, left: 7, blur: 10, opacity: 0.2 },
            zoom: { enabled: false },
            toolbar: { show: false },
            background: '#fff',
        },
        colors: ['#4782C4', '#283692'],
        dataLabels: { enabled: true },
        stroke: { curve: 'smooth' },
        title: {
            text: 'CANTIDAD DE CASOS RESULTOS E INGRESADOS POR FISCALES',
            align: 'center',
            style: { fontSize: '16px', fontWeight: 'bold', fontFamily: 'Inter', color: '#11263C' }
        },
        grid: {
            borderColor: '#e7e7e7',
            row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
        },
        markers: { size: 1 },
        xaxis: {
            categories: categories,
            labels: {
                style: { fontSize: '9px' },
                formatter: function(value) {
                    // Comprobamos si 'value' es una cadena válida antes de intentar obtener su longitud
                    if (value && typeof value === 'string') {
                        // Truncar los nombres largos a un tamaño fijo (por ejemplo, 15 caracteres)
                        if (value.length > 15) {
                            return value.substring(0, 15) + '...'; // Muestra los primeros 15 caracteres seguido de "..."
                        }
                        return value; // Si el nombre es corto, no se modifica
                    }
                    return ''; // Si el valor no es válido, devolvemos una cadena vacía
                }
            },
            title: { text: '' },
        },
        yaxis: {
            title: { text: '' },
            min: 0,
            max: 150
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -10,
            offsetX: -5
        }
    };

    return (
        <ReactApexChart 
            options={options} 
            series={series} 
            type="line" 
            height={400} 
            width={1000} 
        />
    );
};

export default FunctionCCR;
