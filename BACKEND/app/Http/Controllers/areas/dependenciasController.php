<?php

namespace App\Http\Controllers\areas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\fiscalia\dependencias;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Response\ResponseApi;

class dependenciasController extends Controller
{

    public function index()
    {
        $responseApi = new ResponseApi();
        try {
            // Filtrar usuarios activos, excluir al usuario con correo admin@gmail.com y cargar relaciones necesarias
            //$listadependencias = dependencias::all();
            $listadependencias = dependencias::with('sede_fk')->get();

            if ($listadependencias->isEmpty()) {
                return $responseApi->error("No hay dependencias registrados", 404);
            }

            return $responseApi->success("Lista de dependencias registrados", 200, $listadependencias, "");
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }


    public function store(Request $request)
    {
        $responseApi = new ResponseApi();
        try {
            $validacion = Validator::make($request->all(), [
                'cod_depen' => 'required|max:50|string|unique:dependencias,cod_depen',
                'fiscalia' => 'required|max:200|string',
                'tipo_fiscalia' => 'nullable|max:200|string',
                'nombre_fiscalia' => 'nullable|max:200|string',
                'telefono' => 'nullable|max:15|string',
                'carga' => 'nullable|boolean',
                'delitos' => 'nullable|boolean',
                'plazo' => 'nullable|boolean',
                'ruc' => 'nullable|max:13|string',
                'sede_fk' => 'nullable',
                //'session_fk' => 'required|exists:Sesion,id',   ///nullable   boolean
            ]);

            if ($validacion->fails()) {
                return $responseApi->error("Error en la validación", 422, $validacion->errors());
            }

            // Creación del usuario
            $listasedes = dependencias::create([
                'cod_depen' => $request->cod_depen,
                'fiscalia' => $request->fiscalia,
                'tipo_fiscalia' => $request->tipo_fiscalia,
                'nombre_fiscalia' => $request->nombre_fiscalia,
                'telefono' => $request->telefono,
                'carga' => $request->carga,
                'delitos' => $request->delitos,
                'plazo' => $request->plazo,
                'ruc' => $request->ruc,
                'sede_fk' => $request->sede_fk,
            ]);

            if (!$listasedes) {
                return $responseApi->error("Error en la creación de dependencias.", 422);
            }
            //dd("hasta aqui");

            return $responseApi->success("dependencias registrados correctamente.", 200, $listasedes);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }


    public function update(Request $request, $id)
    {
        $responseApi = new ResponseApi();

        try {
            // Encontrar al usuario por ID
            $dependencias = dependencias::find($id);

            if (!$dependencias) {
                return $responseApi->error("dependencias no encontrado", 404);
            }

            // Validar los datos enviados
            $validacion = Validator::make($request->all(), [
                'cod_depen' => 'sometimes|max:50|string',
                'fiscalia' => 'sometimes|max:100|string',
                'tipo_fiscalia' => 'sometimes|max:100|string',
                'nombre_fiscalia' => 'sometimes|max:100|string',
                'telefono' => 'nullable|max:15|string',
                'carga' => 'sometimes|boolean',
                'delitos' => 'sometimes|boolean',
                'plazo' => 'sometimes|boolean',
                'ruc' => 'sometimes|max:13|string',
                'sede_fk' => 'nullable',
                //'session_fk' => 'required|exists:Sesion,id',   ///nullable   boolean
            ]);

            if ($validacion->fails()) {
                return $responseApi->error("Error en la validación", 422, $validacion->errors());
            }

            // Filtrar solo los campos enviados para la actualización
            $camposActualizados = $request->only([
                'cod_depen',
                'fiscalia',
                'tipo_fiscalia',
                'nombre_fiscalia',
                'telefono',
                'carga',
                'delitos',
                'plazo',
                'ruc',
                'sede_fk',
            ]);
            // Actualizar al usuario
            $dependencias->update($camposActualizados);

            return $responseApi->success("dependencias actualizado con éxito", 200, $dependencias);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }



    public function show($id)
    {
        $responseApi = new ResponseApi();

        try {
            // Buscar la región por ID
            $dependencias = dependencias::find($id);

            if (!$dependencias) {
                return $responseApi->error("dependencias no encontrada", 404);
            }

            return $responseApi->success("dependencias encontrada", 200, $dependencias);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $responseApi = new ResponseApi();

        try {
            // Buscar la región por ID
            $dependencias = dependencias::find($id);

            if (!$dependencias) {
                return $responseApi->error("dependencias no encontrada", 404);
            }

            // Verificar si el usuario ya está inactivo
            if (!$dependencias->activo) {
                return $responseApi->error("La dependencia ya está inactivo", 400);
            }

            // Marcar el usuario como inactivo
            $dependencias->activo = false;
            $dependencias->save();


            // Eliminar la región
            //$dependencias->delete();

            return $responseApi->success("dependencias eliminada con éxito", 200, '');
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }



    public function listarDespachosPorDepen($id)
    {
        $responseApi = new ResponseApi();

        try {
            // Buscar la dependencia por ID con despachos
            $dependencia = dependencias::with('despachos')->find($id);

            if (!$dependencia) {
                return $responseApi->error("Dependencia no encontrada", 404);
            }

            // Contar el número de despachos
            $cantDespachos = $dependencia->despachos->count();

            // Estructurar la respuesta con despachos y la cantidad
            return $responseApi->success("Dependencia encontrada", 200, [
                'dependencia' => array_merge(
                    $dependencia->only(['id', 'cod_depen', 'fiscalia', 'tipo_fiscalia', 'nombre_fiscalia', 'telefono', 'ruc']),
                    ['cant_despachos' => $cantDespachos]
                ),
                'despachos' => $dependencia->despachos
            ]);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage(), 400);
        }
    }
}
