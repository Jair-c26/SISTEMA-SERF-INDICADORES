<?php

namespace App\Models\logistica\delitos;

use App\Models\logistica\carga\casos;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class delito extends Model
{
    //
    
    use 
    HasFactory;

    protected $table = 'incidencias';

    protected $fillable = [
        'casos_fk',
        't_delito_fk',
];


    public function TipoDelito() // Una Marca puede tener muchos productos asociados.
    {
        return $this->belongsTo(tipo_delito::class,'t_delito_fk');
    }

    public function casos() // Una Marca puede tener muchos productos asociados.
    {
        return $this->belongsTo(casos::class,'casos_fk');
    }
}
