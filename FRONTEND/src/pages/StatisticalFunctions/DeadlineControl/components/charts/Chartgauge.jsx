// ChartGauge.jsx
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
// Si necesitas compatibilidad con navegadores antiguos, podrías importar ResizeObserver:
// import ResizeObserver from 'resize-observer-polyfill';

/**
 * Componente Gauge dinámico
 * @param {number} value - Valor a mostrar en la aguja (por defecto 70)
 * @param {number} progressWidth - Grosor del "progreso" (por defecto 18)
 * @param {number} axisLineWidth - Grosor de la línea del eje (por defecto 18)
 * @param {number} splitLineLength - Longitud de las líneas de división (por defecto 15)
 * @param {number} splitLineWidth - Grosor de las líneas de división (por defecto 2)
 * @param {string} splitLineColor - Color de las líneas de división (por defecto "#999")
 * @param {number} axisLabelDistance - Distancia de las etiquetas del eje (por defecto 25)
 * @param {string} axisLabelColor - Color de las etiquetas del eje (por defecto "#999")
 * @param {number} axisLabelFontSize - Tamaño de fuente de las etiquetas del eje (por defecto 20)
 * @param {number} anchorSize - Tamaño del "ancla" (por defecto 25)
 * @param {number} anchorBorderWidth - Grosor del borde del ancla (por defecto 10)
 * @param {number} detailFontSize - Tamaño de fuente del detalle (por defecto 80)
 * @param {Array} detailOffsetCenter - Offset para posicionar el valor (por defecto [0, '70%'])
 */
export default function ChartGauge({
    title,
    value = 70,
    progressWidth = 18,
    axisLineWidth = 18,
    splitLineLength = 15,
    splitLineWidth = 2,
    splitLineColor = "#999",
    axisLabelDistance = 25,
    axisLabelColor = "#999",
    axisLabelFontSize = 15,
    anchorSize = 20,
    anchorBorderWidth = 5,
    detailFontSize = 80,
    detailOffsetCenter = [0, "70%"],
}) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        // Inicializar ECharts
        const chartInstance = echarts.init(chartRef.current);
        chartInstanceRef.current = chartInstance;

        // Configuración principal
        const option = {
            title: {
                text: title,
                left: "center",
                textStyle: {
                    fontSize: 14,  
                },
            },
            series: [
                {
                    type: "gauge",
                    progress: {
                        show: true,
                        width: progressWidth,
                    },
                    axisLine: {
                        lineStyle: {
                            width: axisLineWidth,
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        length: splitLineLength,
                        lineStyle: {
                            width: splitLineWidth,
                            color: splitLineColor,
                        },
                    },
                    axisLabel: {
                        distance: axisLabelDistance,
                        color: axisLabelColor,
                        fontSize: axisLabelFontSize,
                    },
                    anchor: {
                        show: true,
                        showAbove: true,
                        size: anchorSize,
                        itemStyle: {
                            borderWidth: anchorBorderWidth,
                        },
                    },
                    title: {
                        show: false,
                    },
                    detail: {
                        valueAnimation: true,
                        fontSize: detailFontSize,
                        offsetCenter: detailOffsetCenter,
                    },
                    data: [
                        {
                            value: value,
                        },
                    ],
                },
            ],
        };

        // Asignar opciones al gráfico
        chartInstance.setOption(option);

        // Ajustar al cambiar el tamaño de ventana
        const handleResize = () => {
            chartInstance.resize();
        };
        window.addEventListener("resize", handleResize);

        // ResizeObserver (opcional) para cambios en el contenedor
        const resizeObserver = new ResizeObserver(() => {
            chartInstance.resize();
        });
        resizeObserver.observe(chartRef.current);

        // Limpieza
        return () => {
            window.removeEventListener("resize", handleResize);
            resizeObserver.disconnect();
            chartInstance.dispose();
        };
    }, [
        value,
        progressWidth,
        axisLineWidth,
        splitLineLength,
        splitLineWidth,
        splitLineColor,
        axisLabelDistance,
        axisLabelColor,
        axisLabelFontSize,
        anchorSize,
        anchorBorderWidth,
        detailFontSize,
        detailOffsetCenter,
    ]);

    return (
        <div
            ref={chartRef}
            style={{
                width: "100%",  // Ajuste dinámico al ancho del padre
                height: "100%", // Ocupa todo el alto que se le asigne externamente
            }}
        />
    );
}
