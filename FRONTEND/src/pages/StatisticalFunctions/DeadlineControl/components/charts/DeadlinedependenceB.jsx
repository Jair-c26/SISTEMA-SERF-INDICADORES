import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function DeadlinedependenceB({
  title = "Título por defecto",
  yAxisData = [],
  seriesData = [],
  onDataURLReady, // nuevo prop para capturar el dataURL
}) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Función para agrupar palabras en líneas (por si necesitas dividir nombres largos)
  const chunkWords = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size).join(" "));
    }
    return result;
  };

  useEffect(() => {
    // Inicializar ECharts en el div
    const chartInstance = echarts.init(chartRef.current);
    chartInstanceRef.current = chartInstance;

    // Nueva configuración de la gráfica
    const option = {
      title: {
        text: title,
        left: "center",
        textStyle: {
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {},
      grid: {
        top: "8%",
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: "category",
        data: yAxisData,
        axisLabel: {
          fontSize: 12,
          interval: 0,
          formatter: (value) => {
            const words = value.split(" ");
            return chunkWords(words, 5).join("\n");
          },
        },
      },
      series: [
        {
          type: "bar",
          data: seriesData,
          label: {
            show: true,
            position: "right",
            fontSize: 12,
            formatter: "{c}",
          },
        },
      ],
    };

    chartInstance.setOption(option);

    // Esperar brevemente para que el gráfico se renderice y capturar el dataURL
    setTimeout(() => {
      const dataURL = chartInstance.getDataURL({
        type: "png",
        pixelRatio: 2,
        backgroundColor: "#fff",
      });
      if (onDataURLReady) {
        onDataURLReady(dataURL);
      }
    }, 1000);

    // Ajustar gráfica al cambiar tamaño de ventana
    const handleResize = () => chartInstance.resize();
    window.addEventListener("resize", handleResize);

    // Usar ResizeObserver para detectar cambios en el contenedor
    const resizeObserver = new ResizeObserver(() => {
      chartInstance.resize();
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      chartInstance.dispose();
    };
  }, [title, yAxisData, seriesData, onDataURLReady]);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}
