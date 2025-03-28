import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
// import ResizeObserver from 'resize-observer-polyfill'; // Si necesitas compatibilidad con navegadores antiguos

export default function ChartBarLine({
    title = "Título por defecto",
    legendData = [],
    xAxisData = [],
    seriesData = [],
}) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    // Función para agrupar palabras en líneas (por si deseas dividir texto en el eje X)
    const chunkWords = (arr, size) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size).join(" "));
        }
        return result;
    };

    useEffect(() => {
        // Inicializa la instancia de ECharts en el contenedor
        const chartInstance = echarts.init(chartRef.current);
        chartInstanceRef.current = chartInstance;

        // Agregar configuración de etiqueta solo a las series tipo "bar"
        const finalSeries = seriesData.map((serie) => {
            if (serie.type === "bar") {
                return {
                    ...serie,
                    label: {
                        show: true,
                        position: "top", // O "top", según desees
                        fontSize: 12,
                        formatter: "{c}",
                        ...serie.label, // Permite sobrescribir si el usuario pasa su propia config
                    },
                };
            }
            return { ...serie };
        });

        // Configuración del gráfico (barra y línea) con funcionalidad de axisLabel y animación
        const option = {
            // Propiedades de animación para la transición de datos
            animation: true,
            animationDuration: 1000,
            animationDurationUpdate: 500,
            animationEasing: "cubicInOut",
            animationEasingUpdate: "cubicInOut",
            animationThreshold: 2000,

            title: {
                text: title,
                left: "center",
                textStyle: {
                    fontSize: 14,
                },
            },
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
            },
            legend: {
                data: legendData,
                top: 30,
            },
            grid: {
                top: "15%",
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            xAxis: [
                {
                    type: "category",
                    data: xAxisData,
                    axisLabel: {
                        fontSize: 12,
                        interval: 0, // mostrar todas las etiquetas
                        formatter: (value) => {
                            // Ejemplo: si la etiqueta es muy larga, agrupa cada 5 palabras
                            const words = value.split(" ");
                            if (words.length <= 2) {
                                return chunkWords(words, 1).join("\n");
                            }
                            const firstFive = words.slice(0, 3);
                            return chunkWords(firstFive, 3).join("\n") + "...";
                        },
                    },
                },
            ],
            yAxis: [
                {
                    type: "value",
                },
            ],
            series: finalSeries,
        };

        // Asigna la opción al gráfico
        chartInstance.setOption(option);

        // Función para ajustar el tamaño del gráfico al cambiar el tamaño de ventana
        const handleResize = () => {
            chartInstance.resize();
        };
        window.addEventListener("resize", handleResize);

        // Usar ResizeObserver para detectar cambios en el contenedor (si lo requieres)
        const resizeObserver = new ResizeObserver(() => {
            chartInstance.resize();
        });
        resizeObserver.observe(chartRef.current);

        // Cleanup: elimina event listeners y libera recursos al desmontar el componente
        return () => {
            window.removeEventListener("resize", handleResize);
            resizeObserver.disconnect();
            chartInstance.dispose();
        };
    }, [title, legendData, xAxisData, seriesData]);

    return (
        <div
            ref={chartRef}
            style={{
                width: "100%",  // Se adapta al ancho del contenedor padre
                height: "100%"  // Se adapta al alto asignado externamente
            }}
        />
    );
}
