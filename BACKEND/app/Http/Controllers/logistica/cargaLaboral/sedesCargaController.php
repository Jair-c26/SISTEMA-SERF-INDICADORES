<?php

namespace App\Http\Controllers\logistica\cargaLaboral;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\fiscalia\dependencias;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Response\ResponseApi;
use App\Http\Controllers\logistica\infoReporUserController;


class sedesCargaController extends Controller
{
    //
    public function cargaSedes(Request $request){
        $responseApi = new ResponseApi();

        try{
            
            //validar segun los requerimientos del sistema, 
            $validation = Validator::make($request->all(),[ 
                'id_sedes' => 'nullable|exists:sedes,id',
                'fe_inicio' => 'nullable|date',
                'fe_fin' => 'nullable|date',
                'estado' => ' nullable|boolean',
                'id_dependencia' => 'nullable|exists:dependencias,id'
            ]);
            
            if ($validation->fails()) {
                $responseApi->error("Error: error en la validacion",404,$validation->errors());
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
                null, // se usara para futuras versiones pendiente si es que me contratan xD
                $request->fe_inicio,
                $request->fe_fin,
                $request->estado
            ]);
            
            $listaIngresoResueltosDependencias = DB::select("CALL ObtenerCasosPorDependencia(?,?,?,?)",[
                $request->id_sedes,
                'false',// se usara para futuras versiones pendiente gaa :v
                $request->fe_inicio,
                $request->fe_fin,
            ]);
            
            
            $aniosCasos = DB::select("CALL ObtenerCasosPorAnioDependencia(?,?,?)",[
                $request->id_dependencia,
                $request->fe_inicio,
                $request->fe_fin,
            ]);
            $dependencia = dependencias::where('id',$request->id_dependencia )->get(); 
            
            //dd("hasta aqui");

            $rankingDependencias = DB::select("CALL ObtenerTopDependencias(?,?,?)",[
                $request->fe_inicio,
                $request->fe_fin,
                $request->estado
            ]);
            

            //$codeBarras = "CF-123456789115151";
            ////////////
            /* construimos la estructura de la api para la carga de sedes generales :D */
            ///////////
            $data = [
                'dataReport' => $this->infoReport($request),
                //'code_barras' => $codeBarras,
                'list_dependencias' => $listDependencias,
                'data_generalSede' => $dataGeneralSede,
                'graf_ingreso_caso_depens' => $listaIngresoResueltosDependencias,
                'dependencia'=>$dependencia,
                'Casos_año_depen' =>$aniosCasos,
                'ranking_dependencias' => $rankingDependencias,
            ];

            return $responseApi->success("Data",200,$data);

        }
        catch(Exception $e){
            $responseApi->error('Error: salio mal en la consulta de carga sedes'. $e->getMessage());
        }
    }


    private function infoReport($request)
    {

        $infoReporte = new infoReporUserController();
        $user = $infoReporte->ipUser($request);
        $codeRepor = $infoReporte->codeReport("CL");

        return [
            'code_report' =>$codeRepor,
            'info_user' => $user,
        ];

    }

}
