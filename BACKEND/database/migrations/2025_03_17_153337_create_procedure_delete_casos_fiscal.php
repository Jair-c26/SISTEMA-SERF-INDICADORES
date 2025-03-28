<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        /*
        este procedure se encarga de eliminar todos los casos de los fiscales como parametro id_dependencia, el id o null
        para eliminar todos o pasar id de la dependencia para eliminar esos datos de la dependencia        
        */
        DB::unprepared("DROP PROCEDURE IF EXISTS EliminarDatosDependencia");
        DB::unprepared("
            CREATE PROCEDURE EliminarDatosDependencia(
                IN p_id_dependencia INT
            )
            BEGIN
                -- Iniciar transacción
                START TRANSACTION;
                
                -- Eliminar registros de control_plazo relacionados a los casos de la dependencia
                DELETE cp
                FROM control_plazo cp
                INNER JOIN casos c ON cp.caso_fk = c.id
                INNER JOIN fiscales f ON c.fiscal_fk = f.id
                WHERE (p_id_dependencia IS NULL OR f.dependencias_fk = p_id_dependencia);
                
                -- Eliminar registros de incidencias relacionados a los casos de la dependencia
                DELETE i
                FROM incidencias i
                INNER JOIN casos c ON i.casos_fk = c.id
                INNER JOIN fiscales f ON c.fiscal_fk = f.id
                WHERE (p_id_dependencia IS NULL OR f.dependencias_fk = p_id_dependencia);
                
                -- Eliminar los casos asociados a la dependencia
                DELETE c
                FROM casos c
                INNER JOIN fiscales f ON c.fiscal_fk = f.id
                WHERE (p_id_dependencia IS NULL OR f.dependencias_fk = p_id_dependencia);

                -- Eliminar registros adicionales que dependan de fiscales (si existen otras tablas relacionadas)
                -- DELETE FROM otra_tabla WHERE fiscal_fk IN (SELECT id FROM fiscales WHERE ...);
                
                -- Eliminar los fiscales asociados a la dependencia
                DELETE f
                FROM fiscales f
                WHERE (p_id_dependencia IS NULL OR f.dependencias_fk = p_id_dependencia);
                
                -- Confirmar la transacción
                COMMIT;

            END;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS EliminarDatosDependencia");
    }
};
