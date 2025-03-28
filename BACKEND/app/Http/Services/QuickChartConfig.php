<?php

namespace App\Http\Services;

class QuickChartConfig
{
    /**
     * Obtener la configuración del gráfico.
     *
     * @return array
     */
    
    public static function getBarChartConfig(array $data)
    {
        return [
            'type' => 'bar',
            'data' => [
                'labels' => array_column($data, 'nombre'), // Nombres de los fiscales
                'datasets' => [
                    [
                        'label' => 'Casos Resueltos', // Etiqueta para el primer conjunto de datos
                        'data' => array_column($data, 'casos_resueltos'), // Datos de casos resueltos
                        'backgroundColor' => '#FF6384', // Color de fondo de las barras
                        'borderColor' => '#000000', // Color del borde de las barras
                        'borderWidth' => 1, // Ancho del borde
                        'hoverBackgroundColor' => '#FF6F91', // Color al pasar el mouse
                        'hoverBorderColor' => '#000000', // Color del borde al pasar el mouse
                        'hoverBorderWidth' => 2, // Ancho del borde al pasar el mouse
                        'fill' => false, // No rellenar las barras
                        'barPercentage' => 0.8, // Porcentaje de la barra dentro del área de la gráfica
                        'categoryPercentage' => 0.8, // Porcentaje del espacio utilizado en el gráfico
                    ],
                    [
                        'label' => 'Casos Pendientes', // Etiqueta para el segundo conjunto de datos
                        'data' => array_column($data, 'casos_pendientes'), // Datos de casos pendientes
                        'backgroundColor' => '#36A2EB', // Color de fondo de las barras
                        'borderColor' => '#000000', // Color del borde de las barras
                        'borderWidth' => 1, // Ancho del borde
                        'hoverBackgroundColor' => '#68A9F3', // Color al pasar el mouse
                        'hoverBorderColor' => '#000000', // Color del borde al pasar el mouse
                        'hoverBorderWidth' => 2, // Ancho del borde al pasar el mouse
                        'fill' => false, // No rellenar las barras
                        'barPercentage' => 0.8, // Porcentaje de la barra dentro del área de la gráfica
                        'categoryPercentage' => 0.8, // Porcentaje del espacio utilizado en el gráfico
                    ],
                ],
            ],
            'options' => [
                'responsive' => true, // Hacer el gráfico responsive
                'maintainAspectRatio' => false, // Mantener la relación de aspecto del gráfico
                'scales' => [
                    'x' => [
                        'ticks' => [
                            'font' => [
                                'size' => 20, // Tamaño de la fuente de los ejes X
                                'color' => '#000000', // Color del texto de los ejes X
                            ],
                            'title' => [
                                'display' => true, // Mostrar título del eje X
                                'text' => 'Fiscales', // Título del eje X
                                'font' => [
                                    'size' => 20, // Tamaño de la fuente del título del eje X
                                    'color' => '#000000', // Color del título del eje X
                                ],
                            ],
                        ],
                        'grid' => [
                            'color' => '#e3e3e3', // Color de la cuadrícula
                        ],
                    ],
                    'y' => [
                        'ticks' => [
                            'font' => [
                                'size' => 20, // Tamaño de la fuente de los ejes Y
                                'color' => '#000000', // Color del texto de los ejes Y
                            ],
                            'title' => [
                                'display' => true, // Mostrar título del eje Y
                                'text' => 'Número de Casos', // Título del eje Y
                                'font' => [
                                    'size' => 20, // Tamaño de la fuente del título del eje Y
                                    'color' => '#000000', // Color del título del eje Y
                                ],
                            ],
                        ],
                        'grid' => [
                            'color' => '#e3e3e3', // Color de la cuadrícula
                        ],
                        'beginAtZero' => true, // Empezar el eje Y desde 0
                    ],
                ],
                'plugins' => [
                    'title' => [
                        'display' => true, // Mostrar el título
                        'text' => 'Casos Resueltos vs Casos Pendientes por Fiscal', // Título principal
                        'font' => [
                            'size' => 30, // Tamaño de la fuente del título
                            'family' => 'Arial', // Fuente del título
                        ],
                        'color' => '#000000', // Color del título
                    ],
                    'legend' => [
                        'display' => true, // Mostrar leyenda
                        'position' => 'top', // Posición de la leyenda
                        'labels' => [
                            'font' => [
                                'size' => 20, // Tamaño de la fuente de las etiquetas de la leyenda
                                'color' => '#000000', // Color de las etiquetas de la leyenda
                            ],
                        ],
                    ],
                    'tooltip' => [
                        'enabled' => true, // Habilitar tooltips
                        'backgroundColor' => '#ffffff', // Color de fondo del tooltip
                        'bodyFont' => [
                            'size' => 18, // Tamaño de la fuente del cuerpo del tooltip
                        ],
                        'borderColor' => '#000000', // Color del borde del tooltip
                        'borderWidth' => 1, // Ancho del borde del tooltip
                        'titleFont' => [
                            'size' => 20, // Tamaño de la fuente del título del tooltip
                        ],
                    ],
                    'datalabels' => [
                        'display' => true, // Mostrar etiquetas de datos
                        'align' => 'center', // Alineación de las etiquetas
                        'anchor' => 'center', // Ancla de las etiquetas
                        'color' => '#000000', // Color de las etiquetas
                        'font' => [
                            'size' => 18, // Tamaño de la fuente de las etiquetas de datos
                            'weight' => 'bold', // Peso de la fuente de las etiquetas
                        ],
                    ],
                ],
            ],
        ];
    }
    
    /**
     * Configuración del gráfico de dona.
     */
    public static function getDoughnutChartConfig(array $data)
    {
        return [
            'type' => 'doughnut',
            'data' => [
                'labels' => array_column($data, 'nombre'), // Nombres de los fiscales
                'datasets' => [
                    [
                        'data' => array_column($data, 'porcentaje_tramites'), // Porcentajes
                        'backgroundColor' => [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4CAF50',
                            '#FF9800',
                            '#F44336',
                            '#2196F3',
                            '#3F51B5',
                            '#9C27B0',
                            '#00BCD4'
                        ],
                        'borderWidth' => 0, // Eliminar el borde
                    ],
                ],
            ],
            'options' => [
                'cutout' => '60%', // En lugar de cutoutPercentage
                'plugins' => [
                    'title' => [
                        'display' => true,
                        'text' => 'Distribución de Trámites por Fiscal',
                        'font' => ['size' => 30, 'family' => 'Arial'],
                        'color' => '#000000',
                    ],
                    'legend' => [
                        'position' => 'right',
                        'labels' => [
                            'font' => ['size' => 26],
                            'color' => '#000000',
                        ],
                    ],
                    'tooltip' => [
                        'bodyFont' => ['size' => 25],
                    ],
                ],
            ],
        ];
    }
}
