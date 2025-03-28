<?php

namespace App\Models\logistica;

use App\Models\fiscalia\despachos;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Metas extends Model
{
    //

    use HasFactory;

    protected $table = 'metas';

    protected $fillable = [
        'cantidad',
        'fe_ingreso',
        'cantidad_fiscal',
        'metas_fiscal',
        'despacho_fk'
    ];

    public function despachos()
    {
        return $this->belongsTo(despachos::class, 'despacho_fk');
    }
}
