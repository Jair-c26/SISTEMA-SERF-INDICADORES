<?php

namespace App\Http\Controllers\logistica\reporte;

use Carbon\Carbon;
use Dompdf\Dompdf;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\fiscalia\sedes;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\fiscalia\dependencias;
use Picqer\Barcode\BarcodeGeneratorPNG;
use App\Http\Controllers\Response\ResponseApi;

class reporteCargaController extends Controller
{
    /**
     * Generar reporte de carga fiscal en PDF.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function generarReporte($id, $mes, $anio, $uuid)
    {

        try {
            //code...

            $responseApi = new ResponseApi();

            $user = User::where('uuid', $uuid)->first();
            //dd($uuid);
            if (is_null($user ?? null)) {
                return $responseApi->success('Usuario inválido!.', 404, "");
            }

            // Validar mes y año
            if ($mes < 1 || $mes > 12 || $anio < 2000 || $anio > Carbon::now()->year) {
                return response()->json(['error' => 'Mes o año inválido'], 400);
            }

            // Obtener la dependencia con sus despachos, fiscales y cargas fiscales filtradas
            $dependencia = dependencias::with(['despachos.fiscales.cargaFilcal' => function ($query) use ($mes, $anio) {
                $query->whereMonth('fecha_inicio', $mes)->whereYear('fecha_inicio', $anio);
            }])->find($id);

            if (!$dependencia) {
                return response()->json(['error' => 'Dependencia no encontrada'], 404);
            }
            $sede = sedes::find($dependencia->sede_fk);

            // Extraer fechas de "cargaFilcal"
            $fechas = $dependencia->despachos->flatMap(function ($despacho) {
                return $despacho->fiscales->flatMap(function ($fiscal) {
                    return $fiscal->cargaFilcal->map(function ($carga) {
                        return [
                            'fecha_inicio' => $carga->fecha_inicio,
                            'fecha_fin' => $carga->fecha_fin,
                        ];
                    });
                });
            });

            $primeraCarga = $fechas->first();
            $fechaInicio = $primeraCarga['fecha_inicio'] ?? null;
            $fechaFin = $primeraCarga['fecha_fin'] ?? null;

            //$user = auth()->user();
            $currentDateTime = Carbon::now()->format('Y-m-d H:i:s');
            $ipAddress = request()->ip();

            // Generar el código de barras dinámico
            $generator = new BarcodeGeneratorPNG();
            $codigoBarras = 'DEP-' . $id; // Genera un identificador único, por ejemplo, basado en la dependencia
            $barcodeBase64 = base64_encode($generator->getBarcode($codigoBarras, $generator::TYPE_CODE_128));

            // Preparar los datos para la vista
            $data = [
                'dependencia' => $dependencia,
                'despachos' => $dependencia->despachos,
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin,
                'mes' => $mes,
                'anio' => $anio,
                'user' => $user,
                'nombre_sede' => $sede->nombre,
                'currentDateTime' => $currentDateTime,
                'ipAddress' => $ipAddress,
                'barcode' => $barcodeBase64, // Agregar el código de barras
                'codigoBarrasTexto' => $codigoBarras, // Texto del código de barras
            ];

            // Verificar si el usuario está autenticado antes de proceder
            /*
            if (!$user) {
                return response()->json(['error' => 'No autorizado'], 401); // Retornar error si no está autenticado
                }
                */
            // Renderizar la vista en HTML
            $html = view('report.reportCarga', compact('data'))->render();


            // Loguear el HTML generado
            //Log::info($html);
            //dd($data);

            if (empty($html)) {
                return response()->json(['error' => 'El HTML está vacío'], 500);
            }


            // Configuración de Dompdf
            $dompdf = new Dompdf(['isRemoteEnabled' => true]);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            // Configuración del pie de página dinámico
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

            

            // Descargar el PDF o mostrarlo en el navegador
            return $dompdf->stream("reporte_carga_fiscal.pdf", ["Attachment" => false]);
        } catch (\Throwable $e) {
            //throw $th;

            Log::error('Error al generar el PDF: ' . $e->getMessage());
            return response()->json(['error' => 'Error al generar el PDF'], 500);
        }
    }
}
