<?php

namespace App\Http\Controllers\importExcel;

use Exception;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\archivos\archivos;
use App\Models\archivos\Carpetas;
use Illuminate\Support\Facades\URL;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Response\ResponseApi;
use App\Models\fiscalia\dependencias;

class registroArchivoController extends Controller
{
    //

    public function minioStorage($file, $nombreCarpeta, $codeDepen): string
    {
        // Generar el nombre del archivo: "lista de usuarios-{nombre_usuario}-{fecha actual}"
        //$uuidUser = auth()->user()->uuid ?? null;
        $userName = auth()->user()->nombre ?? null; // Ajustar según cómo obtienes el nombre del usuario
        $uuidUser = auth()->user()->uuid ?? null;
        $nombre_modificado = str_replace(" ", "_", trim($userName));
        $currentDate = now()->format('d-m-Y_H-i-s'); // Fecha con formato seguro para nombres de archivo
        $random = Str::random(20);
        $fileName = "-{$nombre_modificado}-{$currentDate}-{$random}." . $file->getClientOriginalExtension();

        // Obtener el contenido del excel
        $fileContent = file_get_contents($file->getRealPath());

        //$rutaCarpeta = 'reportes/' . $tipoRepor->id . '-' . str_replace(' ', '_', strtolower($reporte['nombre']));

        $urlCarpeta = Carpetas::where("nombre_carp", $nombreCarpeta)->first();  ///TODO: cambiar si cambia el nombre de la carpeta 
        $nombrecarpeta =  str_replace(' ', '_', strtolower($urlCarpeta->nombre_carp));

        // Guardar el archivo en el sistema de almacenamiento predeterminado
        $path = 'INDICADORES/LOGISTICA/' . $nombrecarpeta . '/' . $nombre_modificado . '_' . $uuidUser . '/' . $fileName;
        Storage::disk('minio-public')->put($path, $fileContent);

        $url = env('AWS_URL') . '/' . env('AWS_BUCKET_PUBLIC') . '/' . $path;


        // Registrar el archivo en la base de datos, pasando también el $path
        $this->archivosRegister($url, $fileName, $file, $urlCarpeta->id, $path);

        return $url;
    }

    public function minioStoragePrivate($file, $nombreCarpeta, $codeDepen): string
    {
        // Obtener el nombre del usuario autenticado (si aplica)
        $userName = auth()->user()->nombre ?? 'invitado';
        $uuidUser = auth()->user()->uuid ?? null; // Puedes asignar el UUID si lo requieres
        $nombre_modificado = str_replace(" ", "_", trim($userName));
        $currentDate = now()->format('d-m-Y_H-i-s'); // Fecha en formato seguro
        $random = Str::random(40);
        $Depen = dependencias::find($codeDepen);
        $fileName = " {$Depen->cod_depen}-{$nombre_modificado}-{$currentDate}-{$random}." . $file->getClientOriginalExtension();

        // Obtener el contenido del archivo
        $fileContent = file_get_contents($file->getRealPath());

        // Buscar la carpeta en base al nombre (suponiendo que Carpetas es un modelo)
        $urlCarpeta = Carpetas::where("nombre_carp", $nombreCarpeta)->first();
        if (!$urlCarpeta) {
            throw new \Exception("La carpeta '$nombreCarpeta' no existe.");
        }
        $nombrecarpeta = str_replace(' ', '_', strtolower($urlCarpeta->nombre_carp));

        // Definir la ruta donde se guardará el archivo en el bucket privado
        $path = 'INDICADORES/LOGISTICA/' . $nombrecarpeta . '/' . $nombre_modificado . '_' . $uuidUser . '/' . $fileName;

        // Guardar el archivo en el bucket privado
        Storage::disk('minio-private')->put($path, $fileContent);

        // Generar la URL temporal (la construcción se hará con buildTemporaryUrlsUsing)
        $url = URL::temporarySignedRoute(
            'files.download',        // nombre de la ruta que definiste
            now()->addMinutes(60),   // tiempo de expiración (60 minutos)
            ['path' => $path]        // parámetros adicionales que se incluirán en la URL
        );

        // Registrar el archivo en la base de datos, pasando también el $path
        $this->archivosRegister($url, $fileName, $file, $urlCarpeta->id, $path);

        return $url;
    }

    private function archivosRegister($url, $fileName, $file, $carpetaId, $filePath)
    {
        $responseApi = new ResponseApi();

        try {
            // Generar un código único para el archivo
            $codigo = 'ARCH-' . strtoupper(Str::random(10));

            // Obtener el peso del archivo en KB
            $fileSizeKB = round($file->getSize() / 1024, 2) . ' kb';

            // Crear los datos del archivo, incluyendo el file_path
            $datosArchivo = [
                'codigo'      => $codigo,
                'nombre'      => $fileName,
                'peso_arch'   => $fileSizeKB,
                'tipo_arch'   => $file->getClientOriginalExtension(),
                'url_archivo' => $url,
                'file_path'   => $filePath,      // Guardamos la ruta interna del archivo
                'user_fk'     => auth()->user()->id,
                'carpeta_fk'  => $carpetaId,
            ];

            // Registrar el archivo en la base de datos
            $archivo = archivos::create($datosArchivo);

            return $responseApi->success('Archivo creado con éxito', 201, $archivo);
        } catch (\Exception $th) {
            return $responseApi->error('Error al crear archivo: ' . $th->getMessage(), 500);
        }
    }


    //////////////eliminar el ARCHIVO CON SU REGISTRO /////////////////////////////////

    public function deleteFileAndRecord(int $archivoId)
    {
        $responseApi = new ResponseApi();

        try {
            $archivo = archivos::find($archivoId);
            if (!$archivo) {
                return $responseApi->error('Archivo no encontrado', 404);
            }

            // Elimina el archivo desde MinIO (usando el campo file_path almacenado)
            if (Storage::disk('minio-private')->exists($archivo->file_path)) {
                Storage::disk('minio-private')->delete($archivo->file_path);
            }

            // Elimina el registro en la base de datos
            $archivo->delete();

            //return $responseApi->success('Archivo y registro eliminados correctamente', 200, $archivo);
        } catch (\Exception $e) {
            return $responseApi->error('Error: ' . $e->getMessage(), 500);
        }
    }
}
