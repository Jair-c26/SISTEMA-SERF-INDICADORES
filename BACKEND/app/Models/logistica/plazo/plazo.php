<?php

namespace App\Models\logistica\plazo;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class plazo extends Model
{
    //
        
    use 
    HasFactory;

    protected $table = 'control_plazo';

    protected $fillable = [
        'caso_fk',
        'f_estado',
        'color_fk',
        'plazo',
        'tipo_caso',
        'dias',
        'observacion_plazo',
        'dias_paralizados',
        'dias_total_transcurridos',
];


    public function color() // Una Marca puede tener muchos productos asociados.
    {
        return $this->belongsTo(color::class,'color_fk');
    }
}
