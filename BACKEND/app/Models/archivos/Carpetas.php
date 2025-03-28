<?php

namespace App\Models\archivos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Carpetas extends Model
{
    //

    use HasFactory;

    protected $table = 'carpetas';

    protected $fillable = [
        'codigo_carp',
        'nombre_carp',
        'tip_carp',
        'direc_carp',
        'tipo_repor_fk',
    ];


    public function archivos()
    {
        return $this->hasMany(archivos::class, 'carpeta_fk','id'); // Especificar la clave foránea correcta
    }

    public function tipoRepor()
    {
        return $this->belongsTo(tipoRepor::class, 'tipo_repor_fk');
    }
}
