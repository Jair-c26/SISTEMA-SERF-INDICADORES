

// DeadlineBarChart.jsx
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

// Si requieres compatibilidad con navegadores antiguos:
// import ResizeObserver from 'resize-observer-polyfill';

export default function DeadlineBarChart() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    // 1. Inicializar ECharts en el div
    const chartInstance = echarts.init(chartRef.current);
    chartInstanceRef.current = chartInstance;

    // Función para agrupar palabras
    const chunkWords = (arr, size) => {
      const result = [];
      for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size).join(" "));
      }
      return result;
    };

    // Opciones de la gráfica
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      legend: {
        data: ["Dentro de plazos", "Plazos por vencer", "Plazos vencidos"],
        top: 10,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: [
          "FISCALIA PROVINCIAL ESPECIALIZADA CONTRA LA CRIMINALIDAD ORGANIZADA DE MADRE DE DIOS",
          "2° FISCALIA PROVINCIAL PENAL CORPORATIVA DE TAMBOPATA",
          "2° FISCALIA PROVINCIAL PENAL CORPORATIVA DE TAMBOPATA",
          "2° FISCALIA PROVINCIAL PENAL CORPORATIVA DE TAMBOPATA",
          "2° FISCALIA PROVINCIAL PENAL CORPORATIVA DE TAMBOPATA",
          // ... resto de valores
        ],
        axisLabel: {
          fontSize: 7,
          interval: 0, // mostrar todas las etiquetas
          formatter: (value) => {
            const words = value.split(" ");
            if (words.length <= 2) {
              return chunkWords(words, 1).join("\n");
            }
            const firstFive = words.slice(0, 5);
            return chunkWords(firstFive, 1).join("\n") + "...";
          },
        },
      },
      yAxis: {
        type: "value",

      },
      series: [
        {
          name: "Dentro de plazos",
          type: "bar",
          data: [10, 7, 5, 9, 4],
          itemStyle: { color: "#008000" },
          label: {
            show: true,           // Muestra las etiquetas
            position: "top",      // Ubicación de la etiqueta (encima de la barra)
            fontSize: 10,         // Tamaño de fuente (opcional)
            formatter: "{c}",     // Formato de la etiqueta (por defecto muestra el valor)
          },
        },
        {
          name: "Plazos por vencer",
          type: "bar",
          data: [2, 3, 2, 4, 3],
          itemStyle: { color: "#FFD700" },
          label: {
            show: true,           // Muestra las etiquetas
            position: "top",      // Ubicación de la etiqueta (encima de la barra)
            fontSize: 10,         // Tamaño de fuente (opcional)
            formatter: "{c}",     // Formato de la etiqueta (por defecto muestra el valor)
          },
        },
        {
          name: "Plazos vencidos",
          type: "bar",
          data: [1, 2, 0, 1, 2],
          itemStyle: { color: "#FF0000" },
          label: {
            show: true,           // Muestra las etiquetas
            position: "top",      // Ubicación de la etiqueta (encima de la barra)
            fontSize: 10,         // Tamaño de fuente (opcional)
            formatter: "{c}",     // Formato de la etiqueta (por defecto muestra el valor)
          },
        },
      ],
    };

    // Asignar opciones
    chartInstance.setOption(option);

    // 2. Ajustar gráfica al cambiar tamaño de ventana
    const handleResize = () => {
      chartInstance.resize();
    };
    window.addEventListener("resize", handleResize);

    // 3. Usar ResizeObserver para detectar cambios en el contenedor
    const resizeObserver = new ResizeObserver(() => {
      chartInstance.resize();
    });
    resizeObserver.observe(chartRef.current);

    // Cleanup
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
        width: "100%",   // Ajuste dinámico al ancho del padre
        height: "100%",  // Ocupa todo el alto que se le asigne externamente
      }}
    />
  );
}
