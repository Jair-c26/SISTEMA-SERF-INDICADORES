<?php

namespace App\Http\Controllers\logistica\controlPlazos;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\fiscalia\dependencias;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Response\ResponseApi;
use App\Http\Controllers\logistica\infoReporUserController;

class plazosDependenciaController extends Controller
{
    public function plazoDependencia(Request $request)
    {
        $responseApi = new ResponseApi();

        try {
            $validation = Validator::make($request->all(), [
                'id_sedes' => 'nullable',
                'fe_inicio' => 'nullable|date',
                'fe_fin' => 'nullable|date',
                'estado' => ' nullable|boolean',
                'id_dependencia' => 'nullable|exists:dependencias,id'
            ]);

            if ($validation->fails()) {
                $responseApi->error("Error: error en la validacion", 404, $validation->errors());
            }

            //dd("hasta aqui");
            $fe_inicio = $request->fe_inicio;
            $fe_fin    = $request->fe_fin;
            $estado    = $request->estado;
            $infoReport = $this->infoReport($request);

            // Si se envía un id_dependencia, se procesa solo esa dependencia :D
            if ($request->filled('id_dependencia')) {
                $dep = dependencias::find($request->id_dependencia);
                if ($dep->plazo == true) {
                    $dataDependencia = $this->obtenerDatosCarga($dep->id, $fe_inicio, $fe_fin, $estado);
                    $listDEspchos = DB::select('CALL ObtenerDespachosPorDependenciaConPlazo(?)', [$request->id_dependencia]);
                    $data = [
                        'info_reporte' => $infoReport,
                        'list_despchios' => $listDEspchos,
                        'dependencias' => [
                            [
                                'Nombre'             => $dep->fiscalia,
                                'codigo'             => $dep->cod_depen,
                                'estado'             => $dep->activo,
                                'data_general_carga' => $dataDependencia
                            ]
                        ]
                    ];
                }

            } else {
                // Se listan todas las dependencias activas
                //$allDependencias = dependencias::where('activo', true)->where('plazo', true)->get();
                $allDependencias = dependencias::where([
                    'activo'=> true,
                    'plazo'=> true
                ])->get();

                $dependenciasArray = [];

                foreach ($allDependencias as $dep) {
                    $dataDependencia = $this->obtenerDatosCarga($dep->id, $fe_inicio, $fe_fin, $estado);


                    $dependenciasArray[] = [
                        'Nombre'             => $dep->fiscalia,
                        'codigo'             => $dep->cod_depen,
                        'estado'             => $dep->activo,
                        'data_general_carga' => $dataDependencia
                    ];
                }
                $listDEspchos = DB::select('CALL ObtenerDespachosPorDependenciaConPlazo(NULL)');

                $data = [
                    'info_reporte' => $infoReport,
                    'list_despchios' => $listDEspchos,
                    'dependencias' => $dependenciasArray
                ];
            }

            return $responseApi->success("Carga dependencias", 200, $data);
        } catch (Exception $e) {
            return $responseApi->error("Error: error en la api de carga laboral en dependencia: -" . $e->getMessage(), 404);
        }

        $dataDependencia = [
            ''
        ];

        $data = [
            'dataReport' => $infoRepor,
            'list_despachos' => $listdependencia,

        ];
    }



    private function obtenerDatosCarga($dependenciaId, $fe_inicio, $fe_fin, $estado)
    {
        $generalDependencia = DB::select("CALL ObtenerResumenPlazosDependencias(?,?,?,?)", [ //listo
            $dependenciaId,
            $fe_inicio,
            $fe_fin,
            $estado,
        ]);

        $listaFiscalGeneral = DB::select("CALL ObtenerResumenColoresPorFiscal(?,?,?,?)", [ //// listo
            $dependenciaId,
            $fe_inicio,
            $fe_fin,
            $estado,
        ]);

        $plazoDependencia = DB::select("CALL ObtenerDatosDependenciaConColores(?,?,?)", [ ///// listo
            $dependenciaId,
            $fe_inicio,
            $fe_fin,
        ]);

        $listFiscalesPlazo = DB::select("CALL ObtenerFiscalesConPlazos(?,?,?,?)", [ /// listo
            $dependenciaId,
            $fe_inicio,
            $fe_fin,
            $estado,
        ]);

        $añiosPlazos = DB::select("CALL ObtenerColoresPorAnioDependencia(?,?,?)", [ // listo
            $dependenciaId,
            $fe_inicio,
            $fe_fin,
        ]);

        $etapaPlazos = DB::select("CALL ObtenerResumenColoresPorEtapa(?,?,?)", [ // listo de estar solito xd
            $dependenciaId,
            $fe_inicio,
            $fe_fin,
        ]);

        $depen = dependencias::find($dependenciaId);

        return [
            'general_dependencia'   => $generalDependencia,
            'lista_general_fiscal'  => $listaFiscalGeneral,
            'plazo_general_dependencia'     => $plazoDependencia,
            'list_fiscal_plazo'         => $listFiscalesPlazo,
            'dependencia'         => $depen->fiscalia,
            'anios_plazos'        => $añiosPlazos,
            'etapa_plazos'        => $etapaPlazos,
        ];
    }


    /*
    ** estos son las funciones de info de reporte generado    ***/

    private function infoReport($request)
    {


        $infoReporte = new infoReporUserController();
        $user = $infoReporte->ipUser($request);
        $codeRepor = $infoReporte->codeReport("CP");

        return [
            'code_report' =>$codeRepor,
            'info_user' => $user,
        ];

    }


}
