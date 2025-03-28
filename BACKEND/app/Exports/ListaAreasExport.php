<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;

class ListaAreasExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */

    protected $areas;

    public function __construct($areas)
    {
        $this->areas = $areas;
    }

    /**
     * Encabezados para el Excel.
     */
    public function headings(): array
    {
        return [
            'Region Código',
            'Region Nombre',
            'Region Teléfono',
            'Region RUC',
            'Region Departamento',
            'Region Código Postal',
            'Sede Código',
            'Sede Nombre',
            'Sede Teléfono',
            'Sede RUC',
            'Sede Provincia',
            'Sede Código Postal',
            'Sede Region FK',
            'Dependencia Código',
            'Dependencia Fiscalía',
            'Dependencia Tipo',
            'Dependencia Nombre',
            'Dependencia Teléfono',
            'Dependencia RUC',
            'Dependencia Sede FK',
            'Despacho Código',
            'Despacho Nombre',
            'Despacho Teléfono',
            'Despacho RUC',
            'Despacho Dependencia FK',
        ];
    }

    /**
     * Datos a exportar.
     */
    public function collection()
    {
        return collect($this->areas);
    }
}
