<?php

namespace App\Models\archivos;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class detalles_archi extends Model
{
    //

    use 
    HasFactory;

    protected $table = 'detalles_archi';

    protected $fillable = [
        'user_fk',
        'archivo_fk',  
        'fecha_registro'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_fk');
    }

    public function archivos()
    {
        return $this->belongsTo(archivos::class, 'archivo_fk');
    }
}
