<?php

namespace App\Http\Controllers\areas;

use Illuminate\Http\Request;
use App\Models\fiscalia\despachos;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Response\ResponseApi;

class despachosController extends Controller
{
    public function index()
    {
        $responseApi = new ResponseApi();
        try {
            // Filtrar usuarios activos, excluir al usuario con correo admin@gmail.com y cargar relaciones necesarias
            $listadespachos = despachos::with('dependencia_fk')->get();

            if ($listadespachos->isEmpty()) {
                return $responseApi->error("No hay lista despachos registrados", 404);
            }

            return $responseApi->success("Lista de lista despachos registrados", 200, $listadespachos, "");
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }


    public function store(Request $request)
    {
        $responseApi = new ResponseApi();
        try {
            $validacion = Validator::make($request->all(), [
                'cod_despa' => 'required|max:50|string|unique:despachos,cod_despa',
                'nombre_despacho' => 'required|max:100|string',
                'telefono' => 'nullable|max:15|string',
                'ruc' => 'nullable|max:15|string',
                'dependencia_fk' => 'nullable',
                //'session_fk' => 'required|exists:Sesion,id',   ///nullable   boolean
            ]);

            if ($validacion->fails()) {
                return $responseApi->error("Error en la validación", 422, $validacion->errors());
            }

            // Creación del usuario
            $listadespachos = despachos::create([
                'cod_despa' => $request->cod_despa,
                'nombre_despacho' => $request->nombre_despacho,
                'telefono' => $request->telefono,
                'ruc' => $request->ruc,
                'dependencia_fk' => $request->dependencia_fk,
            ]);

            if (!$listadespachos) {
                return $responseApi->error("Error en la creación de despacho.", 422);
            }

            return $responseApi->success("despacho registrados correctamente.", 200, $listadespachos);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }


    public function update(Request $request, $id)
    {
        $responseApi = new ResponseApi();

        try {
            // Encontrar al usuario por ID
            $despacho = despachos::find($id);

            if (!$despacho) {
                return $responseApi->error("despacho no encontrado", 404);
            }

            // Validar los datos enviados
            $validacion = Validator::make($request->all(), [
                'cod_despa' => 'sometimes|max:50|string',
                'nombre_despacho' => 'sometimes|max:100|string',
                'telefono' => 'sometimes|max:15|string',
                'ruc' => 'sometimes|max:15|string',
                'dependencia_fk' => 'nullable',
                //'session_fk' => 'required|exists:Sesion,id',   ///nullable   boolean
            ]);

            if ($validacion->fails()) {
                return $responseApi->error("Error en la validación", 422, $validacion->errors());
            }

            // Filtrar solo los campos enviados para la actualización
            $camposActualizados = $request->only([
                'cod_despa',
                'nombre_despacho',
                'telefono',
                'ruc',
                'dependencia_fk',
            ]);
            // Actualizar al usuario
            $despacho->update($camposActualizados);

            return $responseApi->success("Despacho actualizado con éxito.", 200, $despacho);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }



    public function show($id)
    {
        $responseApi = new ResponseApi();

        try {
            // Buscar la región por ID
            $despacho = despachos::find($id);

            if (!$despacho) {
                return $responseApi->error("despacho no encontrada", 404);
            }

            return $responseApi->success("despacho encontrado", 200, $despacho);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $responseApi = new ResponseApi();

        try {
            // Buscar la región por ID
            $despacho = despachos::find($id);

            if (!$despacho) {
                return $responseApi->error("despacho no encontrada", 404);
            }

            // Verificar si el usuario ya está inactivo
            if (!$despacho->activo) {
                return $responseApi->error("La despacho ya está inactivo", 400);
            }

            // Marcar el usuario como inactivo
            $despacho->activo = false;
            $despacho->save();

            // Eliminar la región
            //$despacho->delete();

            return $responseApi->success("despacho eliminado con éxito", 200, '');
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }
}
