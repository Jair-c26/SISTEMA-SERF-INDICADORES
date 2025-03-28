<?php

namespace App\Models\archivos;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class archivos extends Model
{
    //

    use
        HasFactory;

    protected $table = 'archivos';

    protected $fillable = [
        'codigo',
        'nombre',
        'peso_arch',
        'tipo_arch',
        'url_archivo',
        'file_path',      // Nuevo campo para almacenar la ruta interna
        'user_fk',
        'carpeta_fk',
    ];


    public function detalles_archi() // Una Marca puede tener muchos productos asociados.
    {
        return $this->hasMany(detalles_archi::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_fk');
    }

    public function carpeta() // Nombre en singular
    {
        return $this->belongsTo(Carpetas::class, 'carpeta_fk','id');
    }
}
