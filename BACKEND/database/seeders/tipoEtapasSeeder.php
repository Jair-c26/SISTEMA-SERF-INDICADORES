<?php

namespace Database\Seeders;

use App\Models\logistica\carga\etapas as CargaEtapas;
use App\Models\logistica\etapas;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class tipoEtapasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        CargaEtapas::create([
            'id_etapa' => "30",
            'etapa' => "AUDIENCIA UNICA DE INCOACIÓN DE P.I.",
            'descripcion' => null
        ]);
        CargaEtapas::create([
            'id_etapa' => "0",
            'etapa' => "CALIFICACION",
            'descripcion' => null
        ]);

        CargaEtapas::create([
            'id_etapa' => "4",
            'etapa' => "ETAPA DE JUZGAMIENTO",
            'descripcion' => null
        ]);

        CargaEtapas::create([
            'id_etapa' => "3",
            'etapa' => "ETAPA INTERMEDIA",
            'descripcion' => null
        ]);


        CargaEtapas::create([
            'id_etapa' => "1",
            'etapa' => "INVESTIGACION PRELIMINAR",
            'descripcion' => null
        ]);

        CargaEtapas::create([
            'id_etapa' => "2",
            'etapa' => "INVESTIGACION PREPARATORIA",
            'descripcion' => null
        ]);
        CargaEtapas::create([
            'id_etapa' => "31",
            'etapa' => "JUICIO INMEDIATO (JUZGAMIENTO)",
            'descripcion' => null
        ]);

        CargaEtapas::create([
            'id_etapa' => "15",
            'etapa' => "JUICIO ORAL",
            'descripcion' => null
        ]);

        CargaEtapas::create([
            'id_etapa' => "300",
            'etapa' => "AUDIENCIA UNICA DE INCOACIÃƒâ€œN DE P.I.",
            'descripcion' => null
        ]);

    }
}
