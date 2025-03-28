import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function ChartPie({
  title,
  subtext,
  seriesName = "Access From",
  seriesData = [],
  onDataURLReady, // nuevo prop para pasar el dataURL
}) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Función para formatear el título: inserta un salto de línea cada 4 palabras
  const formatTitle = (str) => {
    if (!str) return "";
    const words = str.split(" ");
    let formatted = "";
    for (let i = 0; i < words.length; i++) {
      formatted += words[i] + (((i + 1) % 4 === 0 && (i + 1) < words.length) ? "\n" : " ");
    }
    return formatted.trim();
  };

  const formattedTitle = formatTitle(title);

  useEffect(() => {
    // Inicializar ECharts en el div
    const chartInstance = echarts.init(chartRef.current);
    chartInstanceRef.current = chartInstance;

    const option = {
      title: {
        text: formattedTitle,
        subtext: subtext,
        left: "center",
        textStyle: {
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: "item",
      },
      grid: {
        top: "10%",
        containLabel: true,
      },
      series: [
        {
          name: seriesName,
          type: "pie",
          radius: "30%",
          data: seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            show: true,
            fontSize: 10,
            formatter: "{b} : {c}",
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
    }, 500);

    // Ajustar el gráfico al cambiar el tamaño
    const handleResize = () => chartInstance.resize();
    window.addEventListener("resize", handleResize);
    const resizeObserver = new ResizeObserver(() => chartInstance.resize());
    resizeObserver.observe(chartRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      chartInstance.dispose();
    };
  }, [formattedTitle, subtext, seriesName, seriesData, onDataURLReady]);

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
