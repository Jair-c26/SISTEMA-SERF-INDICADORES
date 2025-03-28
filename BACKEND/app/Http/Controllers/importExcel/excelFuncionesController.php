<?php

namespace App\Http\Controllers\importExcel;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Controllers\logistica\delete\eliminarDatosCantroller;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Response\ResponseApi;
use Exception;
use Illuminate\Support\Facades\Storage;

class excelFuncionesController extends Controller
{
    //
    public function importCargaYDeltios(Request $request)
    {
        $responseApi = new ResponseApi();
        //dd("sdsdd");
        try {

            $request->validate([
                'file' => 'required|mimes:xlsx,xls',
                'id_dependencia' => 'nullable|exists:dependencias,id',

            ]);

            if (!$request->hasFile('file')) {
                Log::error('No se recibió el archivo en la solicitud.');
                return response()->json([
                    'message' => 'Error: No se encontró el archivo.',
                    'status'  => 400,
                    'data'    => []
                ], 400);
            }
            $file =  $request->file('file'); ///recuperamos el archivo excel
            $dataExcel = [
                'id_dependencia' => $request->id_dependencia ?? '',
                'tipo_archivo' => 1
            ];

            if ($$request->id_dependencia) {
                # code...
                $delete = new eliminarDatosCantroller();
                $delete->eliminarCasosDelitos($request->id_dependencia); 
            }

            // Realizar la solicitud POST a la API de python
            $response = Http::timeout(300) // 300 segundos = 5 minutos
                ->attach(
                    'file',
                    file_get_contents($request->file('file')->getRealPath()),
                    $request->file('file')->getClientOriginalName()
                )
                ->post('http://python:5000/upload-file', $dataExcel);
            
            // Verificar si la solicitud fue exitosa
            if (!$response->successful()) {
                return response()->json(['error' => 'Hubo un error al subir el archivo'], 500);
            }

            $url = $this->registerFile($file, "CARGA LABORAL", $request->id_dependencia); ///registramos el archivo en minio :D 

            return response()->json([
                'success' => 'Archivo subido correctamente',
                'data' => $response->json(),
                'url_archivo' => $url ?: null
            ], 200);
        } catch (Exception $e) {
            return $responseApi->error("Error en la api." . $e->getMessage());
            //throw $th;
        }
    }



    public function importPlazos(Request $request)
    {
        $responseApi = new ResponseApi();

        try {
            //code...
            $request->validate([
                'file' => 'required|mimes:xlsx,xls|max:2048',
                'id_dependencia' => 'nullable|exists:dependencias,id'
            ]);
            $file =  $request->file('file'); ///recuperamos el archivo excel

            $dataExcel = [
                'id_dependencia' => $request->id_dependencia ?? '',
                'tipo_archivo' => 2
            ];

            // Realizar la solicitud POST a la API de python
            $response = Http::attach(
                'file',
                file_get_contents($request->file('file')->getRealPath()),
                $request->file('file')->getClientOriginalName()
            )->post('http://python:5000/upload-file', $dataExcel);

            // Verificar si la solicitud fue exitosa
            if (!$response->successful()) {
                return response()->json(['error' => 'Hubo un error al subir el archivo'], 500);
            }

            $url = $this->registerFile($file, "CONTROL DE PLAZOS", $request->id_dependencia); ///registramos el archivo en minio :D 

            return response()->json([
                'success' => 'Archivo subido correctamente',
                'data' => $response->json(),
                'url_archivo' => $url ?: null
            ], 200);
        } catch (Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
            //throw $th;
        }
    }

    public function tipoDelitos(Request $request)
    {
        $responseApi = new ResponseApi();
        try {

            $request->validate([
                'file' => 'required|mimes:xlsx,xls|max:2048',
                'id_dependencia' => 'nullable|exists:dependencias,id'
            ]);

            $file =  $request->file('file'); ///recuperamos el archivo excel

            $dataExcel = [
                'id_dependencia' => $request->id_dependencia ?? ''
            ];

            // Realizar la solicitud POST a la API de python
            $response = Http::attach(
                'file',
                file_get_contents($request->file('file')->getRealPath()),
                $request->file('file')->getClientOriginalName()
            )->post('http://python:5000/upload-delitos', $dataExcel);

            // Verificar si la solicitud fue exitosa
            if (!$response->successful()) {
                return response()->json(['error' => 'Hubo un error al subir el archivo'], 500);
            }

            $url = $this->registerFile($file, "DELITOS CON MAYOR INCIDENCIAS", $request->id_dependencia); ///registramos el archivo en minio :D 

            return response()->json([
                'success' => 'Archivo subido correctamente',
                'data' => $response->json(),
                'url_archivo' => $url ?: null
            ], 200);
        } catch (Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }


    private function registerFile($file, $nombreCarpeta, $codeDepen)
    {
        $responseApi = new ResponseApi();
        $minioFile = new registroArchivoController();
        try {
            $urlDelitos = $minioFile->minioStoragePrivate($file, $nombreCarpeta, $codeDepen);

            return $urlDelitos;
        } catch (Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }
}
