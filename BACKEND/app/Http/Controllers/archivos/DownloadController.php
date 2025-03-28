<?php

namespace App\Http\Controllers\archivos;

use Illuminate\Http\Request;
use App\Models\archivos\archivos;
use Illuminate\Support\Facades\URL;
use App\Http\Controllers\Controller;

class DownloadController extends Controller
{
    //
/**
     * Genera y retorna una URL temporal para descargar el archivo.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $archivoId
     * @param  int|null  $expiration  Tiempo de expiración en minutos (opcional)
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTemporaryDownloadUrl(Request $request, $archivoId, $expiration = null)
    {
        // Buscar el archivo en la base de datos
        $archivo = archivos::find($archivoId);

        //dd("fsfdffsfdfsfdsfsf");
        if (!$archivo) {
            return response()->json(['error' => 'Archivo no encontrado'], 404);
        }

        // Se asume que la columna 'file_path' almacena la ruta interna del archivo en el bucket privado
        $filePath = $archivo->file_path;
        if (!$filePath) {
            return response()->json(['error' => 'La ruta interna del archivo no se encuentra'], 404);
        }

        // Si no se proporciona expiración, asigna un valor por defecto (por ejemplo, 1 minuto)
        $expirationMinutes = $expiration ? (int) $expiration : 1; // En minutos

        // Convertir minutos a segundos para mayor control, si lo prefieres (opcional)
        // $expirationSeconds = $expirationMinutes * 60;

        // Generar la URL temporal con expiración en $expirationMinutes minutos
        $temporaryUrl = URL::temporarySignedRoute(
            'files.download',         // Nombre de la ruta definida para la descarga
            now()->addMinutes($expirationMinutes), // Expiración en minutos
            ['path' => $filePath]
        );

        return response()->json([
            'archivo' => $archivo,
            'temporary_url' => $temporaryUrl
        ], 200);
    }
}
