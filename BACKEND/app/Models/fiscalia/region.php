<?php

namespace App\Models\fiscalia;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class region extends Model
{
    //

    use 
    HasFactory;

    protected $table = 'region';

    protected $fillable = [
        'cod_regi',
        'nombre',
        'telefono',
        'ruc',
        'departamento',
        'cod_postal'  
    ];

    public function sedes()
    {
        return $this->hasMany(sedes::class,'regional_fk','id');
    }

}
