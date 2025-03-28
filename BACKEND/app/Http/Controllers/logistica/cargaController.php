<?php

namespace App\Http\Controllers\logistica;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\fiscalia\dependencias;
use App\Http\Controllers\Response\ResponseApi;

class cargaController extends Controller
{
    //
    public function cargaLaboral($id, $mes, $anio)
    {
        $responseApi = new ResponseApi();

        try {
            // Validar mes y año
            if ($mes < 1 || $mes > 12 || $anio < 2000 || $anio > Carbon::now()->year) {
                return $responseApi->error("Mes o año inválido", 400);
            }

            // Buscar la dependencia por ID con sus despachos y aplicar el filtro en cargaFilcal
            $dependencia = dependencias::with([
                'despachos.fiscales.cargaFilcal' => function ($query) use ($mes, $anio) {
                    $query->whereMonth('fecha_inicio', $mes)
                        ->whereYear('fecha_inicio', $anio);
                }
            ])->find($id);

            if (!$dependencia) {
                return $responseApi->error("Dependencia no encontrada", 404);
            }

            // Contar el número de despachos
            $cantDespachos = $dependencia->despachos->count();

            // Calcular totales y generar estructura de datos
            $totalTramitesHistoricos = $dependencia->despachos->flatMap(function ($despacho) {
                return $despacho->fiscales->flatMap(function ($fiscal) {
                    return $fiscal->cargaFilcal->pluck('tramitesHistoricos');
                });
            })->sum();

            $data = [
                'dependencia' => array_merge(
                    $dependencia->only(['id', 'cod_depen', 'fiscalia', 'tipo_fiscalia', 'nombre_fiscalia', 'telefono', 'ruc']),
                    ['cant_despachos' => $cantDespachos]
                ),
                'despachos' => $dependencia->despachos->map(function ($despacho) {
                    return [
                        'id' => $despacho->id,
                        'cod_despa' => $despacho->cod_despa,
                        'nombre_despacho' => $despacho->nombre_despacho,
                        'telefono' => $despacho->telefono,
                        'ruc' => $despacho->ruc,
                        'fiscales' => $despacho->fiscales->map(function ($fiscal) {
                            return [
                                'id' => $fiscal->id,
                                'cod_fiscal' => $fiscal->cod_fiscal,
                                'nombres_f' => $fiscal->nombres_f,
                                'carga' => $fiscal->cargaFilcal->map(function ($carga) {
                                    return [
                                        'resulHistorico' => $carga->resulHistorico,
                                        'resultado' => $carga->resultado,
                                        'tramitesHistoricos' => $carga->tramitesHistoricos,
                                        'tramites' => $carga->tramites,
                                        'ingreso' => $carga->ingreso,
                                        'fecha_inicio' => $carga->fecha_inicio,
                                        'fecha_fin' => $carga->fecha_fin,
                                        'codigo_doc' => $carga->codigo_doc,
                                    ];
                                }),
                            ];
                        }),
                    ];
                }),
                'grafico_linea' => $dependencia->despachos->flatMap(function ($despacho) {
                    return $despacho->fiscales->map(function ($fiscal) {
                        return [
                            'fiscal_id' => $fiscal->id,
                            'nombre' => $fiscal->nombres_f,
                            'cod_fiscal' => $fiscal->cod_fiscal,
                            'carga' => $fiscal->cargaFilcal->map(function ($carga) {
                                return [
                                    'resulHistorico' => $carga->resulHistorico,
                                    'resultado' => $carga->resultado,
                                    'tramitesHistoricos' => $carga->tramitesHistoricos,
                                    'tramites' => $carga->tramites,
                                    'ingreso' => $carga->ingreso,
                                    'fecha_inicio' => $carga->fecha_inicio,
                                    'fecha_fin' => $carga->fecha_fin,
                                    'codigo_doc' => $carga->codigo_doc,
                                ];
                            }),
                        ];
                    });
                }),
                'cantidad_casos' => [
                    'total_resueltos_historicos' => $dependencia->despachos->flatMap(function ($despacho) {
                        return $despacho->fiscales->flatMap(function ($fiscal) {
                            return $fiscal->cargaFilcal->pluck('resulHistorico');
                        });
                    })->sum(),
                    'total_ingresados' => $dependencia->despachos->flatMap(function ($despacho) {
                        return $despacho->fiscales->flatMap(function ($fiscal) {
                            return $fiscal->cargaFilcal->pluck('ingreso');
                        });
                    })->sum(),
                    'total_tramites_historicos' => $totalTramitesHistoricos,
                ],
                'porcentajes_circulo' => $dependencia->despachos->flatMap(function ($despacho) use ($totalTramitesHistoricos) {
                    return $despacho->fiscales->map(function ($fiscal) use ($totalTramitesHistoricos) {
                        $tramitesFiscal = $fiscal->cargaFilcal->sum('tramitesHistoricos');
                        return [
                            'fiscal_id' => $fiscal->id,
                            'nombre' => $fiscal->nombres_f,
                            'porcentaje_tramites' => $totalTramitesHistoricos > 0 ? ($tramitesFiscal / $totalTramitesHistoricos) * 100 : 0,
                        ];
                    });
                }),
                'productividad_fiscal' => $dependencia->despachos->mapWithKeys(function ($despacho) {
                    return [
                        "despacho_{$despacho->id}" => [
                            'nombre_despacho' => $despacho->nombre_despacho,
                            'fiscales' => $despacho->fiscales->map(function ($fiscal) {
                                $totalResueltos = $fiscal->cargaFilcal->sum('resultado');
                                $metaEstablecida = 30; // Cambiar si la meta es dinámica
                                return [
                                    'fiscal_id' => $fiscal->id,
                                    'nombre' => $fiscal->nombres_f,
                                    'productividad' => $metaEstablecida > 0 ? ($totalResueltos / $metaEstablecida) * 100 : 0,
                                ];
                            }),
                        ]
                    ];
                }),
            ];

            // Retornar la respuesta
            return $responseApi->success("Datos cargados correctamente", 200, $data);
        } catch (\Exception $e) {
            // Manejar cualquier excepción y retornar un error
            return $responseApi->error("Error: " . $e->getMessage(), 400);
        }
    }


}
