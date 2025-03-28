<?php

namespace App\Models\logistica\carga;

use App\Models\fiscales\fiscal;
use App\Models\logistica\delitos\delito;
use App\Models\logistica\plazo\plazo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class casos extends Model
{

    use HasFactory;

    protected $table = 'casos';

    protected $fillable = [
        'codi_caso',
        'fiscal_fk',
        'fe_denuncia',
        'fe_ing_caso',
        'fe_asignacion',
        'fe_conclucion',
        'tx_tipo_caso',
        'condicion_fk',
        'estado_fk',
        'etapa_fk',
    ];



    public function fiscal()
    {
        return $this->belongsTo(fiscal::class, 'fiscal_fk');
    }

    public function estado()
    {
        return $this->belongsTo(estado::class, 'estado_fk');
    }

    public function etapas()
    {
        return $this->belongsTo(etapas::class, 'etapa_fk');
    }

    public function condicion()
    {
        return $this->belongsTo(condicion::class, 'condicion_fk');
    }

    public function plazo() // Una Marca puede tener muchos productos asociados.
    {
        return $this->hasMany(plazo::class,'id','caso_fk');
    }
    public function delito() // Una Marca puede tener muchos productos asociados.
    {
        return $this->hasMany(delito::class,'id','casos_fk');
    }
}
