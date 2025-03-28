<?php

namespace App\Http\Controllers\importExcel;

use App\Http\Controllers\Controller;
use App\Imports\CargaLaboralImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class importCargaCasosController extends Controller
{
    //

    public function importExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls',
        ]);

        $import = new CargaLaboralImport();
        Excel::import($import, $request->file('file'));

        return response()->json([
            'status' => 'success',
            'data' => $import->getData(),
        ]);
    }
}
