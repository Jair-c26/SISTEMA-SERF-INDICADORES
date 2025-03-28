<?php

namespace App\Models\reporte;

use App\Models\auditoriaEventos\ipsUsers;
use App\Models\fiscalia\dependencias;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reporte extends Model
{
    //
    
    use HasFactory;

    protected $table = 'reporte';

    protected $fillable = [
        'cod_report',
        'tipo_repor',
        'user_fk',
        'fe_regis',
        'fe_inicio',
        'fe_fin',
        'estado',
        'condicion',
        'actividad_fk',
        'dependencia_fk',
    ];

    public function User()
    {
        return $this->belongsTo(User::class, 'user_fk');
    }

    public function ipsUsers()
    {
        return $this->belongsTo(ipsUsers::class, 'actividad_fk');
    }

    public function dependencias()
    {
        return $this->belongsTo(dependencias::class, 'dependencia_fk');
    }

}
