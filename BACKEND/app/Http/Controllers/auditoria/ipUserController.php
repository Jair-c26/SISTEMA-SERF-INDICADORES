<?php

namespace App\Http\Controllers\auditoria;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ipUserController extends Controller
{
    //
    public function index(Request $request)
    {
        // Obtener la IP desde la solicitud
        $ip = $request->ip();

        // También puedes verificar encabezados si estás detrás de un proxy
        $ipFromProxy = $request->header('X-Forwarded-For') ?? $request->server('REMOTE_ADDR');

        // Devolver la IP detectada
        return response()->json([
            'ip' => $ip,
            'proxy_ip' => $ipFromProxy
        ]);
    }
}
