<?php

namespace App\Models\fiscales;

use App\Models\archivos\codDoc;
use App\Models\carga\cargaFilcal;
use App\Models\fiscalia\dependencias;
use App\Models\fiscalia\despachos;
use App\Models\logistica\carga\casos as CargaCasos;
use App\Models\logistica\casos;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class fiscales extends Model
{

    use
        HasFactory;

    protected $table = 'fiscales';

    protected $fillable = [
        'id_fiscal',
        'nombres_f',
        'email_f',
        'dni_f',
        'activo',
        'ti_fiscal_fk',
        'despacho_fk',
        'dependencias_fk',
        'espacialidad'
    ];


    public function casos() // Una Marca puede tener muchos productos asociados.
    {
        return $this->hasMany(CargaCasos::class);
    }

    public function fiscal()
    {
        return $this->belongsTo(fiscal::class, 'ti_fiscal_fk');
    }

    public function despachos()
    {
        return $this->belongsTo(despachos::class, 'despacho_fk');
    }

    public function dependencia()
    {
        return $this->belongsTo(dependencias::class, 'dependencias_fk');
    }


}
