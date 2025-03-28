<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //
        DB::unprepared('DROP PROCEDURE IF EXISTS listaAreas;'); // Eliminar antes de crear
        
        DB::unprepared('
        CREATE PROCEDURE listaAreas()
        BEGIN
            SELECT 
                r.cod_regi AS region_cod,
                r.nombre AS region_nombre,
                r.telefono AS region_telefono,
                r.ruc AS region_ruc,
                r.departamento AS region_departamento,
                r.cod_postal AS region_codigoPostal,
                s.cod_sede AS sede_cod,
                s.nombre AS sede_nombre,
                s.telefono AS sede_telefono,
                s.ruc AS sede_ruc,
                s.provincia AS sede_provincia,
                s.codigo_postal AS sede_codigoPostal,
                s.regional_fk AS sede_region_fk,
                d.cod_depen AS dependencia_cod,
                d.fiscalia AS dependencia_fiscalia,
                d.tipo_fiscalia AS dependencia_tipo,
                d.nombre_fiscalia AS dependencia_nombre,
                d.telefono AS dependencia_telefono,
                d.ruc AS dependencia_ruc,
                d.sede_fk AS dependencia_sede_fk,
                dp.cod_despa AS despacho_cod,
                dp.nombre_despacho AS despacho_nombre,
                dp.telefono AS despacho_telefono,
                dp.ruc AS despacho_ruc,
                dp.dependencia_fk AS despacho_dependencia_fk
            FROM region r
            LEFT JOIN sedes s ON r.id = s.regional_fk
            LEFT JOIN dependencias d ON s.id = d.sede_fk
            LEFT JOIN despachos dp ON d.id = dp.dependencia_fk;
        END;
    ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('
        DELIMITER //
        DROP PROCEDURE IF EXISTS listaAreas;
        //
        DELIMITER ;
    ');
    }
};
