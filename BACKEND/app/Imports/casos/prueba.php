<?php

namespace App\Imports\casos;

use Exception;
use App\Models\prueva;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class prueba implements ToModel, WithHeadingRow, WithChunkReading
{
    public function model(array $row)
    {
        return new prueva([
            'id_fiscal' => $row['id_fiscal'] ?? null,
            'no_fiscal' => $row['no_fiscal'] ?? null,
            'id_unico' => $row['id_unico'] ?? null,
            'fe_denuncia' => $this->formatDate($row['fe_denuncia'] ?? null),
            'fe_ing_caso' => $this->formatDate($row['fe_ing_caso'] ?? null),
            'fe_asig' => $this->formatDate($row['fe_asig'] ?? null),
            'id_etapa' => $row['id_etapa'] ?? null,
            'de_etapa' => $row['de_etapa'] ?? null,
            'id_estado' => $row['id_estado'] ?? null,
            'de_estado' => $row['de_estado'] ?? null,
            'st_acumulado' => $row['st_acumulado'] ?? null,
            'tx_tipo_caso' => $row['tx_tipo_caso'] ?? null,
            'condicion' => $row['condicion'] ?? null,
            'fe_conclusion' => $this->formatDate($row['fe_conclusion'] ?? null),
            'de_mat_deli' => $row['de_mat_deli'] ?? null,
        ]);
    }

    public function chunkSize(): int
    {
        return 500; // Reducimos el tamaño de cada carga para evitar saturación
    }

    private function formatDate($date)
    {
        return (!empty($date) && strtotime($date)) ? \Carbon\Carbon::parse($date)->format('Y-m-d H:i:s') : null;
    }

}
