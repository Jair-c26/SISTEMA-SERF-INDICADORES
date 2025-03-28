<?php

namespace App\Models\user;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class permisos extends Model
{
    use 
    HasFactory;

    protected $table = 'permisos';

    protected $fillable = [
        'panel_control',
        'ges_user',
        'ges_areas',
        'ges_fiscal',
        'ges_reportes',
        'ges_archivos',
        'perfil',
        'configuracion',
    ];


    public function roles() // Una Marca puede tener muchos productos asociados.
    {
        return $this->hasMany(roles::class,'permisos_fk');
    }
}
