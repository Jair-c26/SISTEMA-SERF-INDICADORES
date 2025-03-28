<?php

namespace App\Imports;

use App\Http\Controllers\Response\ResponseApi;
use App\Models\archivos\codDoc;
use Log;
use App\Models\carga\cargaFilcal;
use App\Models\fiscales\fiscales;
use App\Models\fiscalia\despachos;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Models\fiscalia\dependencias;
use Hamcrest\Type\IsBoolean;
use \PhpOffice\PhpSpreadsheet\Shared\Date;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

use function PHPUnit\Framework\isEmpty;

class CargaFiscalImport implements ToCollection, WithHeadingRow
{
    public $data;

    public function __construct()
    {
        $this->data = collect();
    }

    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {

        $codigoDocumento = mb_convert_encoding(strtoupper(trim($rows[2]['codigo_documento'])), 'UTF-8');

        try {
            // se crea el codigo doc de registro para carga fiascal y fiscales
            $doc_code = codDoc::where('codigo_doc', $codigoDocumento)->first();

            if (is_null($doc_code)) {
                $doc_code = codDoc::create([
                    'codigo_doc' => $codigoDocumento
                ]);
            }
            // Obtener los registros faltantes
            $listNull = $this->listMissingRecords($rows);

            //se verifica si hay datos, si no hay "[]" entonces todos los datos de "fiscalia" y "despachos" estan almacenados
            if (empty($listNull)) {
                //dd("ss");
                // se inserta los datos al "carga laboral"...
                $this->insertData($rows, $doc_code);
            } else {

                $this->data->push([
                    "Datos no encontrados en la base de datos" => $listNull
                ]);

            }

        } catch (\Exception $e) {
            //DB::rollBack(); // Si hay un error, revierte la transacción
            dd('Error al insertar: ' . $e->getMessage());
        }
    }

    public function getData()
    {
        return $this->data;
    }

    public function sheets(): array
    {
        return [
            0 => new CargaFiscalImport(), // Lee solo la primera hoja
        ];
    }

    /**
     * Busca registros en la base de datos y devuelve los que no encuentra.
     *
     * @param Collection $rows
     * @return array
     */
    private function listMissingRecords($rows)
    {
        $missingRecords = [];

        foreach ($rows as $index => $row) {

            if ($row['fiscalia'] && $row['fiscal']) {

                $faltantes = [];

                // Normalizar valores
                $fiscaliaName = preg_replace('/\s+/', ' ', trim($row['fiscalia'] ?? ''));
                $despachoName = preg_replace('/\s+/', ' ', trim($row['despacho'] ?? ''));
                $fiscalName = preg_replace('/\s+/', ' ', trim($row['fiscal'] ?? ''));

                // Buscar la fiscalía en la base de datos
                $dependencia = dependencias::where('fiscalia', 'LIKE', "%$fiscaliaName%")->first();

                // Buscar el despacho
                $despacho = DB::table('dependencias as d')
                    ->join('despachos as dp', 'dp.dependencia_fk', '=', 'd.id')
                    ->where('d.fiscalia', 'LIKE', "%$fiscaliaName%")
                    ->where('dp.nombre_despacho', 'LIKE', "%$despachoName%")
                    ->first();

                // Buscar el fiscal
                //$fiscal = fiscales::where('nombres_f', 'LIKE', "%$fiscalName%")->first();

                // Verificar si hay registros faltantes
                if (is_null($dependencia) && is_null($despacho)) {
                    $faltantes = [
                        "fiscalia" => $fiscaliaName,
                        "despacho" => $despachoName,
                        "fiscal" => $fiscalName, // Se corrigió el nombre de la clave
                        "fila Registro" => $index,
                    ];

                    $missingRecords[] = $faltantes; // Agregar a la lista de registros pendientes
                }
            }
        }

        return $missingRecords;
    }


    private function insertData($rows, $doc_code)
    {
        foreach ($rows as $row) {
            // Normalizar valores
            $fiscaliaName = $this->normalizeText($row['fiscalia'] ?? '');
            $despachoName = $this->normalizeText($row['despacho'] ?? '');
            $fiscalName = $this->normalizeText($row['fiscal'] ?? '');

            // Buscar la dependencia
            $dependenciaId = dependencias::where('fiscalia', 'LIKE', "%$fiscaliaName%")
                ->pluck('id')
                ->first();

            // Buscar el despacho
            $despacho = DB::table('dependencias as d')
                ->join('despachos as dp', 'dp.dependencia_fk', '=', 'd.id')
                ->where('d.fiscalia', 'LIKE', "%$fiscaliaName%")
                ->where('dp.nombre_despacho', 'LIKE', "%$despachoName%")
                ->first();

            // Buscar el fiscal
            $fiscal = fiscales::where('nombres_f', 'LIKE', "%$fiscalName%")->first();
            $codigoFiscal = null;

            if ($fiscal) {
                // Si el fiscal existe pero no tiene despacho, actualizarlo
                if (is_null($fiscal->despacho_fk) && $despacho) {
                    $iniciales = $this->generarIniciales($fiscal->nombres_f);
                    $codigoFiscal = ($despacho->cod_despa ?? 'SIN_DESPACHO') . '_' . $iniciales;

                    $fiscal->update([
                        'despacho_fk' => $despacho->id,
                        'cod_fiscal' => $codigoFiscal,
                    ]);
                }
            } else {
                // Si no existe el fiscal, crearlo (solo si hay despacho)
                if ($despacho) {
                    $iniciales = $this->generarIniciales($fiscalName);
                    $codigoFiscal = ($despacho->cod_despa ?? 'SIN_DESPACHO') . '_' . $iniciales;

                    $fiscal = fiscales::create([
                        'cod_fiscal' => $codigoFiscal,
                        'nombres_f' => $fiscalName,
                        'despacho_fk' => $despacho->id,
                        'activo' => true,
                        'codDoc_fk' => $doc_code->id ?? null,
                    ]);
                }
            }

            /***********************REGISTRO DE CASOS CARGA LABORAL***********************************/

            if ($fiscal && $despacho && !empty($row['codigo_documento'])) {
                // Convertir fechas de Excel si es necesario
                $fechaInicio = $this->convertirFechaExcel($row['fecha_inicio'] ?? null);
                $fechaFin = $this->convertirFechaExcel($row['fecha_fin'] ?? null);

                $tramites = is_numeric($row['tramite_del_mes']) ? $row['tramite_del_mes'] : 0;

                try {
                    cargaFilcal::updateOrCreate(
                        [
                            'fiscal_fk' => $fiscal->id,
                            'despacho_fk' => $despacho->id,
                            'codigo_doc' => $row['codigo_documento'] ?? null, // Asegura que es del mismo documento
                        ],
                        [
                            'resulHistorico' => $row['resuelto_historico'] ?? 0,
                            'resultado' => $row['resuelto'] ?? 0,
                            'tramitesHistoricos' => $row['tramite_historico'] ?? 0,
                            'tramites' => $tramites,
                            'ingreso' => $row['ingreso'] ?? 0,
                            'productividad_fiscal' => $row['productividad_fiscal'] ?? 0,
                            'fecha_inicio' => $fechaInicio,
                            'fecha_fin' => $fechaFin,
                            'codDoc_fk' => $doc_code->id ?? null,
                        ]
                    );
                } catch (\Exception $e) {
                    // Log::error("Error en la carga laboral: " . $e->getMessage());
                }
                
                $this->data->push([
                    'sede' => [
                        'depen_fiscal' => $row['fiscalia'] ?? null,
                        'despacho_fiscal' => $row['despacho'] ?? null,
                        'depen_id' => $dependenciaId ?? null,
                        'despacho_id' => $despacho->id ?? null, // ID del despacho encontrado o null
                        'despacho_cod' => $despacho->cod_despa ?? null, // ID del despacho encontrado o null
                        'despacho_nombre' => $despacho->nombre_despacho ?? null, // ID del despacho encontrado o null
                    ],
                    'fiscal' => [
                        'nombre_fiscal' => $row['fiscal'] ?? null,
                        'fiscal_id' => $fiscal->id ?? null, // ID del fiscal encontrado o creado
                        //'cod_fiscal' => $codigoFiscal ?? null, // ID del fiscal nombre
                        'datos_fiscal' => $fiscal ?? null,
                    ],
                    'caso' => [
                        'resuelto_historico' => $row['resuelto_historico'] ?? null,
                        'resuelto' => $row['resuelto'] ?? null,
                        'tramite_historico' => $row['tramite_historico'] ?? null,
                        'tramite_del_mes' => $row['tramite_del_mes'] ?? null,
                        'ingreso' => $row['ingreso'] ?? null,
                        'produc_fiscal' => $row['productividad_fiscal'] ?? 0,
                        'fecha_inicio' => $fechaInicio ?? null,
                        'fecha_fin' => $fechaFin ?? null,
                        'codigo_doc' => $row['codigo_documento'] ?? null,
                        'number_doc' => $doc_code->id
                    ],
                ]);
            }
        }
    }

    /** 
     * Función para normalizar texto (quitar espacios extra)
     */
    private function normalizeText($text)
    {
        return preg_replace('/\s+/', ' ', trim($text));
    }

    /** 
     * Función para generar iniciales de un nombre 
     */
    private function generarIniciales($nombre)
    {
        $iniciales = '';
        $palabras = explode(' ', $nombre);
        foreach ($palabras as $palabra) {
            if (!empty($palabra)) {
                $iniciales .= strtoupper(mb_substr($palabra, 0, 1));
            }
        }
        return $iniciales;
    }

    /** 
     * Función para convertir fechas de Excel a formato 'Y-m-d'
     */
    private function convertirFechaExcel($fecha)
    {
        return is_numeric($fecha) ? Date::excelToDateTimeObject($fecha)->format('Y-m-d') : $fecha;
    }


}
