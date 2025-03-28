<?php

namespace App\Models\user;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sesion extends Model
{
    //
    use HasFactory;

    protected $table = 'sesion_user';


    protected $fillable = [
        'user_fk',
        'estado_activo',
        'fecha_inicio',
        'fecha_cierre',
        'dispositivos',
        'navegador',
    ];

    public function user_fk()
    {
        return $this->belongsTo(User::class, 'user_fk'); // Asegúrate que 'user_fk' sea la clave foránea
    }
}
