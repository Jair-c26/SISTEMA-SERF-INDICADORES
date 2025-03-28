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
        estos procedures se encargaran de calcular la carga fiscal tanto como sedes y dependencias, de esta manera 
        minimizar los procesos en el backend del sistema :'D
        */

        ////////////////////////////////////////////////////////////////////////////////
        
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenDependenciasSede");
        DB::unprepared("
            CREATE PROCEDURE ObtenerResumenDependenciasSede(
                IN p_id_sede VARCHAR(20),
                IN p_fe_inicio DATETIME,
                IN p_fe_fin DATETIME,
                IN p_fiscal_activo TINYINT  -- 1: fiscales activos, 0: fiscales inactivos, NULL: ambos
            )
            BEGIN
                SELECT
                    d.cod_depen AS Codigo_Dependencia,
                    d.nombre_fiscalia AS Nombre_Dep,
                    CASE WHEN d.activo = 1 THEN 'activo' ELSE 'inactivo' END AS Estado,
                    d.telefono AS Telefono,
                    (SELECT COUNT(DISTINCT f.id)
                    FROM casos c
                    INNER JOIN fiscales f ON c.fiscal_fk = f.id
                    WHERE f.dependencias_fk = d.id
                    AND (p_fe_inicio IS NULL OR c.fe_ing_caso >= p_fe_inicio)
                    AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                    AND (p_fiscal_activo IS NULL OR f.activo = p_fiscal_activo)
                    ) AS Cantidad_Fiscales,
                    (SELECT COUNT(*) 
                    FROM casos c
                    INNER JOIN fiscales f2 ON c.fiscal_fk = f2.id
                    WHERE f2.dependencias_fk = d.id) AS Casos_Ingresados
                FROM dependencias d
                WHERE (p_id_sede IS NULL OR p_id_sede = 'false' OR d.sede_fk = CAST(p_id_sede AS UNSIGNED));
            END;
        ");

        ////////////////////////////////////////////////////////////////////////////////////
        DB::unprepared("
            DROP PROCEDURE IF EXISTS  ObtenerResumenSede
        ");
        DB::unprepared( 
            "
                CREATE PROCEDURE ObtenerResumenSede(
                    IN p_id_sede INT,
                    IN p_id_dependencia INT,
                    IN p_fe_ingreso DATETIME,
                    IN p_fe_fin DATETIME,
                    IN p_fiscal_activo TINYINT  -- TRUE (1) para activos, FALSE (0) para inactivos, NULL para todos
                )
                BEGIN
                    -- Variables para almacenar el nombre de la sede y el nombre a mostrar.
                    DECLARE sede_nombre VARCHAR(200);
                    DECLARE result_name VARCHAR(200);

                    -- Obtener el nombre de la sede
                    SELECT nombre INTO sede_nombre
                    FROM sedes
                    WHERE id = p_id_sede;

                    -- Si se especifica una dependencia, se obtiene su nombre (campo 'nombre_fiscalia'); 
                    -- de lo contrario, se usa el nombre de la sede.
                    IF (p_id_dependencia IS NULL OR p_id_dependencia = FALSE) THEN
                        SET result_name = sede_nombre;
                    ELSE
                        SELECT nombre_fiscalia INTO result_name
                        FROM dependencias
                        WHERE id = p_id_dependencia;
                    END IF;

                    -- Consultar los datos según la dependencia o en general, aplicando el filtro de fechas
                    SELECT 
                        result_name AS Nombre,
                        
                        (SELECT COUNT(c.id)
                        FROM casos c
                        INNER JOIN fiscales f ON c.fiscal_fk = f.id
                        INNER JOIN dependencias d ON f.dependencias_fk = d.id
                        WHERE d.sede_fk = p_id_sede 
                        AND (p_id_dependencia IS NULL OR p_id_dependencia = FALSE OR d.id = p_id_dependencia)
                        AND (p_fe_ingreso IS NULL OR c.fe_ing_caso >= p_fe_ingreso)
                        AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                        ) AS Casos_Ingresados,

                        (SELECT COUNT(DISTINCT f.id)
                        FROM casos c
                        INNER JOIN fiscales f ON c.fiscal_fk = f.id
                        INNER JOIN dependencias d ON f.dependencias_fk = d.id
                        WHERE d.sede_fk = p_id_sede
                        AND c.fe_ing_caso >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH)
                        AND (p_id_dependencia IS NULL OR p_id_dependencia = FALSE OR d.id = p_id_dependencia)
                        AND (p_fe_ingreso IS NULL OR c.fe_ing_caso >= p_fe_ingreso)
                        AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                        AND (p_fiscal_activo IS NULL OR f.activo = p_fiscal_activo)
                        ) AS Total_Fiscales,

                        (SELECT COUNT(d.id)
                        FROM dependencias d
                        WHERE d.sede_fk = p_id_sede
                        AND (p_id_dependencia IS NULL OR p_id_dependencia = FALSE OR d.id = p_id_dependencia)
                        ) AS Total_Dependencias;
                END;
            "
        );
        
        ////////////////////////////////////////////////////////////////////////////

        DB::unprepared(
            "DROP PROCEDURE IF EXISTS  ObtenerCasosPorDependencia "
        );
        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerCasosPorDependencia(
                IN p_id_sede INT,
                IN p_id_dependencia VARCHAR(20),
                IN p_fe_inicio DATETIME,
                IN p_fe_fin DATETIME
            )
            BEGIN
                SELECT 
                    d.nombre_fiscalia AS Dependencia,
                    COUNT(c.id) AS Casos_Ingresados,
                    SUM(CASE WHEN c.fe_conclucion IS NOT NULL THEN 1 ELSE 0 END) AS Casos_Concluidos
                FROM casos c
                INNER JOIN fiscales f ON c.fiscal_fk = f.id
                INNER JOIN dependencias d ON f.dependencias_fk = d.id
                WHERE (p_id_sede IS NULL OR d.sede_fk = p_id_sede)
                AND (p_id_dependencia = 'false' OR d.id = CAST(p_id_dependencia AS UNSIGNED))
                AND ((p_fe_inicio IS NULL OR c.fe_ing_caso >= p_fe_inicio)
                    AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin))
                GROUP BY d.nombre_fiscalia
                ORDER BY Casos_Ingresados DESC;
            END;
            "
        );


        //////////////////////////////////////////////////////////////////////////////////////

        DB::unprepared(
            "DROP PROCEDURE IF EXISTS ObtenerCasosPorAnioDependencia"
        );

        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerCasosPorAnioDependencia(
                IN p_id_dependencia VARCHAR(20),
                IN p_fe_inicio DATETIME,
                IN p_fe_fin DATETIME
            )
            BEGIN
                SELECT 
                    YEAR(c.fe_ing_caso) AS Anio,
                    COUNT(c.id) AS Casos_Ingresados,
                    SUM(CASE WHEN c.fe_conclucion IS NOT NULL THEN 1 ELSE 0 END) AS Casos_Concluidos
                FROM casos c
                INNER JOIN fiscales f ON c.fiscal_fk = f.id
                INNER JOIN dependencias d ON f.dependencias_fk = d.id
                WHERE d.id = CAST(p_id_dependencia AS UNSIGNED)
                AND (p_fe_inicio IS NULL OR c.fe_ing_caso >= p_fe_inicio)
                AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                GROUP BY YEAR(c.fe_ing_caso)
                ORDER BY Anio ASC;
            END;
            "
        );


        /////////////////////////////////////////////////////////////////////////////////
        DB::unprepared("
            DROP PROCEDURE IF EXISTS ObtenerTopDependencias
        ");
        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerTopDependencias(
                IN p_fe_inicio DATETIME,
                IN p_fe_fin DATETIME,
                IN p_estado TINYINT  -- 1: sólo activos, 0: sólo inactivos, NULL: todos
            )
            BEGIN
                SELECT 
                    d.nombre_fiscalia AS Dependencia,
                    COUNT(c.id) AS Casos_Ingresados,
                    SUM(CASE WHEN c.fe_conclucion IS NOT NULL THEN 1 ELSE 0 END) AS Casos_Concluidos
                FROM casos c
                INNER JOIN fiscales f ON c.fiscal_fk = f.id
                INNER JOIN dependencias d ON f.dependencias_fk = d.id
                WHERE ((p_fe_inicio IS NULL OR c.fe_ing_caso >= p_fe_inicio)
                    AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin))
                AND (p_estado IS NULL OR d.activo = p_estado)
                GROUP BY d.nombre_fiscalia
                ORDER BY Casos_Concluidos DESC
                LIMIT 5;
            END;
            "
        );

        ////////////////////////////////////*************carga por dependencias*******************************/////////////////////////////////////////

        DB::unprepared(
            "
            DROP PROCEDURE IF EXISTS ObtenerResumenDependencias
            "
        );

        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerResumenDependencias(
                IN p_id_dependencia INT,
                IN p_fe_ingreso DATETIME,
                IN p_fe_fin DATETIME,
                IN p_fiscal_activo TINYINT  -- 1: fiscales activos, 0: fiscales inactivos, NULL: todos
            )
            BEGIN
                DECLARE result_name VARCHAR(200);

                -- Si no se especifica una dependencia, se muestra un nombre genérico.
                IF (p_id_dependencia IS NULL OR p_id_dependencia = FALSE) THEN
                    SET result_name = 'Todas las Dependencias';
                ELSE
                    SELECT nombre_fiscalia INTO result_name
                    FROM dependencias
                    WHERE id = p_id_dependencia;
                END IF;

                SELECT 
                    result_name AS Nombre,
                    
                    -- Total de casos ingresados filtrados por la dependencia (si se especifica) y el rango de fechas.
                    (SELECT COUNT(c.id)
                    FROM casos c
                    INNER JOIN fiscales f ON c.fiscal_fk = f.id
                    INNER JOIN dependencias d ON f.dependencias_fk = d.id
                    WHERE (p_id_dependencia IS NULL OR p_id_dependencia = FALSE OR d.id = p_id_dependencia)
                    AND (p_fe_ingreso IS NULL OR c.fe_ing_caso >= p_fe_ingreso)
                    AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                    ) AS Casos_Ingresados,

                    -- Total de fiscales (distintos) con casos ingresados en los últimos 2 meses, con filtros de fecha y estado.
                    (SELECT COUNT(DISTINCT f.id)
                    FROM casos c
                    INNER JOIN fiscales f ON c.fiscal_fk = f.id
                    INNER JOIN dependencias d ON f.dependencias_fk = d.id
                    WHERE c.fe_ing_caso >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH)
                    AND (p_id_dependencia IS NULL OR p_id_dependencia = FALSE OR d.id = p_id_dependencia)
                    AND (p_fe_ingreso IS NULL OR c.fe_ing_caso >= p_fe_ingreso)
                    AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                    AND (p_fiscal_activo IS NULL OR f.activo = p_fiscal_activo)
                    ) AS Total_Fiscales,

                    -- Total de despachos asociados a la dependencia (o a todas si no se especifica dependencia).
                    (SELECT COUNT(*) 
                    FROM despachos 
                    WHERE (p_id_dependencia IS NULL OR dependencia_fk = p_id_dependencia)
                    ) AS Total_Despachos;
            END;
            
            "
        );

        /////////////////////////////////////////////////////////////////////////////
        DB::unprepared(
            "
            DROP PROCEDURE IF EXISTS ObtenerResumenFiscalesPorDependencia
            "
        );
        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerResumenFiscalesPorDependencia(
                IN p_id_dependencia INT,
                IN p_fe_inicio DATETIME,
                IN p_fe_fin DATETIME,
                IN p_activo TINYINT  -- 1: fiscales activos, 0: fiscales inactivos, NULL: ambos
            )
            BEGIN
                SELECT 
                    f.nombres_f AS Fiscal,
                    COUNT(c.id) AS Casos_Ingresados,
                    SUM(CASE WHEN c.fe_conclucion IS NOT NULL THEN 1 ELSE 0 END) AS Casos_Resueltos,
                    COUNT(c.id) - SUM(CASE WHEN c.fe_conclucion IS NOT NULL THEN 1 ELSE 0 END) AS Casos_Tramite,
                    CASE 
                    WHEN COUNT(c.id) > 0 THEN ROUND(SUM(CASE WHEN c.fe_conclucion IS NOT NULL THEN 1 ELSE 0 END) / COUNT(c.id) * 100, 2)
                    ELSE 0 
                    END AS Avanzados_Resueltos
                FROM fiscales f
                INNER JOIN casos c 
                    ON f.id = c.fiscal_fk 
                    AND c.fe_ing_caso >= p_fe_inicio
                    AND c.fe_ing_caso <= p_fe_fin
                WHERE f.dependencias_fk = p_id_dependencia
                AND (p_activo IS NULL OR f.activo = p_activo)
                GROUP BY f.id, f.nombres_f;
            END;
            "
        );

        /********************************************************************** */
        DB::unprepared(
            "
            DROP PROCEDURE IF EXISTS ObtenerResumenResueltosFiscales
            "
        );
        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerResumenResueltosFiscales(
                IN p_id_dependencia INT,
                IN p_fe_inicio DATETIME,
                IN p_fe_fin DATETIME,
                IN p_activo TINYINT  -- 1: fiscales activos, 0: fiscales inactivos, NULL: ambos
            )
            BEGIN
                SELECT 
                    f.nombres_f AS Fiscal,
                    SUM(CASE WHEN c.fe_conclucion IS NOT NULL THEN 1 ELSE 0 END) AS Casos_Resueltos,
                    ROUND(
                        SUM(CASE WHEN c.fe_conclucion IS NOT NULL THEN 1 ELSE 0 END)
                        /
                        (SELECT SUM(CASE WHEN c2.fe_conclucion IS NOT NULL THEN 1 ELSE 0 END)
                        FROM fiscales f2
                        INNER JOIN casos c2 ON f2.id = c2.fiscal_fk
                        WHERE f2.dependencias_fk = p_id_dependencia
                        AND c2.fe_ing_caso >= p_fe_inicio
                        AND c2.fe_ing_caso <= p_fe_fin
                        AND (p_activo IS NULL OR f2.activo = p_activo)
                        ) * 100, 2) AS Porcentaje
                FROM fiscales f
                INNER JOIN casos c ON f.id = c.fiscal_fk
                WHERE f.dependencias_fk = p_id_dependencia
                AND c.fe_ing_caso >= p_fe_inicio
                AND c.fe_ing_caso <= p_fe_fin
                AND (p_activo IS NULL OR f.activo = p_activo)
                GROUP BY f.id, f.nombres_f;
            END;
            "
        );

        //////////////////////////////////////////////////////////////////////////////////

        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenCasosFiscales");
        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerResumenCasosFiscales(
                IN p_id_dependencia INT,
                IN p_fe_inicio DATETIME,
                IN p_fe_fin DATETIME,
                IN p_activo TINYINT  -- 1: fiscales activos, 0: fiscales inactivos, NULL: ambos
            )
            BEGIN
                SELECT 
                    f.nombres_f AS Fiscal,
                    COUNT(c.id) AS Casos_Ingresados,
                    SUM(CASE WHEN c.fe_conclucion IS NOT NULL THEN 1 ELSE 0 END) AS Casos_Resueltos
                FROM fiscales f
                INNER JOIN casos c ON f.id = c.fiscal_fk
                WHERE f.dependencias_fk = p_id_dependencia
                AND c.fe_ing_caso >= p_fe_inicio
                AND c.fe_ing_caso <= p_fe_fin
                AND (p_activo IS NULL OR f.activo = p_activo)
                GROUP BY f.id, f.nombres_f
                ORDER BY Casos_Resueltos DESC
                LIMIT 5;
            END;
            "
        );

        //////////////////////////////////////////////////////////////////////////////////////
        DB::unprepared(
            "
            DROP PROCEDURE IF EXISTS ObtenerCantidadEtapasPorDependencia
            "
        );
        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerCantidadEtapasPorDependencia(
                IN p_id_dependencia INT,
                IN p_fe_inicio DATETIME,
                IN p_fe_fin DATETIME
            )
            BEGIN
                SELECT 
                    e.etapa AS Etapa,
                    COUNT(c.id) AS Cantidad
                FROM casos c
                INNER JOIN fiscales f ON c.fiscal_fk = f.id
                INNER JOIN dependencias d ON f.dependencias_fk = d.id
                INNER JOIN etapas e ON c.etapa_fk = e.id
                WHERE d.id = p_id_dependencia
                AND (p_fe_inicio IS NULL OR c.fe_ing_caso >= p_fe_inicio)
                AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                GROUP BY e.etapa
                ORDER BY Cantidad DESC;
            END;
            "
        );

        ////////////////////////////////////////////////////////////////////////////////////////

        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerCantidadEstadosPorDependencia;");

        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerCantidadEstadosPorDependencia(
                IN p_id_dependencia INT,
                IN p_fe_inicio DATETIME,
                IN p_fe_fin DATETIME
            )
            BEGIN
                SELECT 
                    e.estado AS Estado,
                    COUNT(c.id) AS Cantidad
                FROM casos c
                INNER JOIN fiscales f ON c.fiscal_fk = f.id
                INNER JOIN dependencias d ON f.dependencias_fk = d.id
                INNER JOIN estado e ON c.estado_fk = e.id
                WHERE d.id = p_id_dependencia
                AND (p_fe_inicio IS NULL OR c.fe_ing_caso >= p_fe_inicio)
                AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                -- Filtrar solo los estados que contengan texto (no compuestos solo de dígitos)
                AND e.estado NOT REGEXP '^[0-9]+$'
                GROUP BY e.estado
                ORDER BY Cantidad DESC
                LIMIT 5;
            END;
            "
        );
        ///////////////////////////////////////////////////////////////

        DB::unprepared(
            "
            DROP PROCEDURE IF EXISTS ObtenerDespachosPorDependencia
            "
        );
        DB::unprepared(
            "            
            CREATE PROCEDURE ObtenerDespachosPorDependencia(
                IN p_id_dependencia INT
            )
            BEGIN
                SELECT 
                    d.cod_despa AS Codigo_Despacho,
                    d.nombre_despacho AS Nombre_Despacho,
                    CASE WHEN d.activo = 1 THEN 'activo' ELSE 'inactivo' END AS Estado,
                    dep.cod_depen AS Codigo_Dependencia,
                    (SELECT COUNT(*) 
                    FROM fiscales f 
                    WHERE f.despacho_fk = d.id) AS Cantidad_Fiscales
                FROM despachos d
                LEFT JOIN dependencias dep ON d.dependencia_fk = dep.id
                WHERE (p_id_dependencia IS NULL OR d.dependencia_fk = p_id_dependencia);
            END;
            "
        );

        ////////////////////////////////////////////////////////////////////////////
        DB::unprepared(
            "
            DROP PROCEDURE IF EXISTS ObtenerResumenDependenciasConFiscalesRango
            "
        );
        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerResumenDependenciasConFiscalesRango(
                IN p_id_sede VARCHAR(20),
                IN p_fe_inicio DATETIME,
                IN p_fe_fin DATETIME,
                IN p_fiscal_activo TINYINT  -- 1: fiscales activos, 0: fiscales inactivos, NULL: ambos
            )
            BEGIN
                SELECT 
                    d.nombre_fiscalia AS Nombre_Dep,
                    s.cod_sede AS Codigo_Sede,
                    CASE WHEN d.activo = 1 THEN 'activo' ELSE 'inactivo' END AS Estado,
                    d.telefono AS Telefono,
                    (SELECT COUNT(DISTINCT f.id)
                    FROM fiscales f
                    INNER JOIN casos c ON f.id = c.fiscal_fk
                    WHERE f.dependencias_fk = d.id
                    AND (p_fe_inicio IS NULL OR c.fe_ing_caso >= p_fe_inicio)
                    AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                    AND (p_fiscal_activo IS NULL OR f.activo = p_fiscal_activo)
                    ) AS Cantidad_Fiscales
                FROM dependencias d
                LEFT JOIN sedes s ON d.sede_fk = s.id
                WHERE (p_id_sede IS NULL OR p_id_sede = 'false' OR s.id = CAST(p_id_sede AS UNSIGNED));
            END;
            "
        );

        //////////
        DB::unprepared(
            "
            DROP PROCEDURE IF EXISTS ObtenerResumenPlazosDependencia
            "
        );
        DB::unprepared("
        CREATE PROCEDURE ObtenerResumenPlazosDependencia(
            IN p_id_sede INT,
            IN p_id_dependencia INT,
            IN p_fe_ingreso DATETIME,
            IN p_fe_fin DATETIME,
            IN p_fiscal_activo TINYINT  -- 1: fiscales activos, 0: fiscales inactivos, NULL: ambos
        )
        BEGIN
            -- Caso 1: p_id_sede es NULL --> resumir por sede (todas las sedes)
            IF p_id_sede IS NULL THEN
                SELECT 
                    s.cod_sede AS Codigo_Sede,
                    s.nombre AS Nombre_Sede,
                    COUNT(cp.id) AS Cantidad_Plazos,
                    COUNT(DISTINCT f.id) AS Cantidad_Fiscales,
                    COUNT(DISTINCT d.id) AS Cantidad_Dependencias
                FROM sedes s
                LEFT JOIN dependencias d ON s.id = d.sede_fk
                LEFT JOIN fiscales f ON d.id = f.dependencias_fk
                LEFT JOIN casos c ON f.id = c.fiscal_fk
                LEFT JOIN control_plazo cp ON c.id = cp.caso_fk
                WHERE (p_fe_ingreso IS NULL OR cp.f_estado >= p_fe_ingreso)
                AND (p_fe_fin IS NULL OR cp.f_estado <= p_fe_fin)
                AND (p_fiscal_activo IS NULL OR f.activo = p_fiscal_activo)
                GROUP BY s.id;
                
            ELSE
                -- p_id_sede está definido
                IF p_id_dependencia IS NULL OR p_id_dependencia = 0 THEN
                    -- Caso 2: p_id_sede definido y p_id_dependencia es NULL o 0: listar todas las dependencias de la sede
                    SELECT 
                        d.cod_depen AS Codigo_Dependencia,
                        d.nombre_fiscalia AS Nombre_Dep,
                        d.telefono AS Telefono,
                        CASE WHEN d.activo = 1 THEN 'activo' ELSE 'inactivo' END AS Estado,
                        COUNT(cp.id) AS Cantidad_Plazos,
                        COUNT(DISTINCT f.id) AS Cantidad_Fiscales
                    FROM dependencias d
                    LEFT JOIN sedes s ON d.sede_fk = s.id
                    LEFT JOIN fiscales f ON d.id = f.dependencias_fk
                    LEFT JOIN casos c ON f.id = c.fiscal_fk
                    LEFT JOIN control_plazo cp ON c.id = cp.caso_fk
                    WHERE s.id = p_id_sede
                    AND (p_fe_ingreso IS NULL OR cp.f_estado >= p_fe_ingreso)
                    AND (p_fe_fin IS NULL OR cp.f_estado <= p_fe_fin)
                    AND (p_fiscal_activo IS NULL OR f.activo = p_fiscal_activo)
                    GROUP BY d.id;
                ELSE
                    -- Caso 3: p_id_sede definido y p_id_dependencia definido: mostrar sólo esa dependencia
                    SELECT 
                        d.cod_depen AS Codigo_Dependencia,
                        d.nombre_fiscalia AS Nombre_Dep,
                        d.telefono AS Telefono,
                        CASE WHEN d.activo = 1 THEN 'activo' ELSE 'inactivo' END AS Estado,
                        COUNT(cp.id) AS Cantidad_Plazos,
                        COUNT(DISTINCT f.id) AS Cantidad_Fiscales
                    FROM dependencias d
                    LEFT JOIN sedes s ON d.sede_fk = s.id
                    LEFT JOIN fiscales f ON d.id = f.dependencias_fk
                    LEFT JOIN casos c ON f.id = c.fiscal_fk
                    LEFT JOIN control_plazo cp ON c.id = cp.caso_fk
                    WHERE s.id = p_id_sede
                    AND d.id = p_id_dependencia
                    AND (p_fe_ingreso IS NULL OR cp.f_estado >= p_fe_ingreso)
                    AND (p_fe_fin IS NULL OR cp.f_estado <= p_fe_fin)
                    AND (p_fiscal_activo IS NULL OR f.activo = p_fiscal_activo)
                    GROUP BY d.id;
                END IF;
            END IF;
        END;
        ");

        /////////////

        DB::unprepared(
            "
            DROP PROCEDURE IF EXISTS ObtenerResumenColoresDependencias
            "
        );

        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerResumenColoresDependencias(
                IN p_id_sede INT,           -- Si es NULL, se muestran todas las dependencias; si se especifica, filtra por esa sede.
                IN p_fe_inicio DATETIME,    -- Fecha de inicio para filtrar los registros en control_plazo.
                IN p_fe_fin DATETIME,       -- Fecha de fin para filtrar los registros en control_plazo.
                IN p_dep_activo TINYINT     -- 1: dependencias activas, 0: dependencias inactivas, NULL: ambas.
            )
            BEGIN
                SELECT 
                    d.cod_depen AS Codigo_Dependencia,
                    d.nombre_fiscalia AS Nombre_Dep,
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'verde' THEN 1 END) AS Cantidad_Verde,
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'amarillo' THEN 1 END) AS Cantidad_Amarillo,
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'rojo' THEN 1 END) AS Cantidad_Rojo,
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) IN ('verde','amarillo','rojo') THEN 1 END) AS Total_Colores
                FROM dependencias d
                LEFT JOIN sedes s ON d.sede_fk = s.id
                LEFT JOIN fiscales f ON d.id = f.dependencias_fk
                LEFT JOIN casos c ON f.id = c.fiscal_fk
                LEFT JOIN control_plazo cp 
                    ON c.id = cp.caso_fk 
                    AND (p_fe_inicio IS NULL OR IFNULL(cp.f_estado, cp.created_at) >= p_fe_inicio)
                    AND (p_fe_fin IS NULL OR IFNULL(cp.f_estado, cp.created_at) <= p_fe_fin)
                LEFT JOIN color_plazo col ON cp.color_fk = col.id
                WHERE (p_id_sede IS NULL OR d.sede_fk = p_id_sede)
                AND (p_dep_activo IS NULL OR d.activo = p_dep_activo)
                GROUP BY d.id;
            END;
            "
        );

        ///////////////////////////////

        DB::unprepared(
            "
            DROP PROCEDURE IF EXISTS ObtenerResumenColoresPorAnioDependencia
            "
        );
        DB::unprepared("
        CREATE PROCEDURE ObtenerResumenColoresPorAnioDependencia(
            IN p_id_dependencia INT,
            IN p_fe_inicio DATETIME,
            IN p_fe_fin DATETIME
        )
        BEGIN
            SELECT 
                YEAR(IFNULL(cp.f_estado, cp.created_at)) AS Anio,
                COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'verde' THEN 1 END) AS Cantidad_Verde,
                COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'amarillo' THEN 1 END) AS Cantidad_Amarillo,
                COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'rojo' THEN 1 END) AS Cantidad_Rojo,
                COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) IN ('verde','amarillo','rojo') THEN 1 END) AS Total_Colores
            FROM control_plazo cp
            INNER JOIN casos c ON cp.caso_fk = c.id
            INNER JOIN fiscales f ON c.fiscal_fk = f.id
            INNER JOIN dependencias d ON f.dependencias_fk = d.id
            LEFT JOIN color_plazo col ON cp.color_fk = col.id
            WHERE d.id = p_id_dependencia
            AND (p_fe_inicio IS NULL OR IFNULL(cp.f_estado, cp.created_at) >= p_fe_inicio)
            AND (p_fe_fin IS NULL OR IFNULL(cp.f_estado, cp.created_at) <= p_fe_fin)
            GROUP BY YEAR(IFNULL(cp.f_estado, cp.created_at))
            ORDER BY Anio ASC;
        END;
        ");

        ////////////////////////////////////////////////////

        DB::unprepared(
            "
            DROP PROCEDURE IF EXISTS ObtenerPlazosDependencias
            "
        );
        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerPlazosDependencias(
                IN p_id_sede INT,           -- Si es NULL, se muestran todas las dependencias; si se especifica, filtra por esa sede.
                IN p_fe_inicio DATETIME,    -- Fecha de inicio para filtrar los registros de control_plazo.
                IN p_fe_fin DATETIME,       -- Fecha de fin para filtrar los registros de control_plazo.
                IN p_dep_activo TINYINT     -- 1: dependencias activas, 0: dependencias inactivas, NULL: ambas.
            )
            BEGIN
                SELECT 
                    d.nombre_fiscalia AS Nombre_Dep,
                    COUNT(cp.id) AS Cantidad_Plazos,
                    CASE WHEN d.activo = 1 THEN 'activo' ELSE 'inactivo' END AS Estado
                FROM dependencias d
                LEFT JOIN sedes s ON d.sede_fk = s.id
                LEFT JOIN fiscales f ON d.id = f.dependencias_fk
                LEFT JOIN casos c ON f.id = c.fiscal_fk
                LEFT JOIN control_plazo cp 
                    ON c.id = cp.caso_fk 
                    AND (p_fe_inicio IS NULL OR IFNULL(cp.f_estado, cp.created_at) >= p_fe_inicio)
                    AND (p_fe_fin IS NULL OR IFNULL(cp.f_estado, cp.created_at) <= p_fe_fin)
                WHERE (p_id_sede IS NULL OR d.sede_fk = p_id_sede)
                AND (p_dep_activo IS NULL OR d.activo = p_dep_activo)
                GROUP BY d.id;
            END;
            "
        );


        /********************************* */
        DB::unprepared("
        DROP PROCEDURE IF EXISTS ObtenerDespachosPorDependenciaConPlazo
        ");
        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerDespachosPorDependenciaConPlazo(
                IN p_id_dependencia INT
            )
            BEGIN
                SELECT 
                    d.cod_despa AS Codigo_Despacho,
                    d.nombre_despacho AS Nombre_Despacho,
                    CASE WHEN d.activo = 1 THEN 'activo' ELSE 'inactivo' END AS Estado,
                    dep.cod_depen AS Codigo_Dependencia,
                    (SELECT COUNT(DISTINCT f.id)
                    FROM fiscales f
                    INNER JOIN casos c ON f.id = c.fiscal_fk
                    INNER JOIN control_plazo cp ON c.id = cp.caso_fk
                    WHERE f.despacho_fk = d.id
                    ) AS Cantidad_Fiscales_Con_Plazo
                FROM despachos d
                LEFT JOIN dependencias dep ON d.dependencia_fk = dep.id
                WHERE (p_id_dependencia IS NULL OR d.dependencia_fk = p_id_dependencia);
            END
            "
        );

        //////////////////////////////////////////////////////// EliminarDatosDependencia
        DB::unprepared("
        DROP PROCEDURE IF EXISTS ObtenerResumenPlazosDependencias
        ");
        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerResumenPlazosDependencias(
                IN p_id_dependencia INT,
                IN p_fe_ingreso DATETIME,
                IN p_fe_fin DATETIME,
                IN p_fiscal_activo TINYINT  -- 1: fiscales activos, 0: fiscales inactivos, NULL: ambos
            )
            BEGIN
                DECLARE result_name VARCHAR(200);

                -- Si no se especifica una dependencia, se muestra un nombre genérico.
                IF (p_id_dependencia IS NULL OR p_id_dependencia = FALSE) THEN
                    SET result_name = 'Todas las Dependencias';
                ELSE
                    SELECT nombre_fiscalia INTO result_name
                    FROM dependencias
                    WHERE id = p_id_dependencia;
                END IF;

                SELECT 
                    result_name AS Nombre,
                    
                    -- Cantidad de plazos registrados filtrados por la dependencia y rango de fechas.
                    (SELECT COUNT(cp.id)
                    FROM control_plazo cp
                    INNER JOIN casos c ON cp.caso_fk = c.id
                    INNER JOIN fiscales f ON c.fiscal_fk = f.id
                    INNER JOIN dependencias d ON f.dependencias_fk = d.id
                    WHERE (p_id_dependencia IS NULL OR p_id_dependencia = FALSE OR d.id = p_id_dependencia)
                    AND (p_fe_ingreso IS NULL OR IFNULL(cp.f_estado, cp.created_at) >= p_fe_ingreso)
                    AND (p_fe_fin IS NULL OR IFNULL(cp.f_estado, cp.created_at) <= p_fe_fin)
                    ) AS Plazos_Registrados,
                    
                    -- Cantidad de fiscales (distintos) que tienen registros en control_plazo dentro del rango y según su estado.
                    (SELECT COUNT(DISTINCT f.id)
                    FROM control_plazo cp
                    INNER JOIN casos c ON cp.caso_fk = c.id
                    INNER JOIN fiscales f ON c.fiscal_fk = f.id
                    INNER JOIN dependencias d ON f.dependencias_fk = d.id
                    WHERE (p_id_dependencia IS NULL OR p_id_dependencia = FALSE OR d.id = p_id_dependencia)
                    AND (p_fe_ingreso IS NULL OR IFNULL(cp.f_estado, cp.created_at) >= p_fe_ingreso)
                    AND (p_fe_fin IS NULL OR IFNULL(cp.f_estado, cp.created_at) <= p_fe_fin)
                    AND (p_fiscal_activo IS NULL OR f.activo = p_fiscal_activo)
                    ) AS Total_Fiscales,
                    
                    -- Cantidad de despachos asociados a la dependencia (o todas si no se especifica dependencia).
                    (SELECT COUNT(*)
                    FROM despachos
                    WHERE (p_id_dependencia IS NULL OR p_id_dependencia = FALSE OR dependencia_fk = p_id_dependencia)
                    ) AS Total_Despachos
                ;
            END
            "
        );

        ///////////////////////////////////////////////////
        DB::unprepared(
            "
            DROP PROCEDURE IF EXISTS ObtenerResumenColoresPorFiscal
            "
        );
        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerResumenColoresPorFiscal(
                IN p_id_dependencia INT,
                IN p_fe_ingreso DATETIME,
                IN p_fe_fin DATETIME,
                IN p_activo TINYINT  -- 1: fiscales activos, 0: fiscales inactivos, NULL: ambos
            )
            BEGIN
                SELECT
                    f.nombres_f AS Fiscal,
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'verde' THEN 1 END) AS Cantidad_Verde,
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'amarillo' THEN 1 END) AS Cantidad_Amarillo,
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'rojo' THEN 1 END) AS Cantidad_Rojo,
                    (
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'verde' THEN 1 END)
                    + COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'amarillo' THEN 1 END)
                    + COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'rojo' THEN 1 END)
                    ) AS Total_Colores,
                    ROUND(
                    (COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'verde' THEN 1 END)
                    / NULLIF(
                        (COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'verde' THEN 1 END)
                        + COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'amarillo' THEN 1 END)
                        + COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'rojo' THEN 1 END)
                        ), 0)
                    ) * 100, 2) AS Porcentaje_Verde,
                    ROUND(
                    (COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'amarillo' THEN 1 END)
                    / NULLIF(
                        (COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'verde' THEN 1 END)
                        + COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'amarillo' THEN 1 END)
                        + COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'rojo' THEN 1 END)
                        ), 0)
                    ) * 100, 2) AS Porcentaje_Amarillo,
                    ROUND(
                    (COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'rojo' THEN 1 END)
                    / NULLIF(
                        (COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'verde' THEN 1 END)
                        + COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'amarillo' THEN 1 END)
                        + COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'rojo' THEN 1 END)
                        ), 0)
                    ) * 100, 2) AS Porcentaje_Rojo
                FROM fiscales f
                INNER JOIN casos c ON f.id = c.fiscal_fk
                INNER JOIN control_plazo cp ON c.id = cp.caso_fk
                LEFT JOIN color_plazo col ON cp.color_fk = col.id
                WHERE f.dependencias_fk = p_id_dependencia
                AND (p_fe_ingreso IS NULL OR IFNULL(cp.f_estado, cp.created_at) >= p_fe_ingreso)
                AND (p_fe_fin IS NULL OR IFNULL(cp.f_estado, cp.created_at) <= p_fe_fin)
                AND (p_activo IS NULL OR f.activo = p_activo)
                GROUP BY f.id, f.nombres_f;
            END
            "
        );

        ////////////////////////////////////////
        DB::unprepared(
            "
            DROP PROCEDURE IF EXISTS ObtenerDatosDependenciaConColores
            "
        );
        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerDatosDependenciaConColores(
                IN p_id_dependencia INT,      -- Si es NULL, se muestran todas las dependencias; si se especifica, solo esa dependencia.
                IN p_fe_ingreso DATETIME,     -- Fecha de inicio para filtrar los registros en control_plazo.
                IN p_fe_fin DATETIME          -- Fecha de fin para filtrar los registros en control_plazo.
            )
            BEGIN
                SELECT 
                    d.id AS Dependencia_ID,
                    d.cod_depen AS Codigo_Dependencia,
                    d.fiscalia,
                    d.tipo_fiscalia,
                    d.nombre_fiscalia AS Nombre_Dep,
                    d.activo,
                    d.delitos,
                    d.telefono,
                    d.ruc,
                    d.sede_fk,
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'verde' THEN 1 END) AS Cantidad_Verde,
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'amarillo' THEN 1 END) AS Cantidad_Amarillo,
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'rojo' THEN 1 END) AS Cantidad_Rojo,
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) IN ('verde','amarillo','rojo') THEN 1 END) AS Total_Colores,
                    ROUND(
                        (COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'verde' THEN 1 END) 
                        / NULLIF(COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) IN ('verde','amarillo','rojo') THEN 1 END), 0)
                        ) * 100, 2) AS Porcentaje_Verde,
                    ROUND(
                        (COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'amarillo' THEN 1 END) 
                        / NULLIF(COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) IN ('verde','amarillo','rojo') THEN 1 END), 0)
                        ) * 100, 2) AS Porcentaje_Amarillo,
                    ROUND(
                        (COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'rojo' THEN 1 END) 
                        / NULLIF(COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) IN ('verde','amarillo','rojo') THEN 1 END), 0)
                        ) * 100, 2) AS Porcentaje_Rojo
                FROM dependencias d
                LEFT JOIN fiscales f ON d.id = f.dependencias_fk
                LEFT JOIN casos c ON f.id = c.fiscal_fk
                LEFT JOIN control_plazo cp ON c.id = cp.caso_fk 
                    AND (p_fe_ingreso IS NULL OR IFNULL(cp.f_estado, cp.created_at) >= p_fe_ingreso)
                    AND (p_fe_fin IS NULL OR IFNULL(cp.f_estado, cp.created_at) <= p_fe_fin)
                LEFT JOIN color_plazo col ON cp.color_fk = col.id
                WHERE (p_id_dependencia IS NULL OR d.id = p_id_dependencia)
                GROUP BY d.id;
            END
            "
        );
        /////////////////////////////////////////////
        DB::unprepared(
            "
            DROP PROCEDURE IF EXISTS ObtenerFiscalesConPlazos
            "
        );
        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerFiscalesConPlazos(
                IN p_id_dependencia INT,       -- ID de la dependencia.
                IN p_fe_ingreso DATETIME,      -- Fecha de inicio para filtrar registros en control_plazo.
                IN p_fe_fin DATETIME,          -- Fecha de fin para filtrar registros en control_plazo.
                IN p_activo TINYINT            -- Estado del fiscal: 1 para activos, 0 para inactivos, NULL para ambos.
            )
            BEGIN
                SELECT 
                    f.nombres_f AS Fiscal,
                    COUNT(cp.id) AS Plazos_Ingresados
                FROM fiscales f
                INNER JOIN casos c ON f.id = c.fiscal_fk
                INNER JOIN control_plazo cp ON c.id = cp.caso_fk
                WHERE f.dependencias_fk = p_id_dependencia
                AND (p_fe_ingreso IS NULL OR IFNULL(cp.f_estado, cp.created_at) >= p_fe_ingreso)
                AND (p_fe_fin IS NULL OR IFNULL(cp.f_estado, cp.created_at) <= p_fe_fin)
                AND (p_activo IS NULL OR f.activo = p_activo)
                GROUP BY f.id, f.nombres_f;
            END
            "
        );

        //////////////////////////////////////////////////
        DB::unprepared(
            "
            DROP PROCEDURE IF EXISTS ObtenerColoresPorAnioDependencia
            "
        );
        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerColoresPorAnioDependencia(
                IN p_id_dependencia INT,       -- ID de la dependencia.
                IN p_fe_ingreso DATETIME,      -- Fecha de inicio para filtrar registros en control_plazo.
                IN p_fe_fin DATETIME           -- Fecha de fin para filtrar registros en control_plazo.
            )
            BEGIN
                SELECT 
                    YEAR(IFNULL(cp.f_estado, cp.created_at)) AS Anio,
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'verde' THEN 1 END) AS Cantidad_Verde,
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'amarillo' THEN 1 END) AS Cantidad_Amarillo,
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'rojo' THEN 1 END) AS Cantidad_Rojo,
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) IN ('verde','amarillo','rojo') THEN 1 END) AS Total_Colores
                FROM control_plazo cp
                INNER JOIN casos c ON cp.caso_fk = c.id
                INNER JOIN fiscales f ON c.fiscal_fk = f.id
                INNER JOIN dependencias d ON f.dependencias_fk = d.id
                LEFT JOIN color_plazo col ON cp.color_fk = col.id
                WHERE d.id = p_id_dependencia
                AND (p_fe_ingreso IS NULL OR IFNULL(cp.f_estado, cp.created_at) >= p_fe_ingreso)
                AND (p_fe_fin IS NULL OR IFNULL(cp.f_estado, cp.created_at) <= p_fe_fin)
                GROUP BY YEAR(IFNULL(cp.f_estado, cp.created_at))
                ORDER BY Anio ASC;
            END
            "
        );

        ////////////////////////////////////////////////////////////////
        DB::unprepared(
            "
            DROP PROCEDURE IF EXISTS ObtenerResumenColoresPorEtapa
            "
        );
        DB::unprepared("
        CREATE PROCEDURE ObtenerResumenColoresPorEtapa(
            IN p_id_dependencia INT,       -- ID de la dependencia.
            IN p_fe_ingreso DATETIME,      -- Fecha de inicio para filtrar registros en control_plazo.
            IN p_fe_fin DATETIME           -- Fecha de fin para filtrar registros en control_plazo.
        )
        BEGIN
            SELECT
                e.etapa AS Etapa,
                COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'verde' THEN 1 END) AS Cantidad_Verde,
                COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'amarillo' THEN 1 END) AS Cantidad_Amarillo,
                COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'rojo' THEN 1 END) AS Cantidad_Rojo,
                COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) IN ('verde','amarillo','rojo') THEN 1 END) AS Total_Colores,
                ROUND(
                (COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'verde' THEN 1 END)
                / NULLIF(
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) IN ('verde','amarillo','rojo') THEN 1 END), 0)
                ) * 100, 2) AS Porcentaje_Verde,
                ROUND(
                (COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'amarillo' THEN 1 END)
                / NULLIF(
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) IN ('verde','amarillo','rojo') THEN 1 END), 0)
                ) * 100, 2) AS Porcentaje_Amarillo,
                ROUND(
                (COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) = 'rojo' THEN 1 END)
                / NULLIF(
                    COUNT(CASE WHEN LOWER(REPLACE(col.color, '.jpg','')) IN ('verde','amarillo','rojo') THEN 1 END), 0)
                ) * 100, 2) AS Porcentaje_Rojo
            FROM casos c
            INNER JOIN etapas e ON c.etapa_fk = e.id
            INNER JOIN fiscales f ON c.fiscal_fk = f.id
            INNER JOIN control_plazo cp ON c.id = cp.caso_fk
            LEFT JOIN color_plazo col ON cp.color_fk = col.id
            WHERE f.dependencias_fk = p_id_dependencia
            AND (p_fe_ingreso IS NULL OR IFNULL(cp.f_estado, cp.created_at) >= p_fe_ingreso)
            AND (p_fe_fin IS NULL OR IFNULL(cp.f_estado, cp.created_at) <= p_fe_fin)
            GROUP BY e.etapa
            HAVING Total_Colores > 0
            ORDER BY e.etapa;
        END
        ");

        /////////////////////////////////////////////////ObtenerCantidadEstadosPorDependencia



        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerTopDelitosPorDependencia");
        DB::unprepared("
        CREATE PROCEDURE ObtenerTopDelitosPorDependencia(
            IN p_id_dependencia INT,         -- ID de la dependencia
            IN p_fe_ingreso DATETIME,        -- Fecha de inicio (filtrado por c.fe_ing_caso)
            IN p_fe_fin DATETIME,            -- Fecha de fin (filtrado por c.fe_ing_caso)
            IN p_dep_activo TINYINT,         -- Estado de la dependencia (1: activa, 0: inactiva, NULL: ambas)
            IN p_limit INT                   -- Número de delitos a mostrar (por ejemplo, 5 para los 5 principales)
        )
        BEGIN
            SELECT 
                ctd.nombre_delito AS Delito,
                COUNT(i.id) AS Cantidad
            FROM incidencias i
            INNER JOIN casos c ON i.casos_fk = c.id
            INNER JOIN fiscales f ON c.fiscal_fk = f.id
            INNER JOIN dependencias d ON f.dependencias_fk = d.id
            INNER JOIN casos_tipo_delito ctd ON i.t_delito_fk = ctd.id
            WHERE d.id = p_id_dependencia
            AND (p_dep_activo IS NULL OR d.activo = p_dep_activo)
            AND (p_fe_ingreso IS NULL OR c.fe_ing_caso >= p_fe_ingreso)
            AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
            GROUP BY ctd.nombre_delito
            ORDER BY Cantidad DESC
            LIMIT p_limit;
        END 
        ");

        ////////////////////////////////////////////////
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerTopDelitosPorDependenciaConPorcentaje");
        DB::unprepared("
        CREATE PROCEDURE ObtenerTopDelitosPorDependenciaConPorcentaje(
            IN p_id_dependencia INT,         -- ID de la dependencia.
            IN p_fe_ingreso DATETIME,        -- Fecha de inicio (filtrado por c.fe_ing_caso).
            IN p_fe_fin DATETIME,            -- Fecha de fin (filtrado por c.fe_ing_caso).
            IN p_dep_activo TINYINT,         -- Estado de la dependencia: 1 (activa), 0 (inactiva), NULL (ambas).
            IN p_limit INT                   -- Número de delitos a mostrar (por ejemplo, 5 para los 5 principales).
        )
        BEGIN
            WITH top_delitos AS (
                SELECT 
                    ctd.nombre_delito AS Delito,
                    COUNT(i.id) AS Cantidad
                FROM incidencias i
                INNER JOIN casos c ON i.casos_fk = c.id
                INNER JOIN fiscales f ON c.fiscal_fk = f.id
                INNER JOIN dependencias d ON f.dependencias_fk = d.id
                INNER JOIN casos_tipo_delito ctd ON i.t_delito_fk = ctd.id
                WHERE d.id = p_id_dependencia
                AND (p_dep_activo IS NULL OR d.activo = p_dep_activo)
                AND (p_fe_ingreso IS NULL OR c.fe_ing_caso >= p_fe_ingreso)
                AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                GROUP BY ctd.nombre_delito
                ORDER BY Cantidad DESC
                LIMIT p_limit
            )
            SELECT 
                Delito,
                Cantidad,
                ROUND(Cantidad / total_sum * 100, 2) AS Porcentaje
            FROM (
                SELECT 
                    t.*,
                    (SELECT SUM(Cantidad) FROM top_delitos) AS total_sum
                FROM top_delitos t
            ) AS derived;
        END
        ");


        ///////////////////////////////
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerTopDelitosPorAnioDependencia");
        DB::unprepared("
        CREATE PROCEDURE ObtenerTopDelitosPorAnioDependencia(
            IN p_id_dependencia INT,        -- ID de la dependencia.
            IN p_fe_ingreso DATETIME,       -- Fecha de inicio para filtrar c.fe_ing_caso.
            IN p_fe_fin DATETIME,           -- Fecha de fin para filtrar c.fe_ing_caso.
            IN p_limit INT                  -- Número máximo de delitos a mostrar por cada año.
        )
        BEGIN
            WITH delitos_por_anio AS (
                SELECT 
                    YEAR(c.fe_ing_caso) AS Anio,
                    ctd.nombre_delito AS Delito,
                    COUNT(i.id) AS Cantidad,
                    ROW_NUMBER() OVER (PARTITION BY YEAR(c.fe_ing_caso) ORDER BY COUNT(i.id) DESC) AS rn
                FROM incidencias i
                INNER JOIN casos c ON i.casos_fk = c.id
                INNER JOIN fiscales f ON c.fiscal_fk = f.id
                INNER JOIN dependencias d ON f.dependencias_fk = d.id
                INNER JOIN casos_tipo_delito ctd ON i.t_delito_fk = ctd.id
                WHERE d.id = p_id_dependencia
                AND (p_fe_ingreso IS NULL OR c.fe_ing_caso >= p_fe_ingreso)
                AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                GROUP BY YEAR(c.fe_ing_caso), ctd.nombre_delito
            )
            SELECT 
                Anio,
                Delito,
                Cantidad
            FROM delitos_por_anio
            WHERE rn <= p_limit
            ORDER BY Anio, Cantidad DESC;
        END
        ");
        /////////////////////////////////////////////////////////
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenFiscal");

        DB::unprepared("
        CREATE PROCEDURE ObtenerResumenFiscal(
            IN p_id_fiscal INT,           -- ID del fiscal a consultar.
            IN p_fe_ingreso DATETIME,     -- Fecha de inicio para filtrar los casos (campo fe_ing_caso en casos).
            IN p_fe_fin DATETIME          -- Fecha de fin para filtrar los casos (campo fe_ing_caso en casos).
        )
        BEGIN
            SELECT 
                f.nombres_f AS Fiscal,
                d.nombre_fiscalia AS Dependencia,
                desp.nombre_despacho AS Despacho,
                CASE WHEN f.activo = 1 THEN 'activo' ELSE 'inactivo' END AS Estado,
                -- Total de casos ingresados en el rango especificado:
                (SELECT COUNT(*) 
                FROM casos c 
                WHERE c.fiscal_fk = f.id
                AND (p_fe_ingreso IS NULL OR c.fe_ing_caso >= p_fe_ingreso)
                AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                ) AS Casos_Ingresados,
                -- Total de casos resueltos en el rango especificado:
                (SELECT COUNT(*) 
                FROM casos c 
                WHERE c.fiscal_fk = f.id
                AND c.fe_conclucion IS NOT NULL
                AND (p_fe_ingreso IS NULL OR c.fe_ing_caso >= p_fe_ingreso)
                AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                ) AS Casos_Resueltos,
                -- Casos en trámite (ingresados - resueltos):
                (
                (SELECT COUNT(*) 
                FROM casos c 
                WHERE c.fiscal_fk = f.id
                    AND (p_fe_ingreso IS NULL OR c.fe_ing_caso >= p_fe_ingreso)
                    AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                )
                -
                (SELECT COUNT(*) 
                FROM casos c 
                WHERE c.fiscal_fk = f.id
                    AND c.fe_conclucion IS NOT NULL
                    AND (p_fe_ingreso IS NULL OR c.fe_ing_caso >= p_fe_ingreso)
                    AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                )
                ) AS Casos_Tramite,
                -- Cantidad de casos ingresados en el último mes (desde CURDATE()-INTERVAL 1 MONTH hasta CURDATE()):
                (SELECT COUNT(*) 
                FROM casos c 
                WHERE c.fiscal_fk = f.id
                AND c.fe_ing_caso BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND CURDATE()
                ) AS Casos_Ultimo_Mes,
                -- Porcentaje de casos resueltos respecto a los ingresados en el rango especificado:
                CASE 
                    WHEN (SELECT COUNT(*) 
                        FROM casos c 
                        WHERE c.fiscal_fk = f.id
                            AND (p_fe_ingreso IS NULL OR c.fe_ing_caso >= p_fe_ingreso)
                            AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                        ) = 0 THEN 0
                    ELSE ROUND(
                        (SELECT COUNT(*) 
                        FROM casos c 
                        WHERE c.fiscal_fk = f.id
                        AND c.fe_conclucion IS NOT NULL
                        AND (p_fe_ingreso IS NULL OR c.fe_ing_caso >= p_fe_ingreso)
                        AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                        ) 
                        /
                        (SELECT COUNT(*) 
                        FROM casos c 
                        WHERE c.fiscal_fk = f.id
                        AND (p_fe_ingreso IS NULL OR c.fe_ing_caso >= p_fe_ingreso)
                        AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                        ) * 100, 2)
                END AS Porcentaje_Fiscal_Avanzado
            FROM fiscales f
            LEFT JOIN dependencias d ON f.dependencias_fk = d.id
            LEFT JOIN despachos desp ON f.despacho_fk = desp.id
            WHERE f.id = p_id_fiscal;
        END;
        ");
        ////////////////////////////////////////

        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenPorAnioFiscal");
        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerResumenPorAnioFiscal(
                IN p_id_fiscal INT,           -- ID del fiscal a consultar.
                IN p_fe_ingreso DATETIME,     -- Fecha de inicio para filtrar los casos (fe_ing_caso).
                IN p_fe_fin DATETIME          -- Fecha de fin para filtrar los casos (fe_ing_caso).
            )
            BEGIN
                SELECT 
                    YEAR(c.fe_ing_caso) AS Anio,
                    COUNT(c.id) AS Casos_Ingresados,
                    SUM(CASE WHEN c.fe_conclucion IS NOT NULL THEN 1 ELSE 0 END) AS Casos_Resueltos,
                    (COUNT(c.id) - SUM(CASE WHEN c.fe_conclucion IS NOT NULL THEN 1 ELSE 0 END)) AS Casos_Tramite
                FROM casos c
                WHERE c.fiscal_fk = p_id_fiscal
                AND (p_fe_ingreso IS NULL OR c.fe_ing_caso >= p_fe_ingreso)
                AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                GROUP BY YEAR(c.fe_ing_caso)
                ORDER BY Anio ASC;
            END;
            "
        );

        //////////////////////////////////////////////// general plazo sede 
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenPlazosPorSede");

        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerResumenPlazosPorSede(
                IN p_id_sede INT,           -- ID de la sede a filtrar.
                IN p_fe_ingreso DATETIME,   -- Fecha de inicio para filtrar registros (usando cp.f_estado o cp.created_at).
                IN p_fe_fin DATETIME        -- Fecha de fin para filtrar registros.
            )
            BEGIN
                SELECT 
                    s.cod_sede AS Codigo_Sede,
                    s.nombre AS Nombre_Sede,
                    -- Total de plazos registrados para la sede (según el rango de fechas).
                    (
                        SELECT COUNT(cp.id)
                        FROM dependencias d
                        JOIN fiscales f ON d.id = f.dependencias_fk
                        JOIN casos c ON f.id = c.fiscal_fk
                        JOIN control_plazo cp ON c.id = cp.caso_fk
                        WHERE d.sede_fk = s.id
                        AND (p_fe_ingreso IS NULL OR IFNULL(cp.f_estado, cp.created_at) >= p_fe_ingreso)
                        AND (p_fe_fin IS NULL OR IFNULL(cp.f_estado, cp.created_at) <= p_fe_fin)
                    ) AS Cantidad_Plazos,
                    -- Cantidad de fiscales que tuvieron registros en control_plazo durante el último mes.
                    (
                        SELECT COUNT(DISTINCT f.id)
                        FROM dependencias d
                        JOIN fiscales f ON d.id = f.dependencias_fk
                        JOIN casos c ON f.id = c.fiscal_fk
                        JOIN control_plazo cp ON c.id = cp.caso_fk
                        WHERE d.sede_fk = s.id
                        AND cp.f_estado BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND CURDATE()
                    ) AS Cantidad_Fiscales_Ultimo_Mes,
                    -- Cantidad de dependencias que tuvieron al menos un registro en control_plazo durante el rango de fechas.
                    (
                        SELECT COUNT(DISTINCT d2.id)
                        FROM dependencias d2
                        JOIN fiscales f2 ON d2.id = f2.dependencias_fk
                        JOIN casos c2 ON f2.id = c2.fiscal_fk
                        JOIN control_plazo cp2 ON c2.id = cp2.caso_fk
                        WHERE d2.sede_fk = s.id
                        AND (p_fe_ingreso IS NULL OR IFNULL(cp2.f_estado, cp2.created_at) >= p_fe_ingreso)
                        AND (p_fe_fin IS NULL OR IFNULL(cp2.f_estado, cp2.created_at) <= p_fe_fin)
                    ) AS Cantidad_Dependencias
                FROM sedes s
                WHERE s.id = p_id_sede;
            END;
            "
        );


        //////////////////////////////////////////////
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenCondicionPorFiscal");

        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerResumenCondicionPorFiscal(
                IN p_id_fiscal INT,          -- ID del fiscal a consultar.
                IN p_fe_ingreso DATETIME,    -- Fecha de inicio para filtrar los casos (campo fe_ing_caso).
                IN p_fe_fin DATETIME         -- Fecha de fin para filtrar los casos (campo fe_ing_caso).
            )
            BEGIN
                SELECT 
                    cond.nombre AS Condicion,
                    COUNT(c.id) AS Cantidad,
                    ANY_VALUE(t.total_cases) AS Total_Casos,
                    ROUND(COUNT(c.id) / ANY_VALUE(t.total_cases) * 100, 2) AS Porcentaje
                FROM casos c
                JOIN condicion cond ON c.condicion_fk = cond.id
                CROSS JOIN (
                    SELECT COUNT(*) AS total_cases
                    FROM casos
                    WHERE fiscal_fk = p_id_fiscal
                    AND (p_fe_ingreso IS NULL OR fe_ing_caso >= p_fe_ingreso)
                    AND (p_fe_fin IS NULL OR fe_ing_caso <= p_fe_fin)
                ) t
                WHERE c.fiscal_fk = p_id_fiscal
                AND (p_fe_ingreso IS NULL OR c.fe_ing_caso >= p_fe_ingreso)
                AND (p_fe_fin IS NULL OR c.fe_ing_caso <= p_fe_fin)
                GROUP BY cond.nombre;
            END
            "
        );
        ///////////////////////////////////////////////
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenCondicionPorFiscalUltimoMes");

        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerResumenCondicionPorFiscalUltimoMes(
                IN p_id_fiscal INT  -- ID del fiscal a consultar.
            )
            BEGIN
                DECLARE v_max_fecha DATETIME;
                DECLARE v_first_day DATETIME;
                DECLARE v_last_day DATETIME;
                
                -- Obtener la última fecha de ingreso (fe_ing_caso) para el fiscal.
                SELECT MAX(fe_ing_caso) INTO v_max_fecha
                FROM casos
                WHERE fiscal_fk = p_id_fiscal;
                
                IF v_max_fecha IS NULL THEN
                    SELECT 'No hay casos registrados para este fiscal' AS Mensaje;
                ELSE
                    -- Calcular el primer y último día del mes de la última fecha de ingreso.
                    SET v_first_day = DATE_FORMAT(v_max_fecha, '%Y-%m-01');
                    SET v_last_day = LAST_DAY(v_max_fecha);
                    
                    SELECT 
                        MONTHNAME(v_max_fecha) AS Mes,
                        (SELECT COUNT(*) 
                        FROM casos 
                        WHERE fiscal_fk = p_id_fiscal 
                        AND fe_ing_caso BETWEEN v_first_day AND v_last_day) AS Total_Casos,
                        cond.nombre AS Condicion,
                        COUNT(c.id) AS Cantidad,
                        ROUND(
                        COUNT(c.id) / NULLIF(
                            (SELECT COUNT(*) 
                            FROM casos 
                            WHERE fiscal_fk = p_id_fiscal 
                            AND fe_ing_caso BETWEEN v_first_day AND v_last_day), 0
                        ) * 100, 2) AS Porcentaje
                    FROM casos c
                    JOIN condicion cond ON c.condicion_fk = cond.id
                    WHERE c.fiscal_fk = p_id_fiscal
                    AND c.fe_ing_caso BETWEEN v_first_day AND v_last_day
                    GROUP BY cond.nombre;
                END IF;
            END
            "
        );

        ///////////////////////////////////////////////////////////////
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenMensualPorAnioFiscal");

        DB::unprepared(
            "
            CREATE PROCEDURE ObtenerResumenMensualPorAnioFiscal(
                IN p_id_fiscal INT,  -- ID del fiscal.
                IN p_anio INT        -- Año para el cual se desea el resumen.
            )
            BEGIN
                SELECT 
                    ELT(MONTH(MAX(c.fe_ing_caso)), 'Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre') AS Mes,
                    COUNT(c.id) AS Casos_Ingresados,
                    SUM(CASE WHEN c.fe_conclucion IS NOT NULL THEN 1 ELSE 0 END) AS Casos_Resueltos,
                    (COUNT(c.id) - SUM(CASE WHEN c.fe_conclucion IS NOT NULL THEN 1 ELSE 0 END)) AS Casos_Tramite
                FROM casos c
                WHERE c.fiscal_fk = p_id_fiscal
                AND YEAR(c.fe_ing_caso) = p_anio
                GROUP BY MONTH(c.fe_ing_caso)
                ORDER BY MONTH(c.fe_ing_caso) ASC;
            END
            "
        );







        /////////////////// eliminar casos delitos, plazos
        DB::unprepared("DROP PROCEDURE IF EXISTS EliminarDatosDependencia");

        DB::unprepared(
            "
            CREATE PROCEDURE EliminarDatosDependencia(
                IN p_id_dependencia INT
            )
            BEGIN
                -- Iniciar transacción
                START TRANSACTION;
                
                -- Si p_id_dependencia es NULL, eliminar todos los datos de las tablas relevantes
                IF p_id_dependencia IS NULL THEN
                    DELETE FROM control_plazo;
                    DELETE FROM incidencias;
                    DELETE FROM casos;
                    DELETE FROM fiscales;
                ELSE
                    -- Eliminar registros de control_plazo relacionados con los casos de la dependencia
                    DELETE cp
                    FROM control_plazo cp
                    INNER JOIN casos c ON cp.caso_fk = c.id
                    INNER JOIN fiscales f ON c.fiscal_fk = f.id
                    WHERE f.dependencias_fk = p_id_dependencia;

                    -- Eliminar registros de incidencias relacionados con los casos de la dependencia
                    DELETE i
                    FROM incidencias i
                    INNER JOIN casos c ON i.casos_fk = c.id
                    INNER JOIN fiscales f ON c.fiscal_fk = f.id
                    WHERE f.dependencias_fk = p_id_dependencia;

                    -- Eliminar los casos asociados a la dependencia
                    DELETE c
                    FROM casos c
                    INNER JOIN fiscales f ON c.fiscal_fk = f.id
                    WHERE f.dependencias_fk = p_id_dependencia;

                    -- Eliminar los fiscales asociados a la dependencia
                    DELETE f
                    FROM fiscales f
                    WHERE f.dependencias_fk = p_id_dependencia;
                END IF;

                -- Confirmar la transacción
                COMMIT;

            END
            "
        );




    }



    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenDependenciasSede");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenSede");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerCasosPorDependencia");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerCasosPorAnioDependencia");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerTopDependencias");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenDependencias");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenFiscalesPorDependencia");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenResueltosFiscales");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenCasosFiscales");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerCantidadEtapasPorDependencia");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerCantidadEstadosPorDependencia");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerDespachosPorDependencia");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenDependenciasConFiscalesRango");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenPlazosDependencia");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenColoresDependencias");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenColoresPorAnioDependencia");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerPlazosDependencias");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerDespachosPorDependenciaConPlazo");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenPlazosDependencias");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenColoresPorFiscal");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerDatosDependenciaConColores");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerFiscalesConPlazos");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerColoresPorAnioDependencia");
        DB::unprepared("DROP PROCEDURE IF EXISTS ObtenerResumenColoresPorEtapa");
    }
};
