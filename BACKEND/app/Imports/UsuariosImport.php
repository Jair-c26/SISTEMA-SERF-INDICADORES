<?php
namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Carbon\Carbon;

class UsuariosImport implements ToModel, WithHeadingRow
{
    /**
     * Mapear cada fila a un modelo de usuario.
     *
     * @param array $row
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        return new User([
            'uuid'=>$row['uuid'],
            'nombre' => $row['nombre'],
            'apellido' => $row['apellido'],
            'telefono' => $row['telefono'],
            'email' => $row['email'],
            'dni' => $row['dni'],
            'sexo' => $row['sexo'] ?? null,
            'direccion' => $row['direccion'] ?? null,
            'fecha_nacimiento' => $this->formatDate($row['fecha_de_nacimiento'] ?? null),
            'foto_perfil' => $row['foto_de_perfil'] ?? null,
            'extension' => $row['extension'] ?? 'sin registrar',
            'tipo_fiscal' => $row['tipo_fiscal'] ?? null,
            'activo' => $row['activo'] == 1 ? true : false,
            'fecha_ingreso' => $this->formatDate($row['fecha_de_ingreso'] ?? null),
            'email_verified_at' => $this->formatDate($row['email_verified_at'] ?? null),
            'password' => $row['password'] ?? 'default_password',
            'estado' => $row['estado'] == 1 ? true : false,
            'despacho_fk' => is_numeric($row['despacho']) ? (int)$row['despacho'] : null,
            'roles_fk' => is_numeric($row['rol']) ? (int)$row['rol'] : null,
            'fiscal_fk' => is_numeric($row['fiscal']) ? (int)$row['fiscal'] : null,
            'created_at' => $this->formatDate($row['created_at'] ?? null),
            'updated_at' => $this->formatDate($row['update_at'] ?? null),
        ]);
    }

    /**
     * Validar y formatear fechas al formato 'YYYY-MM-DD'.
     *
     * @param string|null $date
     * @return string|null
     */
    private function formatDate($date)
    {
        if (!$date) {
            return null; // Retorna null si la fecha no está definida
        }

        try {
            return Carbon::parse($date)->format('Y-m-d'); // Formatear al formato MySQL
        } catch (\Exception $e) {
            return null; // Retorna null si el formato es inválido
        }
    }
}
