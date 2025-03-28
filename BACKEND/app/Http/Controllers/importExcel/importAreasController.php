<?php

namespace App\Http\Controllers\importExcel;

use Illuminate\Support\Str;
use App\Imports\AreasImport;
use Illuminate\Http\Request;
use App\Models\fiscalia\sedes;
use App\Models\fiscalia\region;
use App\Models\fiscalia\despachos;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\fiscalia\dependencias;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Response\ResponseApi;


class importAreasController extends Controller
{
    //

    public function import(Request $request)
    {
        // Validar el archivo subido
        $request->validate([
            'file' => 'required|mimes:xlsx,csv',
        ]);

        // Obtener el archivo del request
        $file = $request->file('file');
        // Procesar el archivo con la clase AreasImport
        $import = new AreasImport();
        Excel::import($import, $file);

        // Obtener los datos procesados
        $data = $import->getData();

        //$responseApi = new ResponseApi();

        foreach ($data as $entry) {
            // Registrar sede
            $sede = $entry['sede'] ?? null;
            if ($this->isValidRecord($sede, 'sede')) {
                $sedeModel = sedes::updateOrCreate(
                    ['cod_sede' => $sede['codigo']], // Condición para buscar el registro
                    [
                        'nombre' => $sede['nombre'],
                        'telefono' => $sede['telefono'],
                        'ruc' => $sede['ruc'],
                        'provincia' => $sede['provincia'],
                        'codigo_postal' => $sede['codigo_postal'],
                        'regional_fk' => $sede['region_fk'],
                    ]
                );
            }

            // Registrar dependencia
            $dependencia = $entry['dependencia'] ?? null;
            if ($this->isValidRecord($dependencia, 'dependencia')) {
                $dependenciaModel = dependencias::updateOrCreate(
                    ['cod_depen' => $dependencia['codigo']], // Condición para buscar el registro
                    [
                        'fiscalia' => $dependencia['fiscalia'],
                        'tipo_fiscalia' => $dependencia['tipo'],
                        'nombre_fiscalia' => $dependencia['nombre'],
                        'telefono' => $dependencia['telefono'],
                        'ruc' => $dependencia['ruc'],
                        'sede_fk' => $sedeModel->id ?? null,
                    ]
                );
            }

            // Registrar despacho
            $despacho = $entry['despacho'] ?? null;
            if ($this->isValidRecord($despacho, 'despacho')) {
                despachos::updateOrCreate(
                    ['cod_despa' => $despacho['codigo']], // Condición para buscar el registro
                    [
                        'nombre_despacho' => $despacho['nombre'],
                        'telefono' => $despacho['telefono'],
                        'ruc' => $despacho['ruc'],
                        'dependencia_fk' => $dependenciaModel->id ?? null,
                    ]
                );
            }
        }

        $url = $this->minioStorage($file);

        return response()->json([
            'status' => 'success',
            'url' => "GUARDADO EN PRIVADO." ,//$url,
            'data' => $data
        ]);
        
    }

    /**
     * Verifica si un registro es válido (no tiene todos los campos en null)
     */
    private function isValidRecord($record, $type)
    {
        // Reglas de validación específicas según el tipo de entidad
        switch ($type) {
            case 'sede':
                return isset($record['codigo'], $record['nombre'], $record['telefono'], $record['ruc'])
                    && !empty($record['codigo'])
                    && !empty($record['nombre']); // Aquí defines los campos mínimos necesarios para 'sede'

            case 'dependencia':
                return isset($record['codigo'], $record['fiscalia'], $record['tipo'], $record['nombre'])
                    && !empty($record['codigo'])
                    && !empty($record['fiscalia']); // Aquí defines los campos mínimos necesarios para 'dependencia'

            case 'despacho':
                return isset($record['codigo'], $record['nombre'])
                    && !empty($record['codigo'])
                    && !empty($record['nombre']); // Aquí defines los campos mínimos necesarios para 'despacho'

            default:
                return false; // Si el tipo no coincide, se considera inválido
        }
    }


    private function minioStorage($file):string
    {

        try {

            // Generar el nombre del archivo: "lista de usuarios-{nombre_usuario}-{fecha actual}"
            $userName = auth()->user()->nombre ?? null; // Ajustar según cómo obtienes el nombre del usuario
            $uuidUser = auth()->user()->uuid ?? null;
            $nombre_modificado = str_replace(" ", "_", trim($userName));
            $currentDate = now()->format('d-m-Y_H-i-s'); // Fecha con formato seguro para nombres de archivo
            $random = Str::random(20); //agrega seguridad a archivos publicos C:
            $fileName = "Areas-{$nombre_modificado}-{$currentDate}-{$random}." . $file->getClientOriginalExtension();

            // Obtener el contenido del excel
            $imageContent = file_get_contents($file->getRealPath());

            // Guardar el archivo en el sistema de almacenamiento predeterminado
            $path = 'INDICADORES/RESPALDO_SERF/' . $nombre_modificado . '_' . $uuidUser . '/AREAS/' . $fileName;

            Storage::disk('minio-private')->put($path, $imageContent);

            $url = env('AWS_URL') . '/' . env('AWS_BUCKET_PRIVATE') . '/' . $path;

            //$this->archivosRegister($url,$fileName,$file,$urlCarpeta->id);  ///--------------------

            return $url;
        } catch (\Exception $e) {
            //throw $th;
            return $e->getMessage();
        }
    }
}
