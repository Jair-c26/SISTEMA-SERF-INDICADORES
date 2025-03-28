<?php

namespace App\Models\archivos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class tipoRepor extends Model
{
    //
        
    use 
    HasFactory;

    protected $table = 'tipo_repor';

    protected $fillable = [
        'nombre',
        'decipcion'
    ];


    public function Carpetas() // Una Marca puede tener muchos productos asociados.
    {
        return $this->hasMany(Carpetas::class);
    }

}
