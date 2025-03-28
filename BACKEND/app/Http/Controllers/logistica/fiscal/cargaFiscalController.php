<?php

namespace App\Http\Controllers\logistica\fiscal;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Response\ResponseApi;
use App\Http\Controllers\logistica\infoReporUserController;
use App\Models\fiscalia\dependencias;

class cargaFiscalController extends Controller
{
    //


    public function cargaFiscal(Request $request)
    {
        $responseApi = new ResponseApi();

        try {
            // Validación: id_dependencia es opcional
            $validation = Validator::make($request->all(), [
                'id_fiscal' => 'nullable',
                'id_dependencia' => 'nullable|exists:dependencias,id',
                'fe_inicio'     => 'nullable|date',
                'fe_fin'        => 'nullable|date',
                'estado'        => 'nullable|boolean',
            ]);
            
            if ($validation->fails()) {
                return $responseApi->error("Error: error en la validacion", 404, $validation->errors());
            }

            $anio = date('Y', strtotime($request->fe_fin));
            $dependenciaId   = $request->id_dependencia;
            $idFiscal  = $request->id_fiscal;
            $fe_inicio = $request->fe_inicio;
            $fe_fin    = $request->fe_fin;
            $estado    = $request->estado;

            $listaFiscalGeneral = DB::select("CALL ObtenerResumenFiscalesPorDependencia(?,?,?,?)", [
                $dependenciaId,
                $fe_inicio,
                $fe_fin,
                $estado,
            ]);

            $data = [
                'dataReport'  => $this->infoReport($request),
                'list_user'   => $listaFiscalGeneral?:null,
                'hoja_fiscal' => $this->carga($dependenciaId,$fe_inicio,$fe_fin,$estado,$anio,$idFiscal),
            ];

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
    private function carga($dependenciaId, $fe_inicio, $fe_fin, $estado, $anio, $idFiscal)
    {

        $generalFiscal = DB::select("CALL ObtenerResumenFiscal(?,?,?)", [
            $idFiscal,
            $fe_inicio,
            $fe_fin,
        ]);

        $añioFiscal = DB::select("CALL ObtenerResumenPorAnioFiscal(?,?,?)", [
            $idFiscal,
            $fe_inicio,
            $fe_fin,

        ]);

        $cantidadEstadoFiscal = DB::select("CALL ObtenerResumenCondicionPorFiscal(?,?,?)", [
            $idFiscal,
            $fe_inicio,
            $fe_fin,
        ]); /////////////////////

        $mesCarga = DB::select("CALL ObtenerResumenCondicionPorFiscalUltimoMes(?)", [
            $idFiscal
        ]); /////////////////////

        $mesAnioCarga = DB::select("CALL ObtenerResumenMensualPorAnioFiscal(?,?)", [
            $idFiscal,
            $anio,
        ]); /////////////////////

        $depen = dependencias::find($dependenciaId);

        return [
            'depen_nombre' => $depen ? $depen->fiscalia : null,
            'general_fiscal' => $generalFiscal,
            'anioFiscal' => $añioFiscal,
            'cant_estado_fiscal' => $cantidadEstadoFiscal,
            'mes_actual_carga' => $mesCarga,
            'meses_caga' => $mesAnioCarga,
        ];
    }


    private function infoReport($request)
    {

        $infoReporte = new infoReporUserController();
        $user = $infoReporte->ipUser($request);
        $codeRepor = $infoReporte->codeReport("CF");

        return [
            'code_report' => $codeRepor,
            'info_user' => $user,
        ];
    }
}
