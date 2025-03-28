<?php

namespace App\Http\Controllers\user;

use Exception;
use App\Models\user\Sesion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Response\ResponseApi;
use App\Models\User;

class SesionUserController extends Controller
{
    public function index()
    {
        $responseApi = new ResponseApi();
        try {
            // Asegúrate de que 'sesiones' es la tabla principal donde se aplica el filtro 'activo'
            //$listaSesiones = Sesion::with('user_fk:id,nombre,apellido,email,estado')->get();
            // Filtra las sesiones activas y con usuarios cuyo estado sea 1
            $listaSesiones = Sesion::with('user_fk:id,nombre,apellido,email,estado')
            ->where('estado_activo', 1) // Filtrar sesiones activas
            ->whereHas('user_fk', function ($query) {
                $query->where('estado', 1); // Filtrar usuarios activos
            })
            ->get();
            
            //dd('hasta aqui');
            if ($listaSesiones->isEmpty()) {
                return $responseApi->error("No se encontraron sesiones activas.", 404);
            }

            return $responseApi->success("Lista de sesiones cargada con éxito.", 200, $listaSesiones);
        } catch (Exception $th) {
            return $responseApi->error("Error al obtener la lista de sesiones: " . $th->getMessage(), 500);
        }
    }


    public function store($email)
    {
        $responseApi = new ResponseApi();
    
        try {
            // Busca el usuario por email
            $user = User::with('roles_fk')->where('email', $email)->first();
    
            if (!$user) {
                return $responseApi->error("Usuario no encontrado.", 404);
            }
    
            // Obtener la fecha y hora actual
            $fechaActual = now();
    
            //dd('hasta aqui');
            // Crear una nueva sesión con datos personalizados
            $datosSesion = [
                'user_fk' => $user->id,       // ID del usuario encontrado
                'estado_activo' => true,      // Por ejemplo, puedes establecerlo como activo
                'fecha_inicio' => $fechaActual,
                'fecha_cierre' => $fechaActual,
                'dispositivos'=>null,
                'navegador'=>null,
            ];
    
            // Crear la nueva sesión
            $nuevaSesion = Sesion::create($datosSesion);
    
            return $responseApi->success("Sesión creada con éxito.", 201, $nuevaSesion);
        } catch (Exception $th) {
            return $responseApi->error("Error: " . $th->getMessage(), 500);
        }
    }
    

    public function show($id)
    {
        $responseApi = new ResponseApi();
        try {
            // Busca la sesión activa con el ID proporcionado
            $sesion = Sesion::where('id', $id)->where('activo', true)->first();

            if (!$sesion) {
                return $responseApi->error("Sesión no encontrada o inactiva.", 404);
            }

            return $responseApi->success("Sesión encontrada.", 200, $sesion);
        } catch (Exception $th) {
            return $responseApi->error("Error: " . $th->getMessage(), 500);
        }
    }


    public function update(Request $request, $id)

    {
        $responseApi = new ResponseApi();
        try {
            $sesion = Sesion::find($id);

            if (!$sesion) {
                return $responseApi->error("Sesión no encontrada.", 404);
            }

            $validacion = Validator::make($request->all(), [
                'user_fk' => 'nullable|integer|exists:users,id|sometimes',
                'estado_activo' => 'nullable|boolean|sometimes',
                'fecha_inicio' => 'nullable|date|sometimes',
                'fecha_cierre' => 'nullable|date|sometimes',
                'dispositivos'=>'nullable|sometimes',
                'navegador'=>'nullable|sometimes'
            ]);

            if ($validacion->fails()) {
                return $responseApi->error("Validación fallida.", 400, $validacion->errors());
            }

            $sesion->update($request->all());

            return $responseApi->success("Sesión actualizada con éxito.", 200, $sesion);
        } catch (Exception $th) {
            return $responseApi->error("Error: " . $th->getMessage(), 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        $responseApi = new ResponseApi();
        try {
            $sesion = Sesion::find($id);

            if (!$sesion) {
                return $responseApi->error("Sesión no encontrada.", 404);
            }

            $sesion->delete();

            return $responseApi->success("Sesión eliminada con éxito.", 200, "");
        } catch (Exception $th) {
            return $responseApi->error("Error: " . $th->getMessage(), 500);
        }
    }



    public function updateFechaInicio($id): JsonResponse   //id del user
    {
        $responseApi = new ResponseApi();

        try {

            $sesion = Sesion::where('user_fk', $id)->first();


            if (!$sesion) {
                return $responseApi->error("Sesión no encontrada.", 404);
            }

            // Update 'fecha_inicio' with the current timestamp
            $sesion->update(['fecha_inicio' => now()]);

            return $responseApi->success("Fecha de inicio actualizada con éxito.", 200, $sesion);
        } catch (Exception $th) {
            return $responseApi->error("Error: " . $th->getMessage(), 500);
        }
    }

    public function updateFechafin($id): JsonResponse
    {
        $responseApi = new ResponseApi();

        try {
            
            $sesion = Sesion::where('user_fk',$id)->first();

            if (!$sesion) {
                return $responseApi->error("Sesión no encontrada.", 404);
            }

            //dd($sesion);
            // Update 'fecha_inicio' with the current timestamp
            $sesion->update(['fecha_cierre' => now()]);
            
            //dd($sesion);
            return $responseApi->success("Fecha de inicio actualizada con éxito.", 200, $sesion);
        } catch (Exception $th) {
            return $responseApi->error("Error: " . $th->getMessage(), 500);
        }
    }
}
