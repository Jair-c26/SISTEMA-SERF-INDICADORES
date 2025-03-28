<?php

namespace App\Models\logistica\plazo;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class color extends Model
{
    //

    use 
    HasFactory;

    protected $table = 'color_plazo';

    protected $fillable = [
        'color',
        'descripcion',  
    ];

    public function casos() // Una Marca puede tener muchos productos asociados.
    {
        return $this->hasMany(plazo::class,'id','etapa_fk');
    }
    
}
