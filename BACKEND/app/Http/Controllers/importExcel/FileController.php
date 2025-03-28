<?php

namespace App\Http\Controllers\importExcel;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    //

    public function download(Request $request)
    {
        // Verificar la firma de la URL
        if (!$request->hasValidSignature()) {
            return response()->json(['error' => 'URL inválida o expirada'], 401);
        }

        $path = $request->get('path');

        if (!$path || !Storage::disk('minio-private')->exists($path)) {
            return response()->json(['error' => 'Archivo no encontrado'], 404);
        }

        // Puedes retornar el archivo para descarga
        return Storage::disk('minio-private')->download($path);
    }

}
