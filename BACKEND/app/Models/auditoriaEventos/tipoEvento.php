<?php

namespace App\Models\auditoriaEventos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class tipoEvento extends Model
{
    //

    use 
    HasFactory;

    protected $table = 'tipo_evento';

    protected $fillable = [
        'evento',
        'descripcion',  
    ];


    public function eventosSistema() // Una Marca puede tener muchos productos asociados.
    {
        return $this->hasMany(eventosSistema::class);
    }

}
