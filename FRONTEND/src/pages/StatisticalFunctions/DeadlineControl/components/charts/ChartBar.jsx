import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
// Si necesitas compatibilidad con navegadores antiguos, puedes importar ResizeObserver de 'resize-observer-polyfill'

export default function ChartBarLine() {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        // Inicializa la instancia de ECharts en el contenedor
        const chartInstance = echarts.init(chartRef.current);
        chartInstanceRef.current = chartInstance;

        // Función para agrupar palabras en líneas
        const chunkWords = (arr, size) => {
            const result = [];
            for (let i = 0; i < arr.length; i += size) {
                result.push(arr.slice(i, i + size).join(" "));
            }
            return result;
        };

        // Configuración del gráfico (barra y línea) con funcionalidad de axisLabel
        const option = {
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" }
            },
            legend: {
                data: ["casos resueltos", "casos ingresados"],
                top: 10,
            },
            grid: {
                top: "15%",
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
            },
            xAxis: [
                {
                    type: "category",
                    data: [
                        "2016",
                        "2017",
                        "2018",
                        "2019",
                        "2020",
                        "2021",
                        "2022",
                    ],
                    axisLabel: {
                        fontSize: 10,
                        interval: 0, // mostrar todas las etiquetas
                        formatter: (value) => {
                            const words = value.split(" ");
                            if (words.length <= 2) {
                                return chunkWords(words, 1).join("\n");
                            }
                            const firstFive = words.slice(0, 5);
                            return chunkWords(firstFive, 1).join("\n") + "...";
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: "value"
                }
            ],
            series: [
                // --- BARRAS: Casos resueltos ---
                {
                    name: "casos resueltos",
                    type: "bar",
                    stack: "Ad", // (opcional) para apilar
                    emphasis: { focus: "series" },
                    data: [220, 182, 191, 234, 290, 330, 310],
                    label: {
                        show: true,
                        position: "top",
                        formatter: "{c}"
                    }
                },
                
                // --- BARRAS: Casos ingresados ---
                {
                    name: "casos ingresados",
                    type: "bar",
                    emphasis: { focus: "series" },
                    data: [862, 1018, 964, 1026, 1679, 1600, 1570],
                    label: {
                        show: true,
                        position: "top",
                        formatter: "{c}"
                    }
                }
            ]
        };

        // Asigna la opción al gráfico
        chartInstance.setOption(option);

        // Función para ajustar el tamaño del gráfico
        const handleResize = () => {
            chartInstance.resize();
        };

        window.addEventListener("resize", handleResize);

        // Observa cambios en el tamaño del contenedor
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
    }, []);

    return (
        <div
            ref={chartRef}
            style={{
                width: "100%", // Se adapta al ancho del contenedor padre
                height: "100%" // Se adapta al alto asignado externamente
            }}
        />
    );
}
