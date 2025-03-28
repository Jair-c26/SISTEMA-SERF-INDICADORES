<?php

namespace App\Http\Controllers\logistica;

use App\Http\Controllers\Controller;
use App\Models\archivos\archivos;
use App\Models\fiscalia\dependencias;
use App\Models\reporte\Reporte;
use Illuminate\Http\Request;

class infoReporUserController extends Controller
{
    //

    public function ipUser($request)
    {

        // Se intenta obtener la IP desde el encabezado 'X-Forwarded-For'
        $ip = $ip = $request->header('X-Real-IP') ?? $request->getClientIp();

        return $data = [
            //'ip_user' => $request->getClientIp(),
            'ip_user' => $ip,
            'user' => auth()->user()->nombre,
        ];
    }


    public static function codeReport($tipoRepor): string
    {
        // Generar el número del reporte.
        // Se toma el máximo id actual de la tabla reporte y se suma 1.
        $maxId = Reporte::max('id');
        $nextNumber = $maxId ? $maxId + 1 : 1;

        // Armar el código final con el formato: {tipoRepor}-{codeArchivo}-{codeRepor}
        $finalCode = "{$tipoRepor}-{$nextNumber}";
        // Si ya existe un reporte con ese código, se incrementa el número hasta que sea único.
        while (Reporte::where('cod_report', $finalCode)->exists()) {
            $nextNumber++;
            $finalCode = "{$tipoRepor}-{$nextNumber}";
        }

        return $finalCode;
    }
}
