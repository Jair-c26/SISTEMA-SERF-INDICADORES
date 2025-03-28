<?php

namespace App\Http\Controllers\logistica\reporte;

use Exception;
use Illuminate\Http\Request;
use App\Imports\casos\prueba;
use App\Imports\casos\PruebaImport;
use Illuminate\Support\Facades\Bus;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;

class PruebaController extends Controller
{
    public function importExcel(Request $request)
    {
        ini_set('memory_limit', '1024M');
        ini_set('max_execution_time', 900);

        try {
            if (!$request->hasFile('file')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No se ha subido ningún archivo',
                ], 400);
            }

            $file = $request->file('file');

            // Verifica que sea un archivo Excel
            $allowedExtensions = ['xls', 'xlsx', 'csv'];
            $extension = $file->getClientOriginalExtension();
            if (!in_array($extension, $allowedExtensions)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Formato de archivo no soportado. Usa .xls, .xlsx o .csv',
                ], 400);
            }

            // Procesar en segundo plano
            Bus::dispatch(function () use ($file) {
                Excel::import(new prueba(), $file);
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Importación iniciada, se procesará en segundo plano.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al importar el archivo: ' . $e->getMessage(),
            ], 500);
        }
    }
}
