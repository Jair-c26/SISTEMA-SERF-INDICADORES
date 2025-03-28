<?php

namespace App\Http\Controllers\importExcel;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\archivos\archivos;
use App\Models\archivos\Carpetas;
use App\Imports\CargaFiscalImport;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Response\ResponseApi;

use function Illuminate\Log\log;

class importCargaFiscalController extends Controller
{
    //
    public function importExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls',
        ]);

        $file = $request->file('file');

        $import = new CargaFiscalImport();
        Excel::import($import, $file);

        $url = $this->minioStorage($file);

        return response()->json([
            'status' => 'success',
            'url' => $url,
            'data' => $import->getData(),

        ]);
    }


    private function minioStorage($file): string
    {

        // Generar el nombre del archivo: "lista de usuarios-{nombre_usuario}-{fecha actual}"
        $userName = auth()->user()->nombre ?? null; // Ajustar según cómo obtienes el nombre del usuario
        $uuidUser = auth()->user()->uuid ?? null;
        $nombre_modificado = str_replace(" ", "_", trim($userName));
        $currentDate = now()->format('d-m-Y_H-i-s'); // Fecha con formato seguro para nombres de archivo
        $random = Str::random(20);
        $fileName = "carga-{$nombre_modificado}-{$currentDate}-{$random}." . $file->getClientOriginalExtension();

        // Obtener el contenido del excel
        $fileContent = file_get_contents($file->getRealPath());

        $urlCarpeta = Carpetas::where("nombre_carp", 'CARGA LABORAL')->first();  ///TODO: cambiar si cambia el nombre de la carpeta 

        $nombrecarpeta =  str_replace(' ', '_', strtolower($urlCarpeta->nombre_carp));

        // Guardar el archivo en el sistema de almacenamiento predeterminado
        $path = 'INDICADORES/reportes/' . $nombrecarpeta . '/' . $nombre_modificado . '_' . $uuidUser . '/' . $fileName;
        Storage::disk('minio-public')->put($path, $fileContent);

        $url = env('AWS_URL') . '/' . env('AWS_BUCKET_PUBLIC') . '/' . $path;

        $this->archivosRegister($url,$fileName,$file,$urlCarpeta->id);

        return $url;
    }


    
    private function archivosRegister($url, $fileName, $file, $carpetaId)
    {
        $responseApi = new ResponseApi();
    
        try {
            // Generar un código único para el archivo
            $codigo = 'ARCH-' . strtoupper(Str::random(10));
    
            // Obtener el peso del archivo en KB
            $fileSizeKB = round($file->getSize() / 1024, 2).' kb';
    
            // Crear los datos del archivo
            
            $datosArchivo = [
                'codigo' => $codigo,
                'nombre' => $fileName,
                'peso_arch' => $fileSizeKB,
                'tipo_arch' => $file->getClientOriginalExtension(), // Obtener tipo de archivo real
                'url_archivo' => $url,
                'user_fk' => auth()->user()->id,
                'carpeta_fk' => $carpetaId,
            ];
    
            // Registrar el archivo en la base de datos
            $archivo = archivos::create($datosArchivo);

            if (!$archivo) {
                Log::error([
                    'error: ' =>" error en la creacion",
                    'data' => $archivo
                ]);
            }
    
            return $responseApi->success('Archivo creado con éxito', 201, $archivo);
            
        } catch (\Exception $e) {
            Log::error([
                'Error en la creación de aarchivos: ' => $e->getMessage(),
                'data: ' => $datosArchivo??null
        ]);
            return $responseApi->error('Error al crear archivo: ' . $e->getMessage(), 500);
        }
    }
}
