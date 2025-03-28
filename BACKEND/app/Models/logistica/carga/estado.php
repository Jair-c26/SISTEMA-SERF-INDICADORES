<?php

namespace App\Models\logistica\carga;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class estado extends Model
{
    //

    use 
    HasFactory;

    protected $table = 'estado';

    protected $fillable = [
        'estado',
        'descripcion' 
    ];


    public function casos() // Una Marca puede tener muchos productos asociados.
    {
        return $this->hasMany(casos::class,'id','estado_fk');
    }
}
