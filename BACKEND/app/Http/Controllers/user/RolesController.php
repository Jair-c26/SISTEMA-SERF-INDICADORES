<?php

namespace App\Http\Controllers\user;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Response\ResponseApi;
use App\Models\user\permisos;
use App\Models\user\roles;
use Illuminate\Support\Facades\Validator;
use Exception;


class RolesController extends Controller
{
    public function index()
    {
        //dd("hasta aqui");
        $responseApi = new ResponseApi();
        try {
            $listaRoles = roles::with('permisos_fk')->get();

            if ($listaRoles->isEmpty()) {
                return $responseApi->error("No se encontraron roles.", 404);
            }

            return $responseApi->success("Lista de roles cargada con éxito.", 200, $listaRoles);
        } catch (Exception $th) {
            return $responseApi->error("Error al obtener la lista de roles: " . $th->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        $responseApi = new ResponseApi();
        try {
            // Validación de los datos recibidos
            $validacion = Validator::make($request->all(), [
                'roles' => 'required|string|max:255',
                'descripcion' => 'nullable|string|max:200',
                // Campos del permiso (deben ser booleanos, no strings)
                'panel_control' => 'nullable|boolean',
                'ges_user' => 'nullable|boolean',
                'ges_areas' => 'nullable|boolean',
                'ges_fiscal' => 'nullable|boolean',
                'ges_reportes' => 'nullable|boolean',
                'ges_archivos' => 'nullable|boolean',
                'perfil' => 'nullable|boolean',
                'configuracion' => 'nullable|boolean',
            ]);

            // Si la validación falla, retornamos el error
            if ($validacion->fails()) {
                return $responseApi->error("Validación fallida.", 400, $validacion->errors());
            }

            // Buscar si el permiso ya existe con los valores recibidos
            $permiso = permisos::where([
                ['panel_control', '=', $request->panel_control],
                ['ges_user', '=', $request->ges_user],
                ['ges_areas', '=', $request->ges_areas],
                ['ges_fiscal', '=', $request->ges_fiscal],
                ['ges_reportes', '=', $request->ges_reportes],
                ['ges_archivos', '=', $request->ges_archivos],
                ['perfil', '=', $request->perfil],
                ['configuracion', '=', $request->configuracion],
            ])->first();

            // Si no se encuentra el permiso, se crea uno nuevo
            if (!$permiso) {
                $permiso = permisos::create([
                    'panel_control' => $request->panel_control,
                    'ges_user' => $request->ges_user,
                    'ges_areas' => $request->ges_areas,
                    'ges_fiscal' => $request->ges_fiscal,
                    'ges_reportes' => $request->ges_reportes,
                    'ges_archivos' => $request->ges_archivos,
                    'perfil' => $request->perfil,
                    'configuracion' => $request->configuracion,
                ]);
            }

            // Crear el rol y asignar el permiso
            $nuevoRol = Roles::create([
                'roles' => strtoupper($request->roles),
                'descripcion' => $request->descripcion,
                'permisos_fk' => $permiso->id,  // Asignamos el permiso al rol
            ]);

            // Verificar si el rol se creó correctamente
            if (!$nuevoRol) {
                return $responseApi->error("Error al crear el rol.", 500);
            }

            // Retornar el éxito con la respuesta
            return $responseApi->success("Rol creado con éxito.", 201, $nuevoRol);
        } catch (Exception $th) {
            return $responseApi->error("Error: " . $th->getMessage(), 500);
        }
    }



    public function show($id)
    {
        $responseApi = new ResponseApi();
        try {
            $rol = Roles::with('permisos_fk')->find($id);

            if (!$rol) {
                return $responseApi->error("Rol no encontrado.", 404);
            }

            return $responseApi->success("Rol encontrado.", 200, $rol);
        } catch (Exception $th) {
            return $responseApi->error("Error: " . $th->getMessage(), 500);
        }
    }



    public function update(Request $request, $id)
    {
        $responseApi = new ResponseApi();
        try {
            // Validación de los datos recibidos
            $validacion = Validator::make($request->all(), [
                'roles' => 'required|string|max:255',
                'descripcion' => 'nullable|string|max:200',
                // Campos del permiso (deben ser booleanos, no strings)
                'panel_control' => 'nullable|boolean',
                'ges_user' => 'nullable|boolean',
                'ges_areas' => 'nullable|boolean',
                'ges_fiscal' => 'nullable|boolean',
                'ges_reportes' => 'nullable|boolean',
                'ges_archivos' => 'nullable|boolean',
                'perfil' => 'nullable|boolean',
                'configuracion' => 'nullable|boolean',
            ]);

            // Si la validación falla, retornamos el error
            if ($validacion->fails()) {
                return $responseApi->error("Validación fallida.", 400, $validacion->errors());
            }

            // Buscar el rol por su ID
            $rol = Roles::find($id);

            // Si el rol no existe, retornamos un error
            if (!$rol) {
                return $responseApi->error("Rol no encontrado.", 404);
            }

            // Buscar si el permiso ya existe con los valores recibidos
            $permiso = permisos::where([
                ['panel_control', '=', $request->panel_control],
                ['ges_user', '=', $request->ges_user],
                ['ges_areas', '=', $request->ges_areas],
                ['ges_fiscal', '=', $request->ges_fiscal],
                ['ges_reportes', '=', $request->ges_reportes],
                ['ges_archivos', '=', $request->ges_archivos],
                ['perfil', '=', $request->perfil],
                ['configuracion', '=', $request->configuracion],
            ])->first();

            // Si no se encuentra el permiso, se crea uno nuevo
            if (!$permiso) {
                $permiso = permisos::create([
                    'panel_control' => $request->panel_control,
                    'ges_user' => $request->ges_user,
                    'ges_areas' => $request->ges_areas,
                    'ges_fiscal' => $request->ges_fiscal,
                    'ges_reportes' => $request->ges_reportes,
                    'ges_archivos' => $request->ges_archivos,
                    'perfil' => $request->perfil,
                    'configuracion' => $request->configuracion,
                ]);
            }

            // Actualizar los valores del rol
            $rol->roles = strtoupper($request->roles); // Convertimos el nombre del rol a mayúsculas
            $rol->descripcion = $request->descripcion;
            $rol->permisos_fk = $permiso->id; // Asociamos el permiso al rol

            // Guardar los cambios del rol
            $rol->save();

            // Retornar la respuesta con el rol actualizado
            return $responseApi->success("Rol {$rol->roles} actualizado con éxito.", 200, $rol);
        } catch (Exception $th) {
            return $responseApi->error("Error: " . $th->getMessage(), 500);
        }
    }


    public function destroy($id)
    {
        $responseApi = new ResponseApi();
        try {
            // Buscar el rol por su ID
            $rol = Roles::find($id);

            // Si el rol no existe, retornamos un error
            if (!$rol) {
                return $responseApi->error("Rol no encontrado.", 404);
            }

            // Eliminar la asociación de permisos FK en el rol
            $rol->permisos_fk = null; // Elimina la referencia al permiso (puedes decidir eliminar el permiso si es necesario)
            $rol->save(); // Guardamos los cambios

            // Ahora eliminamos el rol
            $rol->delete();

            return $responseApi->success("Rol {$rol->roles} eliminado con éxito.", 200, $rol->roles);

        } catch (Exception $th) {
            return $responseApi->error("Error: " . $th->getMessage(), 500);
        }
    }

}
