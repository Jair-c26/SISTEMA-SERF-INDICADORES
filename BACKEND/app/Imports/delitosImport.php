<?php

namespace App\Imports;

use App\Models\delitos\Delitos;
use App\Models\fiscalia\Dependencias;
use App\Models\archivos\codDoc;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use \PhpOffice\PhpSpreadsheet\Shared\Date;

class delitosImport implements ToCollection, WithHeadingRow
{
    public $data;

    public function __construct()
    {
        $this->data = collect();
    }

    public function collection(Collection $rows)
    {
        $codigoDocumento = mb_convert_encoding(strtoupper(trim($rows[2]['codigo_documento'])), 'UTF-8');

        try {
            // Buscar o crear código de documento
            $doc_code = codDoc::firstOrCreate(['codigo_doc' => $codigoDocumento]);

            // Obtener registros faltantes
            $listNull = $this->listMissingRecords($rows);

            if (empty($listNull)) {
                // Si no hay datos faltantes, insertar los registros
                $this->insertData($rows, $doc_code);
            } else {
                // Retornar datos faltantes
                $this->data->push([
                    "Datos no encontrados en la base de datos" => $listNull
                ]);
            }
        } catch (\Exception $e) {
            dd('Error al insertar: ' . $e->getMessage());
        }
    }

    public function getData()
    {
        return $this->data;
    }

    private function listMissingRecords($rows)
    {
        $missingRecords = [];

        foreach ($rows as $index => $row) {
            if ($row['fiscalia'] && $row['delito']) {
                $faltantes = [];

                // Normalizar valores
                $fiscaliaName = $this->normalizeText($row['fiscalia'] ?? '');
                $delitoName = $this->normalizeText($row['delito'] ?? '');

                // Buscar la fiscalía en la base de datos
                $dependencia = Dependencias::where('fiscalia', 'LIKE', "%$fiscaliaName%")->first();

                // Buscar el delito en la base de datos
                $delito = Delitos::where('nombre', 'LIKE', "%$delitoName%")->first();

                if (is_null($dependencia) || is_null($delito)) {
                    $faltantes = [
                        "fiscalia" => $fiscaliaName,
                        "delito" => $delitoName,
                        "fila Registro" => $index,
                    ];

                    $missingRecords[] = $faltantes;
                }
            }
        }

        return $missingRecords;
    }

    private function insertData($rows, $doc_code)
    {
        foreach ($rows as $row) {
            $fiscaliaName = $this->normalizeText($row['fiscalia'] ?? '');
            $delitoName = $this->normalizeText($row['delito'] ?? '');

            // Buscar la dependencia
            $dependencia = Dependencias::where('fiscalia', 'LIKE', "%$fiscaliaName%")->first();

            // Buscar el delito
            $delito = Delitos::where('nombre', 'LIKE', "%$delitoName%")->first();

            if ($dependencia && $delito) {
                // Insertar registro de delito si existe la fiscalía y el delito
                Delitos::updateOrCreate(
                    [
                        'nombre' => $delito->nombre,
                        'dependencia_fk' => $dependencia->id,
                        'codigo_doc' => $doc_code->id,
                    ],
                    [
                        'cantidad_casos' => $row['cantidad_casos'] ?? 0,
                        'fecha_inicio' => $this->convertirFechaExcel($row['fecha_inicio'] ?? null),
                        'fecha_fin' => $this->convertirFechaExcel($row['fecha_fin'] ?? null),
                    ]
                );

                $this->data->push([
                    'fiscalia' => [
                        'nombre' => $fiscaliaName,
                        'id' => $dependencia->id ?? null,
                    ],
                    'delito' => [
                        'nombre' => $delitoName,
                        'id' => $delito->id ?? null,
                        'cantidad_casos' => $row['cantidad_casos'] ?? 0,
                    ],
                ]);
            }
        }
    }

    private function normalizeText($text)
    {
        return preg_replace('/\s+/', ' ', trim($text));
    }

    private function convertirFechaExcel($fecha)
    {
        return is_numeric($fecha) ? Date::excelToDateTimeObject($fecha)->format('Y-m-d') : $fecha;
    }
}
