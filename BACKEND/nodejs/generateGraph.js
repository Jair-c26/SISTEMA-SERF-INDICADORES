
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { promises as fs } from 'fs';
import path from 'path';

const width = 800;
const height = 600;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

const generateChart = async () => {
    const chartConfig = {
        type: 'bar',
        data: {
            labels: ['Fiscal 1', 'Fiscal 2', 'Fiscal 3'],
            datasets: [{
                label: 'Casos Resueltos',
                data: [10, 20, 30],
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        }
    };

    try {
        const chartBuffer = await chartJSNodeCanvas.renderToBuffer(chartConfig);
        
        // Define la ruta donde se guardará la imagen
        const chartPath = path.resolve('./storage/app/public/img/bardfsfsfdddd_chart.png');
        
        // Crear la carpeta si no existe
        await fs.mkdir(path.dirname(chartPath), { recursive: true });
        
        // Guardar la imagen del gráfico
        await fs.writeFile(chartPath, chartBuffer);
        
        console.log('Gráfico guardado en: ' + chartPath);
    } catch (error) {
        console.error('Error al generar el gráfico:', error);
    }
};

generateChart();
