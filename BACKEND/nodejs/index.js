import express from 'express';
import { createCanvas } from 'canvas';
import * as echarts from 'echarts';

const app = express();
const port = 4000;

app.use(express.json());

app.post('/api/generateGraph', async (req, res) => {
    const { option } = req.body;

    console.log('Datos recibidos:', option);

    if (!option) {
        return res.status(400).json({ error: 'Opción del gráfico no proporcionada' });
    }

    try {
        // Aumentar la resolución con un factor de escala
        const scaleFactor = 2; // Aumenta la calidad de la imagen (2x, 3x, etc.)
        const width = 1100 * scaleFactor;
        const height = 800 * scaleFactor;
        
        // Crear un canvas en memoria con mayor resolución
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Aplicar la escala al contexto del canvas para mayor nitidez
        ctx.scale(scaleFactor, scaleFactor);

        // Configurar el renderizador de ECharts con el contexto del canvas
        echarts.setPlatformAPI({
            createCanvas: () => canvas,
        });

        // Crear instancia de ECharts
        const chart = echarts.init(canvas, null, { renderer: 'canvas', width, height });

        // Aplicar las opciones del gráfico
        chart.setOption(option);

        // Esperar a que ECharts termine el renderizado
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Convertir el gráfico a una imagen PNG de alta calidad
        const buffer = canvas.toBuffer('image/png');

        res.set('Content-Type', 'image/png');
        res.send(buffer);
    } catch (error) {
        console.error('Error generando gráfico:', error);
        res.status(500).json({ error: 'Error generando el gráfico', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});




/*import express from 'express';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Importar Chart.js de forma correcta
import ChartJS from 'chart.js';
const { Chart } = ChartJS;

const app = express();
const port = 4000;

app.use(express.json());

// Registrar el plugin de data labels explícitamente
Chart.register(ChartDataLabels);

app.post('/api/generateGraph', async (req, res) => {
    const { type, data, options } = req.body;

    console.log('Datos recibidos:', { type, data, options });  // Ver los datos recibidos en consola

    if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
        return res.status(400).json({ error: 'Datos incompletos o inválidos' });
    }

    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 700 });

    const configuration = {
        type,
        data,
        options
    };

    try {
        const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (error) {
        console.error('Error generating chart:', error);
        res.status(500).json({ error: 'Hubo un error generando el gráfico', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});
*/