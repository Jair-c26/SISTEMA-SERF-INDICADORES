import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const FunctionRCD = ({ data, title = '', height = 380 }) => {
  const [state, setState] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: height,
        toolbar: { show: false }, // Ocultar el botón de descarga
      },
      xaxis: {
        type: 'category',
        categories: [], // Aquí se asignarán las categorías del eje X
        labels: {
          style: { fontSize: '9px' },
          formatter: function (value) {
            if (value && typeof value === 'string') {
              if (value.length > 15) {
                return value.substring(0, 15) + '...';
              }
              return value;
            }
            return '';
          },
        },
      },
      // El título solo se define si "title" tiene contenido
      ...(title && {
        title: {
          text: title,
        },
      }),
      tooltip: {
        x: {
          formatter: function (val) {
            return val;
          },
        },
      },
    },
  });

  const groupData = (data) => {
    const groupedData = data.reduce((acc, { x, y1, y2 }) => {
      if (!acc[x]) {
        acc[x] = [0, 0];
      }
      acc[x][0] += y1;
      acc[x][1] += y2;
      return acc;
    }, {});

    const groupedArray = Object.keys(groupedData).map((key) => ({
      x: key,
      y: groupedData[key],
    }));

    return groupedArray;
  };

  useEffect(() => {
    const grouped = groupData(data);
    const categories = grouped.map((item) => item.x);
    setState((prevState) => ({
      ...prevState,
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories: categories,
        },
      },
      series: [
        { name: 'Casos Resueltos', data: grouped.map((item) => item.y[0]) },
        { name: 'Casos Ingresados', data: grouped.map((item) => item.y[1]) },
      ],
    }));
  }, [data]);

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="bar"
          height={state.options.chart.height}
        />
      </div>
    </div>
  );
};

export default FunctionRCD;
