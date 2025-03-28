<?php

namespace App\Models\fiscalia;

use App\Models\fiscales\fiscales;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class dependencias extends Model
{
    //

    use 
    HasFactory;

    protected $table = 'dependencias';

    protected $fillable = [
        'cod_depen',
        'fiscalia',
        'tipo_fiscalia',
        'nombre_fiscalia',
        'activo',
        'carga',
        'delitos',
        'plazo',
        'telefono',
        'ruc',
        'sede_fk'
    ];

    public function despachos()
    {
        return $this->hasMany(despachos::class,'dependencia_fk', 'id');
    }

    public function fiscales()
    {
        return $this->hasMany(fiscales::class,'dependencias_fk', 'id');
    }

    public function sede_fk()
    {
        return $this->belongsTo(sedes::class, 'sede_fk','id');
    }

}
