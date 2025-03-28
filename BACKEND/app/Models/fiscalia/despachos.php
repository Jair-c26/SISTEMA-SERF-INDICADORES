<?php

namespace App\Models\fiscalia;

use App\Models\carga\cargaFilcal;
use App\Models\delitos\delitos;
use App\Models\fiscales\fiscales;
use App\Models\logistica\Metas;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class despachos extends Model
{
    //

    
    use 
    HasFactory;

    protected $table = 'despachos';

    protected $fillable = [
        'cod_despa',
        'nombre_despacho',
        'telefono',
        'ruc',
        'dependencia_fk',
    ];

    public function User()
    {
        return $this->hasMany(User::class);
    }

    public function delitos()
    {
        return $this->hasMany(delitos::class,'dependencia_fk','id');
    }

    public function metas() // Una Marca puede tener muchos productos asociados.
    {
        return $this->hasMany(Metas::class, 'despacho_fk');
    }

    public function fiscales() // Una Marca puede tener muchos productos asociados.
    {
        return $this->hasMany(fiscales::class, 'despacho_fk','id');
    }

    public function dependencia_fk()
    {
        return $this->belongsTo(dependencias::class, 'dependencia_fk','id');
    }

}
