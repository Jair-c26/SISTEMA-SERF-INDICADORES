<?php

namespace Database\Seeders;

use App\Models\user\permisos;
use App\Models\user\roles;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesUser extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        permisos::create([    ///Administrador
            'panel_control' => true,
            'ges_user' => true,
            'ges_areas' => true,
            'ges_fiscal' => true,
            'ges_reportes' => true,
            'ges_archivos' => true,
            'perfil' => true,
            'configuracion' => true
        ]);

        permisos::create([    ///Sub Administrador
            'panel_control' => true,
            'ges_user' => false,
            'ges_areas' => true,
            'ges_fiscal' => true,
            'ges_reportes' => true,
            'ges_archivos' => true,
            'perfil' => true,
            'configuracion' => true
        ]);

        permisos::create([    ////// Usuario Estadístico
            'panel_control' => true,
            'ges_user' => false,
            'ges_areas' => true,
            'ges_fiscal' => true,
            'ges_reportes' => true,
            'ges_archivos' => true,
            'perfil' => true,
            'configuracion' => false
        ]);

        permisos::create([    //// Usuario
            'panel_control' => true,
            'ges_user' => false,
            'ges_areas' => false,
            'ges_fiscal' => false,
            'ges_reportes' => true,
            'ges_archivos' => false,
            'perfil' => true,
            'configuracion' => false
        ]);

        roles::create([
            'roles' => 'Administrador',
            'descripcion' => 'Administra todo el sistema',
            'permisos_fk' => 1
        ]);
        roles::create([
            'roles' => 'Sub Administrador',
            'descripcion' => 'Administra todas las funciones del sistema',
            'permisos_fk' => 2
        ]);

        roles::create([
            'roles' => 'Usuario Estadístico',
            'descripcion' => 'Administra la información estadística del sistema',
            'permisos_fk' => 3
        ]);
        roles::create([
            'roles' => 'Usuario',
            'descripcion' => 'Visualiza las funciones del sistema',
            'permisos_fk' => 4
        ]);
    }
}
