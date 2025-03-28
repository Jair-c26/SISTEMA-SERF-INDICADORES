// src/FunctionPCC.jsx
import React, { useEffect } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const FunctionPCC = ({ nombre_fiscal, valor }) => {
    useEffect(() => {
        let root = am5.Root.new("chartdiv");

        root.setThemes([am5themes_Animated.new(root)]);

        let chart = root.container.children.push(am5percent.PieChart.new(root, {
            endAngle: 270,
            layout: root.verticalLayout,
            innerRadius: am5.percent(60)
        }));

        let series = chart.series.push(am5percent.PieSeries.new(root, {
            valueField: "value",
            categoryField: "category",
            endAngle: 270
        }));

        series.labels.template.setAll({
            fontSize: 9,
            fontFamily: 'Inter'
        });

        series.slices.template.setAll({
            tooltipText: "{category}: {value}"
        });

        series.set("colors", am5.ColorSet.new(root, {
            colors: [
                am5.color(0x6E56A3),
                am5.color(0xD8B427),
                am5.color(0xD74650),
                am5.color(0x4CB848)
            ]
        }));

        // Generate data for the series
        const generateSeriesData = () => {
            return nombre_fiscal.map((fiscal, index) => ({
                category: fiscal,
                value: valor[index]
            }));
        };

        const seriesData = generateSeriesData();
        series.data.setAll(seriesData);

        root._logo.dispose();

        return () => {
            root.dispose();
        };
    }, [nombre_fiscal, valor]);

    return (
        <div id="chartdiv" style={{ width: '650px', height: '240px' }}></div>
    );
};

export default FunctionPCC;
