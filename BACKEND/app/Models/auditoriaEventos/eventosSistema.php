<?php

namespace App\Models\auditoriaEventos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class eventosSistema extends Model
{
    //
    
    use 
    HasFactory;

    protected $table = 'eventos_sistemas';

    protected $fillable = [
        'ips_user_fk',
        't_evento_fk',  
        'mopdulo_afec',  
        'descripcion', 
        'fecha_registro', 
    ];

    public function tipoEvento() // Una Marca puede tener muchos productos asociados.
    {
        return $this->hasMany(tipoEvento::class);
    }
    public function ipsUsers()
    {
        return $this->belongsTo(ipsUsers::class, 'ips_user_fk');
    }

    public function t_evento_fk()
    {
        return $this->belongsTo(tipoEvento::class, 't_evento_fk');
    }
}
