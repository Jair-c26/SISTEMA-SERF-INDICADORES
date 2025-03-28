<?php

namespace Database\Seeders;

use App\Models\fiscales\fiscal as FiscalesFiscal;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class tiposfiscal extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        FiscalesFiscal::create([
            'tipo' => 'Fiscal Supremo',
            'descripcion' => 'Se encargan de casos de alta relevancia y tienen competencias nacionales.',

        ]);

        FiscalesFiscal::create([
            'tipo' => 'Fiscal Superior',
            'descripcion' => 'Manejan casos en segunda instancia y apelaciones, además de supervisar a los niveles inferiores.',

        ]);

        FiscalesFiscal::create([
            'tipo' => 'Fiscal Provincial',
            'descripcion' => 'Responsables de casos en primera instancia dentro de su jurisdicción.',

        ]);

        FiscalesFiscal::create([
            'tipo' => 'Fiscales Adjuntos Provinciales',
            'descripcion' => 'apoyo en investigaciones y diligencias',

        ]);
    }
}
