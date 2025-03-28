<?php

namespace App\Http\Controllers\exportExcel;

use Illuminate\Http\Request;
use App\Exports\ListaAreasExport;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Response\ResponseApi;
use Maatwebsite\Excel\Facades\Excel;

class listaAreasController extends Controller
{
    //
    public function export()
    {
        try {
            // Llamar directamente al procedimiento almacenado
            $areas = DB::select('CALL listaAreas()');

            // Exportar a Excel
            return Excel::download(new ListaAreasExport($areas), 'areas_' . now() . '.xlsx');
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Hubo un error al exportar las áreas.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
