<?php

namespace App\Models\logistica\delitos;

use App\Models\delitos\delitos;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class tipo_delito extends Model
{
    //

    use 
    HasFactory;

    protected $table = 'casos_tipo_delitos';

    protected $fillable = [
        'cod_etapa',
        'etapa',
        'descripcion',  
    ];


    public function casos() // Una Marca puede tener muchos productos asociados.
    {
        return $this->hasMany(delitos::class,'id','etapa_fk');
    }
}
