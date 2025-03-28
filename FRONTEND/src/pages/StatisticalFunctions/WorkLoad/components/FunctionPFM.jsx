// src/FunctionPFM.jsx
import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

const FunctionPFM = ({ nombre_fiscal, valor, nombre_despacho }) => {
    const seriesBar = useMemo(() => [
        {
            data: valor || []
        }
    ], [valor]);

    const optionsBar = useMemo(() => ({
        chart: { type: 'bar', height: 120, toolbar: { show: false } },
        yaxis: { title: { text: 'FISCAL', style: { fontSize: '10px', color: '#E4E4E4', fontWeight: '600', fontFamily: 'Inter' } } },
        plotOptions: { bar: { horizontal: true, dataLabels: { position: 'top' } } },
        dataLabels: { enabled: true, style: { fontSize: '10px', fontWeight: 'bold', fontFamily: 'Inter' } },
        colors: ['#152B52'],
        xaxis: { categories: nombre_fiscal || [], labels: { style: { fontSize: '10px', fontWeight: '600' } } },
        title: { text: `PRODUCTIVIDAD FISCAL POR METAS - ${nombre_despacho || 'PRIMER DESPACHO'}`, align: 'center', style: { fontSize: '13px', fontWeight: 'bold', fontFamily: 'Inter', color: '#11263C' } }
    }), [nombre_fiscal, nombre_despacho]);

    return <ReactApexChart options={optionsBar} series={seriesBar} type="bar" height={140} width={550} />;
};


export default FunctionPFM;
