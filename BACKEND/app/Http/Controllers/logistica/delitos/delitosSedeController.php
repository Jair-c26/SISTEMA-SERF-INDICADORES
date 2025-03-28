<?php

namespace App\Http\Controllers\logistica\delitos;

use Exception;
use Illuminate\Http\Request;
use App\Models\fiscalia\sedes;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\fiscalia\dependencias;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Response\ResponseApi;
use App\Http\Controllers\logistica\infoReporUserController;

class delitosSedeController extends Controller
{
    public function delitoSedes(Request $request)
    {
        $responseApi = new ResponseApi();

        try {

            //validar segun los requerimientos del sistema, 
            $validation = Validator::make($request->all(), [
                'id_sedes' => 'nullable|exists:sedes,id',
                'fe_inicio' => 'nullable|date',
                'fe_fin' => 'nullable|date',
                'estado' => ' nullable|boolean',
                'id_dependencia' => 'nullable|exists:dependencias,id',
                'cantidadDelitos' => 'nullable'
            ]);

            if ($validation->fails()) {
                $responseApi->error("Error: error en la validacion", 404, $validation->errors());
            }

            /* lsiata de dependencias con los casos ingr, codigo y otros :v */
            $listDependencias = DB::select("CALL ObtenerResumenDependenciasSede(?,?,?,?)", [
                $request->id_sedes,
                $request->fe_inicio,
                $request->fe_fin,
                $request->estado
            ]);

            /* se obtiene un resumen de las sede seleccionada para la cabecera */
            $dataGeneralSede = DB::select('CALL  ObtenerResumenSede(?,?,?,?,?)', [
                $request->id_sedes,
                $request->id_dependencia, // se usara para futuras versiones pendiente si es que me contratan xD
                $request->fe_inicio,
                $request->fe_fin,
                $request->estado
            ]);

            //////////////////*************************************** */

            try {
                //code...
                $sedeID = $request->id_sedes;
                $fe_inicio = $request->fe_inicio;
                $fe_fin    = $request->fe_fin;
                $estado    = $request->estado;
                $cantDelito = $request->cantidadDelitos;

                if ($request->filled('id_sedes')) {
                    $sede = sedes::find($request->id_sedes);
                    $allDependencias = dependencias::where([
                        'activo' => true,
                        'delitos' => true,
                        'sede_fk' => $request->id_sedes,
                    ])->get();

                    //dd($allDependencias);
                    $depenAllDeli = [];

                    foreach ($allDependencias as $depen) {

                        $deli = DB::select("CALL ObtenerTopDelitosPorDependencia(?,?,?,?,?)", [
                            $depen->id,
                            $fe_inicio,
                            $fe_fin,
                            $estado,
                            $cantDelito,
                        ]);

                        $depenAllDeli[] = [
                            'n_depen'   => $depen->fiscalia,
                            'cod_depen' => $depen->cod_depen,
                            'delitos' => $deli,
                        ];
                    }

                    $listsede = [
                        'nombre_sede' => $sede->nombre,
                        'cod_sede' => $sede->cod_sede,
                        'depen_all_deli' => $depenAllDeli,
                    ];

                    $data = [
                        'list_dependencia' => $listDependencias,
                        'general_sede' => $dataGeneralSede,
                        'list_sedes_dependencia' => $listsede
                    ];

                    return $responseApi->success('lista delitos por sedes', 200, $data);
                } else {
                    //dd("no se enasdd");

                    $sedeAll = sedes::all();
                    $listSede = [];
                    $depenAllDeli = [];
                    foreach ($sedeAll as $sed) {

                        $allDependencias = dependencias::where([
                            'activo' => $estado,
                            'delitos' => true,
                            'sede_fk' => $sed->id,
                        ])->get();

                        //dd($allDependencias);
                        

                        foreach ($allDependencias as $depen) {
                            $deli = DB::select("CALL ObtenerTopDelitosPorDependencia(?,?,?,?,?)", [
                                $depen->id,
                                $fe_inicio,
                                $fe_fin,
                                $estado,
                                $cantDelito,
                            ]);

                            $depenAllDeli[] = [
                                'n_depen'   => $depen->fiscalia,
                                'cod_depen' => $depen->cod_depen,
                                'delitos' => $deli,
                            ];
                        }
                        $listSede[] = [
                            'nombre_sede' => $sed->nombre,
                            'cod_sede' => $sed->cod_sede,
                            'depen_all_deli' => $depenAllDeli,
                        ];
                    }

                    $data = [
                        'dataReport' => $this->infoReport($request),
                        'list_dependencia' => $listDependencias,
                        'general_sede' => $dataGeneralSede,
                        'list_sedes_dependencia' => $listSede
                    ];

                    return $responseApi->success('lista delitos por sedes', 200, $data);
                }
            } catch (Exception $th) {

                return $responseApi->error("Error en la api delitos. " . $th->getMessage());
                //throw $th;
            }
            
        } catch (Exception $e) {
            $responseApi->error('Error: salio mal en la consulta de carga sedes' . $e->getMessage());
        }
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

    private function obtenerDelitos() {}
}
