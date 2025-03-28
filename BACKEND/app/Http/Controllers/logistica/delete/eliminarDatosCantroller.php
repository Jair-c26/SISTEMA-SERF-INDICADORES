<?php

namespace App\Http\Controllers\logistica\delete;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Controllers\importExcel\registroArchivoController;
use App\Models\fiscalia\dependencias;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Response\ResponseApi;
use App\Http\Controllers\logistica\infoReporUserController;

class eliminarDatosCantroller extends Controller
{
    // 

    public function delitoDependencia(Request $request)
    {
        $responseApi = new ResponseApi();

        try {
            // Validación: id_dependencia es opcional
            $validation = Validator::make($request->all(), [
                'id_dependencia' => 'nullable|exists:dependencias,id',
                'idfile'  => 'nullable|exists:archivos,id',
                'condicion' => 'nullable|in:1,2',

            ]);

            if ($validation->fails()) {
                return $responseApi->error("Error: error en la validacion", 404, $validation->errors());
            }

            $idDepen = $request->id_dependencia ?: null;
            $idFile = $request->idfile;
            $condicion    = $request->condicion;

            $dep = dependencias::find($idDepen);
            if ($condicion == 1) {
                // Si se envía un id_dependencia, se procesa solo esa dependencia :D
                if ($dep) {
                    if ($this->eliminarCasosDelitos($idDepen)) {
                        return $responseApi->success("Carga dependencias eliminada", 200, ["nombre: " => $dep->fiscalia]);
                    }

                } else {
                    // Se listan todas las dependencias activas
                    $this->eliminarCasosDelitos($idDepen);
                    return $responseApi->success("Se eliminaron toda la data de dependencia", 200, []);
                }
            } elseif ($condicion == 2) {
                if ($this->eliminarFileDAta($idFile)) {
                    $responseApi->success("Se elimino el archivo exitosamente!...", 200, $dep->fiscalia);
                }
            }
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
    public function eliminarCasosDelitos($dependenciaId)
    {
        $generalDependencia = DB::select("CALL EliminarDatosDependencia(?)", [
            $dependenciaId
        ]);

        return [
            'eliminar'   => $generalDependencia,
        ];
    }


    private function eliminarFileDAta($idFile)
    {
        $refierteArchivo = new registroArchivoController();

        $deleteArchivo = $refierteArchivo->deleteFileAndRecord($idFile);
        if ($deleteArchivo) {
            return true;
        } else {
            return false;
        }
    }
}
