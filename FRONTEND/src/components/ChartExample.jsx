import React, { useState, Fragment } from "react";
import { AgCharts } from "ag-charts-react";
import clone from "clone";

// Función que devuelve datos de temperatura
function getData() {
    return [
        { month: "January", max: 8, min: 2 },
        { month: "February", max: 10, min: 3 },
        { month: "March", max: 10, min: 4 },
        { month: "April", max: 13, min: 5 },
        { month: "May", max: 18, min: 8 },
        { month: "June", max: 23, min: 12 },
        { month: "July", max: 21, min: 13 },
        { month: "August", max: 21, min: 13 },
        { month: "September", max: 22, min: 13 },
        { month: "October", max: 17, min: 9 },
        { month: "November", max: 11, min: 4 },
        { month: "December", max: 10, min: 5 },
    ];
}

const ChartExample = () => {
    const [options] = useState({
        autoSize: true, // Ajusta automáticamente el tamaño del gráfico
        width: 560, // Aumenta el ancho del gráfico a 800px o más según sea necesario
        height: 250,
        data: getData(),
        series: [
            {
                type: "line",
                xKey: "month",
                xName: "Month",
                yKey: "min",
                yName: "Min User",
                interpolation: { type: "smooth" },
                marker: { enbled: false },
            },
            {
                type: "line",
                xKey: "month",
                xName: "Month",
                yKey: "max",
                yName: "Max User",
                interpolation: { type: "smooth" },
                marker: { enbled: false },
            },
        ],
        axes: [
            {
                type: "category",
                position: "bottom",
                label: {
                    fontSize: 6, // Cambia el tamaño de fuente de los meses a 10px
                },
            },
            {
                type: "number",
                position: "left",
            },
        ],
        legend: {
            enabled: false, // Desactiva el filtrado de series y la barra de desplazamiento
        },
    });

    return (
        <Fragment>
            <div style={{ display: "flex", flexDirection: "column"}}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <h1 style={{ fontWeight: "600", fontSize: "16px", margin: "0" }}>Total Users</h1>
                    <span style={{ color: "#1C1C1C", marginLeft: "10px" }}>Operating Status</span>
                </div>
                <AgCharts options={options} />
            </div>

        </Fragment>
    );
};

export default ChartExample;
