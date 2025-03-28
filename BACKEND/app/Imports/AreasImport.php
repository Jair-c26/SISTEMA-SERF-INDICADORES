<?php

namespace App\Imports;

use App\Models\fiscalia\sedes;
use App\Models\fiscalia\region;
use App\Models\fiscalia\despachos;
use Illuminate\Support\Collection;
use App\Models\fiscalia\dependencias;
use Maatwebsite\Excel\Concerns\ToCollection;

class AreasImport implements ToCollection
{
    public $data;

    public function __construct()
    {
        $this->data = collect();
    }

    /**
    * @param Collection $collection
    */
    public function collection(Collection $rows)
    {
        $headerProcessed = false;

        foreach ($rows as $row) {
            // Ignorar la primera fila (encabezados)
            if (!$headerProcessed) {
                $headerProcessed = true;
                continue;
            }

            // Normalizar y procesar cada fila
            $this->data->push([
                'region' => $this->normalizeRecord([
                    'codigo' => $row[0] ?? null,
                    'nombre' => $row[1] ?? null,
                    'telefono' => $row[2] ?? null,
                    'ruc' => $row[3] ?? null,
                    'departamento' => $row[4] ?? null,
                    'codigo_postal' => $row[5] ?? null,
                ]),
                'sede' => $this->normalizeRecord([
                    'codigo' => $row[6] ?? null,
                    'nombre' => $row[7] ?? null,
                    'telefono' => $row[8] ?? null,
                    'ruc' => $row[9] ?? null,
                    'provincia' => $row[10] ?? null,
                    'codigo_postal' => $row[11] ?? null,
                    'region_fk' => $row[12] ?? null,
                ]),
                'dependencia' => $this->normalizeRecord([
                    'codigo' => $row[13] ?? null,
                    'fiscalia' => $row[14] ?? null,
                    'tipo' => $row[15] ?? null,
                    'nombre' => $row[16] ?? null,
                    'telefono' => $row[17] ?? null,
                    'ruc' => $row[18] ?? null,
                    'sede_fk' => $row[19] ?? null,
                ]),
                'despacho' => $this->normalizeRecord([
                    'codigo' => $row[20] ?? null,
                    'nombre' => $row[21] ?? null,
                    'telefono' => $row[22] ?? null,
                    'ruc' => $row[23] ?? null,
                    'dependencia_fk' => $row[24] ?? null,
                ]),
            ]);
        }
    }

    public function getData()
    {
        return $this->data;
    }

    /**
     * Normaliza los datos de un registro (convierte a mayúsculas y elimina espacios extra).
     */
    private function normalizeRecord(array $record)
    {
        foreach ($record as $key => $value) {
            if (is_string($value)) {
                $record[$key] = strtoupper(trim(preg_replace('/\s+/', ' ', $value)));
            }
        }
        return $record;
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
}
