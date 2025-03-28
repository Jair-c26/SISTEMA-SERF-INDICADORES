<?php

namespace Database\Seeders;

use App\Models\fiscalia\region;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class regionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        region::create([
            'cod_regi' => 'MDD',
            'nombre' => 'MARE DE DIOS',
            'telefono' => '0123456789',
            'ruc' => '12345678901',
            'departamento' => 'MADRE DE DIOS',
            'cod_postal' => '17001',
        ]);
    }
}
