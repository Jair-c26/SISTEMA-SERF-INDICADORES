<?php

namespace App\Http\Controllers\logistica\delitos;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\fiscalia\dependencias;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Response\ResponseApi;
use App\Http\Controllers\logistica\infoReporUserController;

class delitosDependenciaController extends Controller
{

    public function delitoDependencia(Request $request)
    {
        $responseApi = new ResponseApi();

        try {
            // Validación: id_dependencia es opcional
            $validation = Validator::make($request->all(), [
                'id_sedes' => 'nullable|exists:sedes,id',
                'id_dependencia' => 'nullable|exists:dependencias,id',
                'fe_inicio'     => 'nullable|date',
                'fe_fin'        => 'nullable|date',
                'estado'        => 'nullable|boolean',
                'cantidadDelitos'      => 'nullable',
                'cantidadAnio' => 'nullable'
            ]);

            if ($validation->fails()) {
                return $responseApi->error("Error: error en la validacion", 404, $validation->errors());
            }

            $fe_inicio = $request->fe_inicio;
            $fe_fin    = $request->fe_fin;
            $estado    = $request->estado;
            $cantidad  = $request->cantidadDelitos;
            $cantidadAnio =$request->cantidadAnio;

            // Si se envía un id_dependencia, se procesa solo esa dependencia :D
            if ($request->filled('id_dependencia')) {
                $dep = dependencias::find($request->id_dependencia);

                if ($dep->carga == true) {
                    $dataDependencia = $this->obtenerDatosDelito($dep->id, $fe_inicio, $fe_fin, $estado,$cantidad, $cantidadAnio);
                    $listDEspchos = DB::select('CALL ObtenerDespachosPorDependencia(?)', [$request->id_dependencia]);

                    $data = [
                        'list_despchios' => $listDEspchos,
                        'dependencias' => [
                            [
                                'Nombre'             => $dep->fiscalia,
                                'codigo'             => $dep->cod_depen,
                                'estado'             => $dep->activo,
                                'data_general_delito' => $dataDependencia
                            ]
                        ]
                    ];
                }
            } else {
                // Se listan todas las dependencias activas
                $allDependencias = dependencias::where([
                    'activo' => true,
                    'carga' => true
                ])->get();
                $dependenciasArray = [];

                foreach ($allDependencias as $dep) {
                    $dataDependencia = $this->obtenerDatosDelito($dep->id, $fe_inicio, $fe_fin, $estado,$cantidad, $cantidadAnio);


                    $dependenciasArray[] = [
                        'Nombre'             => $dep->fiscalia,
                        'codigo'             => $dep->cod_depen,
                        'estado'             => $dep->activo,
                        'data_general_delito' => $dataDependencia
                    ];
                }
                $listDEspchos = DB::select('CALL ObtenerDespachosPorDependencia(NULL)');

                $data = [
                    'dataReport' => $this->infoReport($request),
                    'list_despchios' => $listDEspchos,
                    'dependencias' => $dependenciasArray
                ];
            }

            return $responseApi->success("Carga dependencias", 200, $data);
        } catch (Exception $e) {
            return $responseApi->error("Error: error en la api de carga laboral en dependencia: -" . $e->getMessage(), 404);
        }
    }

    /**
     * Función que obtiene todos los datos de carga para una dependencia dada.
     *
     * @param int $dependenciaId
     * @param string|null $fe_inicio
     * @param string|null $fe_fin
     * @param bool|null $estado
     * @return array
     */
    private function obtenerDatosDelito($dependenciaId, $fe_inicio, $fe_fin, $estado,$cantidad,$cantidadAnio)
    {
        $generalDependencia = DB::select("CALL ObtenerResumenDependencias(?,?,?,?)", [
            $dependenciaId,
            $fe_inicio,
            $fe_fin,
            $estado,
        ]);

        $listaFiscalGeneral = DB::select("CALL ObtenerResumenFiscalesPorDependencia(?,?,?,?)", [
            $dependenciaId,
            $fe_inicio,
            $fe_fin,
            $estado,
        ]);
        
        $topDeliDepen = DB::select("CALL ObtenerTopDelitosPorDependencia(?,?,?,?,?)", [
            $dependenciaId,
            $fe_inicio,
            $fe_fin,
            $estado,
            $cantidad,
        ]);

        $deliPorcentaje = DB::select("CALL ObtenerTopDelitosPorDependenciaConPorcentaje(?,?,?,?,?)", [
            $dependenciaId,
            $fe_inicio,
            $fe_fin,
            $estado,
            $cantidad,
        ]); 

        $deliAnio = DB::select("CALL ObtenerTopDelitosPorAnioDependencia(?,?,?,?)", [
            $dependenciaId,
            $fe_inicio,
            $fe_fin,
            $cantidadAnio,
        ]);/////////////////////


        return [
            'general_dependencia'   => $generalDependencia,
            'lista_general_fiscal'  => $listaFiscalGeneral,
            'delitos_por_dependencia'     => $topDeliDepen,
            'delitos_porcentaje'         => $deliPorcentaje,
            'delitos_anios'        => $deliAnio,
        ];
    }

    
    private function infoReport($request)
    {

        $infoReporte = new infoReporUserController();
        $user = $infoReporte->ipUser($request);
        $codeRepor = $infoReporte->codeReport("CD");

        return [
            'code_report' =>$codeRepor,
            'info_user' => $user,
        ];

    }
}
