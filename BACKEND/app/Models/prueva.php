<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class prueva extends Model
{
    //

    use HasFactory;

    protected $table = 'prueva'; // Asegurar que la tabla sea 'prueva'

    protected $fillable = [
        'id_fiscal', 'no_fiscal', 'id_unico', 'fe_denuncia',
        'fe_ing_caso', 'fe_asig', 'id_etapa', 'de_etapa',
        'id_estado', 'de_estado', 'st_acumulado', 'tx_tipo_caso',
        'condicion', 'fe_conclusion', 'de_mat_deli'
    ];
}
