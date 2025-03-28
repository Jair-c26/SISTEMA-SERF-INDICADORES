<?php

namespace App\Http\Controllers\exportExcel\user;

use Illuminate\Http\Request;
use App\Exports\UsuariosExport;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;

class UsuarioExportController extends Controller
{
    //
    /**
     * Exportar todos los usuarios a un archivo Excel (o CSV).
     *
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function export()
    {
        try {
            // Exportar a un archivo Excel
            return Excel::download(new UsuariosExport, 'usuarios_' . now(). '.xlsx'); // También puedes cambiar a .csv si lo deseas
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Hubo un error al exportar los usuarios.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
