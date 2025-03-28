<?php

namespace Database\Seeders;

use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use App\Models\archivos\Carpetas;
use App\Models\archivos\tipoRepor;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class tipoReporSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Definir los datos a insertar en tipo_repor
        $reportes = [
            ['nombre' => 'CARGA LABORAL', 'decipcion' => null],
            ['nombre' => 'CONTROL DE PLAZOS', 'decipcion' => null],
            ['nombre' => 'DELITOS CON MAYOR INCIDENCIAS', 'decipcion' => null],
            ['nombre' => 'REPORTES', 'decipcion' => null],
        ];

        foreach ($reportes as $reporte) {
            // Crear el registro en la tabla tipo_repor
            $tipoRepor = tipoRepor::create($reporte);
            
            // Crear carpeta asociada al reporte
            $rutaCarpeta = 'INDICADORES/LOGISTICA/'. str_replace(' ', '_', strtolower($reporte['nombre']));
            
            //Storage::disk('local')->makeDirectory($rutaCarpeta);
            
            Storage::disk('minio-private')->makeDirectory($rutaCarpeta);
            
            $random = Str::random(10);
            
            // Crear el registro en la tabla carpetas
            $codigoCarpeta = 'CARP-' . strtoupper(str_replace(' ', '_', $reporte['nombre'])).'-'.$random;
            $nombreCarpeta = $reporte['nombre'];
            $tipCarpeta = 'general'; // O el tipo que quieras asignar
            $tipoReporFk = $tipoRepor->id;
            
            $url = env('AWS_URL') . '/' . env('AWS_BUCKET_PRIVATE') . '/'.$rutaCarpeta;

            Carpetas::create([
                'codigo_carp' => $codigoCarpeta,
                'nombre_carp' => $nombreCarpeta,
                'tip_carp' => $tipCarpeta,
                'tipo_repor_fk' => $tipoReporFk,
                'direc_carp' => $url,  // La ruta de la carpeta
            ]);
        }
    }
}
