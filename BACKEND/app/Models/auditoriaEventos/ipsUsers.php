<?php

namespace App\Models\auditoriaEventos;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ipsUsers extends Model
{
    //

    
    use 
    HasFactory;

    protected $table = 'ips_users';

    protected $fillable = [
        'user_fk',
        'ip_origen',  
        'clase_ip',  
        'fecha_registro', 
    ];


    public function eventosSistema() // Una Marca puede tener muchos productos asociados.
    {
        return $this->hasMany(eventosSistema::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_fk');
    }
}
