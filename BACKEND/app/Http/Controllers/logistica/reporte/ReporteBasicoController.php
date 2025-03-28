<?php

namespace App\Http\Controllers\logistica\reporte;

use Carbon\Carbon;
use Dompdf\Dompdf;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Intervention\Image\Facades\Image;

use Symfony\Component\Process\Process;
use App\Http\Services\QuickChartConfig;
use Illuminate\Support\Facades\Storage;
use ConsoleTVs\Charts\Classes\Chartjs\Chart;
use Symfony\Component\Process\Exception\ProcessFailedException;

class ReporteBasicoController extends Controller
{
    /**
     * Generar un reporte básico en PDF.
     *
     * @param string $nombre
     * @param string $descripcion
     * @return \Illuminate\Http\Response
     */
    public function generateGraph()
    {
        try {

            // Datos de ejemplo, deberías obtenerlos de la base de datos
            $data = [
                ['nombre' => 'Fiscal 1', 'porcentaje_tramites' => 30],
                ['nombre' => 'Fiscal 2', 'porcentaje_tramites' => 50],
                ['nombre' => 'Fiscal 3', 'porcentaje_tramites' => 20],
            ];

            // Obtener configuración del gráfico de dona desde QuickChartConfig
            //$dataGraficpie = QuickChartConfig::getDoughnutChartConfig($data);

            // Construcción del option para ECharts (gráfico de pastel)
            $dataGraficpie = [
                "option" => [
                    "title" => [
                        "text" => "Distribución de Trámites por Fiscal",
                        "subtext" => "Datos Generados",
                        "left" => "center",
                        "top" => "5%",
                        "textStyle" => [
                            "fontSize" => 24,
                            "fontWeight" => "bold",
                            "color" => "#000000" // Letras negras
                        ],
                        "subtextStyle" => [
                            "fontSize" => 18,
                            "color" => "#000000" // Letras negras
                        ]
                    ],
                    "tooltip" => ["trigger" => "item"],
                    "legend" => [
                        "orient" => "vertical",
                        "bottom" => "10%",
                        "textStyle" => [
                            "fontSize" => 18,
                            "color" => "#000000" // Letras negras
                        ]
                    ],
                    "color" => ["#E17153", "#56AF4F", "#E6C56A", "#2A4654", "#367FD0"],
                    "series" => [
                        [
                            "name" => "Trámites",
                            "type" => "pie",
                            "radius" => ["0%", "35%"],
                            "center" => ["50%", "45%"],
                            "data" => [
                                ["value" => 30, "name" => "Juan Pérez López"],
                                ["value" => 50, "name" => "María Rodríguez Sánchez"],
                                ["value" => 20, "name" => "Carlos Gómez Fernández"],
                                ["value" => 40, "name" => "Ana Torres Ramírez"],
                                ["value" => 25, "name" => "Luis Herrera Vargas"]
                            ],
                            "label" => [
                                "show" => true,
                                "fontSize" => 17,
                                "fontWeight" => "bold",
                                "color" => "#000000", // Letras negras
                                "alignTo" => "labelLine",
                                "bleedMargin" => 1,
                                "minMargin" => 10,
                                "formatter" => "{name|{b}}\n{line|———————}\n{value|{c} trámites}",
                                "rich" => [
                                    "name" => [
                                        "fontSize" => 17,
                                        "fontWeight" => "bold",
                                        "color" => "#000000", // Letras negras
                                        "align" => "center"
                                    ],
                                    "line" => [
                                        "fontSize" => 18,
                                        "color" => "#000000", // Letras negras
                                        "align" => "center"
                                    ],
                                    "value" => [
                                        "fontSize" => 14,
                                        "color" => "#000000", // Letras negras
                                        "align" => "center"
                                    ]
                                ]
                            ],
                            "labelLine" => [
                                "length" => 15,
                                "length2" => 5,
                                "lineStyle" => [
                                    "width" => 2
                                ],
                                "maxSurfaceAngle" => 80
                            ],
                            "emphasis" => [
                                "label" => [
                                    "show" => true,
                                    "fontSize" => 22,
                                    "fontWeight" => "bold",
                                    "color" => "#000000" // Letras negras
                                ]
                            ],
                            "itemStyle" => [
                                "borderRadius" => 5
                            ]
                        ]
                    ]
                ]
            ];


            // Datos estructurados con nombres y valores
            $data = [
                ["nombre" => "Juan Pérez López", "ingresados" => 150, "resueltos" => 120],
                ["nombre" => "María Rodríguez Sánchez", "ingresados" => 230, "resueltos" => 210],
                ["nombre" => "Carlos Gómez Fernández", "ingresados" => 224, "resueltos" => 190],
                ["nombre" => "Ana Torres Ramírez", "ingresados" => 218, "resueltos" => 200],
                ["nombre" => "Luis Herrera Vargas", "ingresados" => 135, "resueltos" => 110],
                ["nombre" => "Pedro Ramírez Castro", "ingresados" => 147, "resueltos" => 130],
                ["nombre" => "Elena Mendoza Ríos", "ingresados" => 260, "resueltos" => 200]
            ];

            // Extraer datos para la gráfica
            $labels = array_column($data, "nombre");
            $dataIngresados = array_column($data, "ingresados");
            $dataResueltos = array_column($data, "resueltos");


            $dataGraficLine = [
                "option" => [
                    "title" => [
                        "text" => "Casos Ingresados vs Resuelto Histórico",
                        "subtext" => "Comparación por Fiscal",
                        "left" => "center",
                        "top" => "2%",
                        "textStyle" => ["fontSize" => 43, "fontWeight" => "bold", "color" => "#000000"],
                        "subtextStyle" => ["fontSize" => 36, "color" => "#333333"]
                    ],
                    "tooltip" => ["trigger" => "axis"],
                    "legend" => [
                        "data" => ["Casos Ingresados", "Resuelto Histórico"],
                        "top" => "10%",
                        "textStyle" => ["fontSize" => 34, "color" => "#000000"],
                        "itemWidth" => 60,
                        "itemHeight" => 40
                    ],
                    "grid" => ["top" => "17%", "left" => "10%", "right" => "5%", "bottom" => "15%", "containLabel" => true],
                    "xAxis" => [
                        "type" => "category",
                        "boundaryGap" => false,
                        "data" => $labels,
                        "axisLabel" => ["fontSize" => 35, "color" => "#202124", "rotate" => 30, "margin" => 30],
                        "splitLine" => ["show" => true, "lineStyle" => ["type" => "dashed", "color" => "#666666", "width" => 3]]
                    ],
                    "yAxis" => [
                        "type" => "value",
                        "min" => 100,
                        "max" => 270,
                        "splitLine" => ["show" => true, "lineStyle" => ["type" => "dashed", "color" => "#666666", "width" => 3]],
                        "axisLabel" => ["fontSize" => 30, "color" => "#000000"]
                    ],
                    "series" => [
                        [
                            "name" => "Casos Ingresados",
                            "data" => $dataIngresados,
                            "type" => "line",
                            "symbol" => "triangle",
                            "symbolSize" => 25,
                            "showSymbol" => true,
                            "lineStyle" => ["width" => 6, "color" => "#399D8E"],
                            "itemStyle" => ["color" => "#399D8E"],
                            "label" => [
                                "show" => true,
                                "position" => "top",
                                "fontSize" => 25,
                                "formatter" => "{c|{c}}",
                                "rich" => ["c" => [
                                    "color" => "#ffffff",
                                    "backgroundColor" => "#16191D",
                                    "padding" => [10, 10],
                                    "borderRadius" => 50,
                                    "align" => "center",
                                    "fontSize" => 29,
                                    "fontWeight" => "bold"
                                ]]
                            ]
                        ],
                        [
                            "name" => "Resuelto Histórico",
                            "data" => $dataResueltos,
                            "type" => "line",
                            "symbol" => "rect",
                            "symbolSize" => 25,
                            "showAllSymbol" => true,
                            "lineStyle" => ["width" => 6, "color" => "#EC4F2D"],
                            "itemStyle" => ["color" => "#EC4F2D"],
                            "label" => [
                                "show" => true,
                                "position" => "top",
                                "fontSize" => 25,
                                "formatter" => "{c|{c}}",
                                "rich" => ["c" => [
                                    "color" => "#ffffff",
                                    "backgroundColor" => "#202124",
                                    "padding" => [10, 10],
                                    "borderRadius" => 50,
                                    "align" => "center",
                                    "fontSize" => 29,
                                    "fontWeight" => "bold"
                                ]]
                            ]
                        ]
                    ]
                ]
            ];





            // Realizar la solicitud POST a la API de Node.js
            $response = Http::post('http://nodejs:4000/api/generateGraph', $dataGraficpie);   //$dataGraficpie);
            // Verificar si la solicitud fue exitosa
            if (!$response->successful()) {
                return response()->json(['error' => 'Hubo un error al generar el gráfico'], 500);
            }
            // Obtener el contenido binario de la imagen
            $imageContentPie = $response->body();

            $imageUrlPie = $this->minioStorage($imageContentPie, 'pie');


            //dd($imageUrlPie);


            /**************************************************************************
            
             * 
             * 
             */

            // Obtener configuración del gráfico de dona desde QuickChartConfig
            //$dataGraficBar = QuickChartConfig::getBarChartConfig($data);

            $dataGraficBar = [
                "option" => [
                    "title" => [
                        "text" => "Cantidad de Trámites por Fiscal",
                        "subtext" => "Datos Generados",
                        "left" => "center"
                    ],
                    "tooltip" => ["trigger" => "axis"],
                    "xAxis" => [
                        "type" => "category",
                        "data" => array_column($data, "nombre")
                    ],
                    "yAxis" => [
                        "type" => "value"
                    ],
                    "series" => [
                        [
                            "name" => "Trámites",
                            "type" => "bar",
                            "data" => array_column($data, "porcentaje_tramites"),
                            "itemStyle" => [
                                "color" => "#007bff"
                            ]
                        ]
                    ]
                ]
            ];


            // Realizar la solicitud POST a la API de Node.js
            $responsee = Http::post('http://nodejs:4000/api/generateGraph', $dataGraficLine);
            // Verificar si la solicitud fue exitosa
            if (!$responsee->successful()) {
                return response()->json(['error' => 'Hubo un error al generar el gráfico'], 500);
            }
            // Obtener el contenido binario de la imagen
            $imageContentBar = $responsee->body();


            $imageUrlBar = $this->minioStorage($imageContentBar, 'bar');

            $fechaInicio = '01/01/2025';
            $fechaFin = '31/01/2025';
            $titulo = "indicadores";
            $fecha = "2025";

            // Preparar los datos para la vista
            $data = [
                //'dependencia' => $dependencia,
                //'despachos' => $dependencia->despachos,
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin,
                'titulo' => $titulo,
                'fecha' => $fecha,
                //'user' => $user,
                'pieChartImage' => $imageUrlPie,
                'barChartImage' => $imageUrlBar,   //-----agregar
                //'ipAddress' => $ipAddress,
                //'barcode' => $barcodeBase64, // Agregar el código de barras
                //'codigoBarrasTexto' => $codigoBarras, // Texto del código de barras
            ];

            // Renderizar la vista en HTML
            $html = view('report.reporteBasico', compact('data'))->render();

            // Loguear el HTML generado
            //Log::info($html);
            //dd($data);

            if (empty($html)) {
                return response()->json(['error' => 'El HTML está vacío'], 500);
            }

            // Generar el PDF con DomPDF
            // Configuración de Dompdf
            $dompdf = new Dompdf(['isRemoteEnabled' => true]);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'landscape');
            $dompdf->render();


            $canvas = $dompdf->get_canvas();
            $canvas->page_script(function ($pageNumber, $pageCount, $canvas, $fontMetrics) use ($data) {
                $font = $fontMetrics->get_font("Arial, Helvetica, sans-serif", "normal");
                $size = 8;

                // Dimensiones del canvas
                $canvasWidth = $canvas->get_width();
                $canvasHeight = $canvas->get_height();
                $yFooter = $canvasHeight - 50; // Posición Y del inicio del footer

                // Fondo del footer
                $canvas->filled_rectangle(0, $yFooter, $canvasWidth, 60, [0.95, 0.95, 0.95]); // Fondo gris claro

                // Línea superior del footer
                $canvas->line(0, $yFooter, $canvasWidth, $yFooter, [0, 0, 0], 0.2); // Línea negra con grosor 0.5

                // Contenido del footer
                $responsableTexto = "Responsable:"; // Primera línea
                $responsableNombre = $data['user']->nombre ?? 'No disponible'; // Segunda línea
                $ipOrigen = "IP Origen: " . ($data['ipAddress'] ?? 'No disponible');
                $fechaActual = "Fecha impresión:";
                $fechaValor = $data['currentDateTime'] ?? 'No disponible';
                $pagina = "Página $pageNumber de $pageCount";

                // Tabla simulada con bordes
                $cellWidth = $canvasWidth / 4; // Dividir el ancho en 4 columnas
                $cellHeight = 40; // Altura de cada celda
                $yTextCenter = $yFooter + ($cellHeight / 2); // Centrar verticalmente

                // Dibujar bordes y texto de cada celda
                for ($i = 0; $i < 4; $i++) {
                    $xCell = $i * $cellWidth;
                    $canvas->rectangle($xCell, $yFooter, $cellWidth, $cellHeight, [0, 0, 0], 0.5); // Dibujar bordes de cada celda
                }

                // Coordenadas X centradas para cada texto
                $xResponsable = $cellWidth / 2 - $fontMetrics->get_text_width($responsableTexto, $font, $size) / 2;
                $xResponsableNombre = $cellWidth / 2 - $fontMetrics->get_text_width($responsableNombre, $font, $size) / 2;
                $xIpOrigen = $cellWidth + $cellWidth / 2 - $fontMetrics->get_text_width($ipOrigen, $font, $size) / 2;
                $xFecha = $cellWidth * 2 + $cellWidth / 2 - $fontMetrics->get_text_width($fechaActual, $font, $size) / 2;
                $xFechaValor = $cellWidth * 2 + $cellWidth / 2 - $fontMetrics->get_text_width($fechaValor, $font, $size) / 2;
                $xPagina = $cellWidth * 3 + $cellWidth / 2 - $fontMetrics->get_text_width($pagina, $font, $size) / 2;

                // Imprimir texto centrado vertical y horizontalmente
                // Primera línea: Responsable
                $canvas->text($xResponsable, $yTextCenter - 12, $responsableTexto, $font, $size);
                // Segunda línea: Nombre del responsable
                $canvas->text($xResponsableNombre, $yTextCenter + 3, $responsableNombre, $font, $size);

                $canvas->text($xIpOrigen, $yTextCenter - 5, $ipOrigen, $font, $size);
                $canvas->text($xFecha, $yTextCenter - 15, $fechaActual, $font, $size); // Primera línea de "Fecha impresión"
                $canvas->text($xFechaValor, $yTextCenter + 5, $fechaValor, $font, $size); // Segunda línea de "Fecha impresión"
                $canvas->text($xPagina, $yTextCenter - 5, $pagina, $font, $size);
            });

            return $dompdf->stream('reporte.pdf', ['Attachment' => false]);
        } catch (\Exception $e) {
            //throw $th;
            Log::error('Error____:::' . $e->getMessage());
            return response()->json('Error:' . $e->getMessage(), 404);
        }
    }


    private function minioStorage($imageContent, $grafico): string
    {

        try {

            // Generar el nombre del archivo: "lista de usuarios-{nombre_usuario}-{fecha actual}"
            $userName = auth()->user()->nombre ?? null; // Ajustar según cómo obtienes el nombre del usuario
            $uuidUser = auth()->user()->uuid ?? null;
            $nombre_modificado = str_replace(" ", "_", trim($userName));
            $currentDate = now()->format('d-m-Y_H-i-s'); // Fecha con formato seguro para nombres de archivo
            $random = Str::random(20); //agrega seguridad a archivos publicos C:
            $fileName = "{$grafico}-{$nombre_modificado}-{$currentDate}-{$random}.png"; // Define la extensión manualmente

            // Guardar el archivo en el sistema de almacenamiento predeterminado
            $path = 'INDICADORES/carpeta_users/' . $nombre_modificado . '_' . $uuidUser . '/Graficos_reporte/' . $grafico . '/' . $fileName;

            Storage::disk('minio-public')->put($path, $imageContent);

            $url = env('AWS_URL') . '/' . env('AWS_BUCKET_PUBLIC') . '/' . $path;

            //$this->archivosRegister($url,$fileName,$file,$urlCarpeta->id);  ///--------------------

            return $url;
        } catch (\Exception $e) {
            //throw $th;

            Log::error("ERROR GRAFICO: " . $e->getMessage());
            return response()->json([
                'Message' => 'error en el pdf',
                'info: ' => $e->getMessage()
            ]);
        }
    }
}
