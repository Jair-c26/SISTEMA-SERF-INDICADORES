<?php

namespace App\Models\logistica\carga;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class etapas extends Model
{
    //

    use 
    HasFactory;

    protected $table = 'etapas';

    protected $fillable = [
        'cod_etapa',
        'etapa',
        'descripcion',  
    ];


    public function casos() // Una Marca puede tener muchos productos asociados.
    {
        return $this->hasMany(casos::class,'id','etapa_fk');
    }
}
