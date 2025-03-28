import React from 'react';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';

const CHIDoughnutChart = ({ data, categories }) => {
    const truncatedCategories = categories.map((label) => 
        label.length > 45 ? `${label.slice(0, 45)}...` : label
    );
    const chartOptions = {
        chart: {
            type: 'donut',
        },
        labels: truncatedCategories,
        
        legend: {
            position: 'right',
        },
        tooltip: {
            y: {
                formatter: (val) => `${val}%`,
            },
        },
    };

    return (
        <div>
            <ReactApexChart
                options={chartOptions}
                series={data}
                type="donut"
                height={260}
            />
        </div>
    );
};

CHIDoughnutChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.number).isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CHIDoughnutChart;
