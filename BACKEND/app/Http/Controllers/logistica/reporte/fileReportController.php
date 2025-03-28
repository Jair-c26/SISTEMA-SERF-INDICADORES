<?php

namespace App\Http\Controllers\logistica\reporte;

use Exception;
use Illuminate\Http\Request;
use App\Models\reporte\Reporte;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Response\ResponseApi;
use App\Http\Controllers\importExcel\registroArchivoController;

class fileReportController extends Controller
{
    //
    public function fileMinioReport(Request $request)
    {
        $responseApi = new ResponseApi();

        try {
            // Validar que se envíe un archivo PDF y todos los parámetros necesarios.
            $validation = Validator::make($request->all(), [
                'file'           => 'required|mimes:pdf',
                'cod_report'     => 'required|unique:reporte,id',
                'id_dependencia' => 'required|exists:dependencias,id',
                'tipo_repor'     => 'required|string',
                'fe_inicio'      => 'nullable|date',
                'fe_fin'         => 'nullable|date',
                'estado'         => 'nullable|boolean',
                'condicion'      => 'nullable|string',
                'actividad_fk'   => 'nullable|exists:ips_users,id' // O el nombre de la tabla correspondiente
            ]);

            if ($validation->fails()) {
                return $responseApi->error("Error: error en la validación", 422, $validation->errors());
            }

            // Extraer los datos del request
            $file = $request->file('file');
            $codReport = $request->input('cod_report');
            $idDepen = (int)$request->input('id_dependencia');
            $tipoRepor = $request->input('tipo_repor');
            $fe_inicio = $request->input('fe_inicio'); // Puede ser null
            $fe_fin    = $request->input('fe_fin')?:null;    // Puede ser null
            $estado    = $request->input('estado')?:true;      // Puede ser null o boolean
            $condicion = $request->input('condicion');   // Puede ser null
            $actividad_fk = $request->input('actividad_fk'); // Puede ser null
            // Registrar el archivo en Minio y obtener la URL.
            // Se usa la carpeta "REPORTES" y se utiliza el id_dependencia para obtener la ruta.
            $nombreCarpeta = "REPORTES";
            $urlReporte = $this->registerFile($file, $nombreCarpeta, $idDepen);

            // Generar un código único para el reporte usando la función codeReport del modelo Reporte.
             //= Reporte::codeReport($idDepen, $tipoRepor);

            // Preparar los datos para registrar el reporte.
            $dataReporte = [
                'cod_report'    => $codReport,
                'tipo_repor'    => $tipoRepor,
                'user_fk'       => auth()->user()->id,
                'fe_regis'      => now(),
                'fe_inicio'     => $fe_inicio,
                'fe_fin'        => $fe_fin,
                'estado'        => $estado,
                'condicion'     => $condicion,
                'actividad_fk'  => $actividad_fk,
                'dependencia_fk'=> $idDepen,
            ];

            // Registrar el reporte en la base de datos.
            $reporte = Reporte::create($dataReporte);

            // Armar la respuesta incluyendo los datos del reporte y la URL del archivo.
            $data = [
                'reporte'     => $reporte,
                'url_reporte' => $urlReporte,
            ];

            return $responseApi->success("Reporte guardado", 200, $data);
        } catch (Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage(), 500);
        }
    }

    /**
     * Registra el archivo en Minio utilizando el controlador de registro de archivos.
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @param string $nombreCarpeta
     * @param int $codeDepen  // Aquí se utiliza el id de la dependencia para construir la ruta.
     * @return string URL temporal del archivo almacenado.
     */
    private function registerFile($file, $nombreCarpeta, $codeDepen)
    {
        //$responseApi = new ResponseApi();
        $minioFile = new registroArchivoController();
        try {
            $url = $minioFile->minioStoragePrivate($file, $nombreCarpeta, $codeDepen);
            return $url;
        } catch (Exception $e) {
            throw new Exception("Error al registrar el archivo: " . $e->getMessage());
        }
    }
}
