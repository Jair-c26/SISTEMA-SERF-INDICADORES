<?php

namespace App\Models\fiscales;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class fiscal extends Model
{
    //
    use 
    HasFactory;

    protected $table = 'fiscal';

    protected $fillable = [
        'tipo',
        'especialidad'  
    ];


    public function fiscales() // Una Marca puede tener muchos productos asociados.
    {
        return $this->hasMany(fiscales::class);
    }

    public function User() // Una Marca puede tener muchos productos asociados.
    {
        return $this->hasMany(User::class);
    }
}
