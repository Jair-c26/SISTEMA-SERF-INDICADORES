<?php

namespace App\Models\logistica\carga;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class condicion extends Model
{
    //
    
    use 
    HasFactory;

    protected $table = 'condicion';

    protected $fillable = [
        'nombre',
        'descriccion',
    ];

    public function casos() // Una Marca puede tener muchos productos asociados.
    {
        return $this->hasMany(casos::class,'id','condicion_fk');
    }

}
