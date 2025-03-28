<?php

namespace App\Http\Controllers\areas;

use Illuminate\Http\Request;
use App\Models\fiscalia\sedes;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Response\ResponseApi;

class sedesController extends Controller
{



    public function index()
    {
        $responseApi = new ResponseApi();
        try {
            // Filtrar usuarios activos, excluir al usuario con correo admin@gmail.com y cargar relaciones necesarias
            $listasedes = sedes::with('regional_fk')->get();

            if ($listasedes->isEmpty()) {
                return $responseApi->error("No hay sedes registrados", 404);
            }

            return $responseApi->success("Lista de sedes registrados", 200, $listasedes, "");
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }


    public function store(Request $request)
    {
        $responseApi = new ResponseApi();
        try {
            $validacion = Validator::make($request->all(), [
                'cod_sede' => 'required|max:50|unique:sedes',
                'nombre' => 'required|max:100|string',
                'telefono' => 'nullable|max:15|string',
                'ruc' => 'nullable|unique:sedes',
                'provincia' => 'nullable|max:200|string',
                'distrito_fiscal' => 'nullable|max:100|string',
                'codigo_postal' => 'nullable|max:20|string',
                'regional_fk' => 'nullable',
                //'session_fk' => 'required|exists:Sesion,id',   ///nullable   boolean
            ]);

            if ($validacion->fails()) {
                return $responseApi->error("Error en la validación", 422, $validacion->errors());
            }

            // Creación del usuario
            $listasedes = sedes::create([
                'cod_sede' => $request->cod_sede,
                'nombre' => $request->nombre,
                'telefono' => $request->telefono,
                'ruc' => $request->ruc,
                'provincia' => $request->provincia,
                'distrito_fiscal' => $request->distrito_fiscal,
                'codigo_postal' => $request->codigo_postal,
                'regional_fk' => $request->regional_fk,
            ]);

            if (!$listasedes) {
                return $responseApi->error("Error en la creación de sedes.", 422);
            }

            return $responseApi->success("sedes registrados correctamente.", 200, $listasedes);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }


    public function update(Request $request, $id)
    {
        $responseApi = new ResponseApi();

        try {
            // Encontrar al usuario por ID
            $sedes = sedes::find($id);

            if (!$sedes) {
                return $responseApi->error("sede no encontrado", 404);
            }

            // Validar los datos enviados
            $validacion = Validator::make($request->all(), [
                'cod_sede' => 'sometimes|max:50',
                'nombre' => 'sometimes|max:100|string',
                'telefono' => 'sometimes|max:15|string',
                'ruc' => 'sometimes|unique:sedes',
                'provincia' => 'sometimes|max:200|string',
                'distrito_fiscal' => 'sometimes|nullable|max:100|string',
                'codigo_postal' => 'sometimes|max:20|string',
                'regional_fk' => 'sometimes|nullable',
                //'session_fk' => 'required|exists:Sesion,id',   ///nullable   boolean
            ]);

            if ($validacion->fails()) {
                return $responseApi->error("Error en la validación", 422, $validacion->errors());
            }

            // Filtrar solo los campos enviados para la actualización
            $camposActualizados = $request->only([
                'cod_sede',
                'nombre',
                'telefono',
                'ruc',
                'provincia',
                'distrito_fiscal',
                'codigo_postal',
                'regional_fk',
            ]);
            // Actualizar al usuario
            $sedes->update($camposActualizados);

            return $responseApi->success("sede actualizado con éxito", 200, $sedes);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }



    public function show($id)
    {
        $responseApi = new ResponseApi();

        try {
            // Buscar la región por ID
            $sedes = sedes::with('regional_fk')->find($id);

            if (!$sedes) {
                return $responseApi->error("sedes no encontrada", 404);
            }

            return $responseApi->success("sedes encontrada", 200, $sedes);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $responseApi = new ResponseApi();

        try {
            // Buscar la región por ID
            $sedes = sedes::find($id);

            if (!$sedes) {
                return $responseApi->error("sedes no encontrada", 404);
            }

            // Verificar si el usuario ya está inactivo
            if (!$sedes->activo) {
                return $responseApi->error("La sede ya está inactivo", 400);
            }

            // Marcar el usuario como inactivo
            $sedes->activo = false;
            $sedes->save();

            /*
            // Eliminar la región
            $sedes->delete();
            */

            return $responseApi->success("sedes eliminada con éxito", 200, '');
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }



    public function listarDependenciasPorSede($id)
    {
        $responseApi = new ResponseApi();

        try {
            // Buscar la sede por ID con dependencias
            $sede = sedes::with('dependencias')->find($id);

            if (!$sede) {
                return $responseApi->error("Sede no encontrada", 404);
            }

            // Contar el número de dependencias
            $cantDependencias = $sede->dependencias->count();

            // Estructurar la respuesta con dependencias y la cantidad
            return $responseApi->success("Sede encontrada", 200, [
                'sede' => array_merge(
                    $sede->only(['id', 'cod_sede', 'nombre', 'telefono', 'ruc', 'provincia', 'distrito_fiscal', 'codigo_postal']),
                    ['cant_depen' => $cantDependencias]
                ),
                'dependencias' => $sede->dependencias
            ]);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage(), 400);
        }
    }


    public function listaAreas()
    {

        $responseApi = new ResponseApi();
        try {

            $dependencia = sedes::with('dependencias.despachos')->get();

            return $responseApi->success('lista areas completa', 200, $dependencia);
        } catch (\Exception $e) {
            return $responseApi->error('Error: Sugio un error en la lista ' . $e->getMessage());
        }
    }
}
