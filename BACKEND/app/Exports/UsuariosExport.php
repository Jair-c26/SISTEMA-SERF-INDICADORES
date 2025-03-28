<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;

class UsuariosExport implements FromCollection, WithHeadings
{
/**
     * Obtener todos los usuarios de la base de datos.
     *
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        // Obtener todos los usuarios
        //return User::all();
        return User::where('email', '!=', 'admin@gmail.com')->get();

    }

    /**
     * Definir los encabezados del archivo Excel.
     *
     * @return array
     */
    public function headings(): array
    {
        return [
            'id','UUID', 'Nombre', 'Apellido', 'Teléfono', 'Email', 'DNI', 'Sexo',
            'Dirección', 'Fecha de Nacimiento', 'Foto de Perfil', 'Extensión', 'Tipo Fiscal',
            'Activo', 'Fecha de Ingreso','email_verified_at','password', 'Estado', 'Despacho', 'Rol', 'Fiscal','created_at','update_at'
        ];
    }
}
