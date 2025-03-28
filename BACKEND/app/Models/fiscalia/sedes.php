<?php

namespace App\Models\fiscalia;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class sedes extends Model
{
    //
    use 
    HasFactory;

    protected $table = 'sedes';

    protected $fillable = [
        'cod_sede',
        'nombre',
        'telefono',
        'ruc',
        'provincia',
        'distrito_fiscal',
        'codigo_postal',
        'regional_fk',
    ];

    public function dependencias()
    {
        return $this->hasMany(dependencias::class,'sede_fk', 'id');
    }

    public function regional_fk()
    {
        return $this->belongsTo(region::class, 'regional_fk');
    }

}
