<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CargaLaboralImport implements ToCollection , WithHeadingRow
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
        foreach ($rows as $row) {
            $this->data->push([
                'fiscal' => [
                    'id_fiscal' => $row['id_fiscal'] ?? null,
                    'no_fiscal' => $row['no_fiscal'] ?? null,
                ],
                'caso' => [
                    'id_unico' => $row['id_unico'] ?? null,
                    'fe_denuncia' => $row['fe_denuncia'] ?? null,
                    'fe_ing_caso' => $row['fe_ing_caso'] ?? null,
                    'fe_asig' => $row['fe_asig'] ?? null,
                    'de_etapa' => $row['de_etapa'] ?? null,
                    'de_estado' => $row['de_estado'] ?? null,
                    'st_acumulado' => $row['st_acumulado'] ?? null,
                    'tx_tipo_caso' => $row['tx_tipo_caso'] ?? null,
                    'condicion' => $row['condicion'] ?? null,
                    'fe_conclusion' => $row['fe_conclusion'] ?? null,
                    'de_mat_deli' => $row['de_mat_deli'] ?? null,
                ],
            ]);
        }
    }

    public function getData()
    {
        return $this->data;
    }
}
