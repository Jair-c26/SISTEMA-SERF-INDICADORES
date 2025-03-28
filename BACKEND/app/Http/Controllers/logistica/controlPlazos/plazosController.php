<?php

namespace App\Http\Controllers\logistica\controlPlazos;

use Exception;
use Nette\Utils\Strings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\fiscalia\dependencias;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Response\ResponseApi;
use App\Http\Controllers\logistica\infoReporUserController;

class plazosController extends Controller
{
    

    public function plazoSede(Request $request)
    {
        $responseApi = new ResponseApi();
        try{
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

            //$dep = dependencias::find($request->id_dependencia);
            //dd("hasta qiu");
            ////////////////////// lista de procedures 
            $listdependencia = DB::select('CALL ObtenerResumenDependenciasConFiscalesRango(?,?,?,?)', [
                $request->id_sede,
                $request->fe_inicio,
                $request->fe_fin,
                $request->estado
            ]);

            $generalSede = DB::select('CALL ObtenerResumenPlazosPorSede(?,?,?);',[
                $request->id_sedes,
                //$request->id_dependencia,
                $request->fe_inicio,
                $request->fe_fin,
                //$request->estado
            ]);
            
            $ListDependenciaColor = DB::select('CALL ObtenerResumenColoresDependencias(?,?,?,?)', [
                $request->id_sedes,
                $request->fe_inicio,
                $request->fe_fin,
                $request->estado
            ]);
            $listAñoDependencia = DB::select('CALL ObtenerResumenColoresPorAnioDependencia(?,?,?)',[
                $request->id_dependencia,
                $request->fe_inicio,
                $request->fe_fin,
            ]);
            
            //dd("sdfsfsf");
            $listDependenciaCantidaPlazo = DB::select('CALL ObtenerPlazosDependencias(?,?,?,?)',[
                $request->id_sedes,
                $request->fe_inicio,
                $request->fe_fin,
                $request->estado
            ]);


            $data = [
                'dataReport' => $this->infoReport($request),
                'list_dependencias'=> $listdependencia,
                'general_sede' =>$generalSede,
                'list_depen_plazo' => $ListDependenciaColor,
                'anios_dependencia_color' =>$listAñoDependencia,
                'list_depen_cantidad' => $listDependenciaCantidaPlazo,
            ];

            return $responseApi->success("Data de plazos",200,$data);

        }catch (Exception $e){
            return $responseApi->error("Error en la api de plazos sedes: ".$e->getMessage());
        }
    }

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
