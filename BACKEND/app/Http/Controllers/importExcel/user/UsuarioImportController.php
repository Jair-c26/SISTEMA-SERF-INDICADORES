<?php

namespace App\Http\Controllers\importExcel\user;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Imports\UsuariosImport;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UsuarioImportController extends Controller
{
    //

    /**
     * Importar usuarios desde un archivo Excel.
     */

    public function import(Request $request)
    {
        // Validar que el archivo sea de tipo Excel
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:xlsx,xls,csv', //|max:2048
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'El archivo no es válido.',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            // Obtener el archivo del request
            $file = $request->file('file');

            // Procesar la importación usando el archivo recibido directamente
            $data = Excel::import(new UsuariosImport, $file); // Usar el archivo directamente

            $boolean = $this->minioStorage($file);

            return response()->json([
                'message' => 'Usuarios importados correctamente.',
                'Storage' => $boolean,
                //'data' => $data
            ], 200);

            //dd($file);
            //return response()->json(['message' => 'Usuarios importados correctamente.'], 200);
        } catch (\Exception $e) {


            return response()->json([
                'message' => 'Hubo un error al importar el archivo.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    private function minioStorage($file)
    {

        try {

            // Generar el nombre del archivo: "lista de usuarios-{nombre_usuario}-{fecha actual}"
            $userName = auth()->user()->nombre ?? null; // Ajustar según cómo obtienes el nombre del usuario
            $uuidUser = auth()->user()->uuid ?? null;
            $nombre_modificado = str_replace(" ", "_", trim($userName));
            $currentDate = now()->format('d-m-Y_H-i-s'); // Fecha con formato seguro para nombres de archivo
            $random = Str::random(20); //agrega seguridad a archivos publicos C:
            $fileName = "Lista_Usuarios-{$nombre_modificado}-{$currentDate}-{$uuidUser}." . $file->getClientOriginalExtension();

            // Obtener el contenido del excel
            $imageContent = file_get_contents($file->getRealPath());

            // Guardar el archivo en el sistema de almacenamiento predeterminado
            $path = 'INDICADORES/RESPALDO_SERF/' . $nombre_modificado . '_' . $uuidUser . '/lista_Users_Excel/' . $fileName;

            //carpeta privada, solo se accede desde el servidor minio para ver la data :v
            Storage::disk('minio-private')->put($path, $imageContent);

            $url = env('AWS_URL') . '/' . env('AWS_BUCKET_PRIVATE') . '/' . $path;

            //$this->archivosRegister($url,$fileName,$file,$urlCarpeta->id);  ///--------------------

            return $url;
        } catch (\Exception $e) {
            //throw $th;

        }
    }
}
