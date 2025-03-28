<?php

namespace App\Http\Controllers\logistica;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\fiscalia\delitos;
use App\Models\fiscalia\dependencias;
use App\Http\Controllers\Response\ResponseApi;
use App\Models\delitos\delitos as DelitosDelitos;

class delitoController extends Controller
{
    public function Detalledelitos($id, $mes, $anio)
    {
        $responseApi = new ResponseApi();

        try {
            // Validar mes y año
            if ($mes < 1 || $mes > 12 || $anio < 2000 || $anio > Carbon::now()->year) {
                return $responseApi->error("Mes o año inválido", 400);
            }

            // Buscar la dependencia por ID
            $dependencia = dependencias::find($id);
            if (!$dependencia) {
                return $responseApi->error("Dependencia no encontrada", 404);
            }

            // Filtrar delitos según mes y año usando el campo 'mes2'
            $delitos = DelitosDelitos::where('dependencia_fk', $id)
                ->whereYear('mes2', $anio)
                ->whereMonth('mes2', $mes)
                ->get();

            if ($delitos->isEmpty()) {
                return $responseApi->error("No se encontraron delitos para el mes y año especificados", 404);
            }

            // Dividir los delitos en mes1 y mes2
            $delitosMes1 = $delitos->filter(function ($delito) {
                return $delito->mes1 !== null;
            });

            $delitosMes2 = $delitos->filter(function ($delito) {
                return $delito->mes2 !== null;
            });

            // Ordenar los delitos por cantidad de manera decreciente
            $delitosMes1 = $delitosMes1->sortByDesc('cantidad1');
            $delitosMes2 = $delitosMes2->sortByDesc('cantidad2');

            // Estructurar la respuesta
            $data = [
                'dependencia' => $dependencia->only(['id', 'cod_depen', 'fiscalia', 'tipo_fiscalia', 'nombre_fiscalia', 'telefono', 'ruc']),
                'delitos_mes1' => $delitosMes1->map(function ($delito) {
                    return [
                        'id' => $delito->id,
                        'delito' => $delito->delito1,
                        'mes' => $delito->mes1,
                        'cantidad' => $delito->cantidad1,
                        'cod_codument' => $delito->cod_codument,
                    ];
                }),
                'delitos_mes2' => $delitosMes2->map(function ($delito) {
                    return [
                        'id' => $delito->id,
                        'delito' => $delito->delito2,
                        'mes' => $delito->mes2,
                        'cantidad' => $delito->cantidad2,
                        'cod_codument' => $delito->cod_codument,
                    ];
                }),
                // Calcular los porcentajes
                'porcentaje' => $delitosMes2->map(function ($delito) use ($delitosMes2) {
                    // Sumar todas las cantidades del mes2 para calcular el total
                    $totalCantidadMes2 = $delitosMes2->sum('cantidad2');

                    // Calcular el porcentaje de cada delito
                    $porcentaje = ($delito->cantidad2 / $totalCantidadMes2) * 100;

                    return [
                        'id' => $delito->id,
                        'delito' => $delito->delito2,
                        'porcentaje' => round($porcentaje, 2),  // Redondeamos el porcentaje a dos decimales
                    ];
                }),
                'ranking' => $delitosMes2->map(function ($delito) {
                    return [
                        'id' => $delito->id,
                        'delito' => $delito->delito2,
                        'mes' => $delito->mes2,
                        'cantidad' => $delito->cantidad2,
                        'cod_codument' => $delito->cod_codument,
                    ];
                }),
                // Grafico lineal con las cantidades de mes1 y mes2
                'graf_lineal' => $delitosMes2->map(function ($delito) {
                    return [
                        'id' => $delito->id,
                        'delito' => $delito->delito2,
                        'cantidad_mes1' => $delito->cantidad1,  // Añadimos cantidad1
                        'cantidad_mes2' => $delito->cantidad2,  // Añadimos cantidad2
                    ];
                }),
            ];

            return $responseApi->success("Delitos encontrados correctamente", 200, $data);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage(), 400);
        }
    }
}
