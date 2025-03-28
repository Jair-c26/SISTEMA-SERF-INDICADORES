<?php

namespace App\Http\Controllers\areas;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Response\ResponseApi;
use App\Models\fiscalia\region;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class regionController extends Controller
{
    //

    public function index()
    {
        $responseApi = new ResponseApi();
        try {
            // Filtrar usuarios activos, excluir al usuario con correo admin@gmail.com y cargar relaciones necesarias
            $listaRegion = region::all();

            if ($listaRegion->isEmpty()) {
                return $responseApi->error("No hay regiones registrados", 404);
            }

            return $responseApi->success("Lista de regiones registrados", 200, $listaRegion, "");
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }


    public function store(Request $request)
    {
        $responseApi = new ResponseApi();
        try {
            $validacion = Validator::make($request->all(), [
                'cod_regi' => 'required|max:50|unique:region',
                'nombre' => 'required|max:100|string',
                'telefono' => 'required|unique:region',
                'ruc' => 'required|unique:region',
                'departamento' => 'required|max:200|string',
                'cod_postal' => 'required',
                //'session_fk' => 'required|exists:Sesion,id',   ///nullable   boolean
            ]);

            if ($validacion->fails()) {
                return $responseApi->error("Error en la validación", 422, $validacion->errors());
            }

            // Creación del usuario
            $listaRegion = region::create([
                'cod_regi' => $request->cod_regi,
                'nombre' => $request->nombre,
                'telefono' => $request->telefono,
                'ruc' => $request->ruc,
                'departamento' => $request->departamento,
                'cod_postal' => $request->cod_postal,
            ]);

            if (!$listaRegion) {
                return $responseApi->error("Error en la creación de la region.", 422);
            }

            return $responseApi->success("sedes registrados correctamente.", 200, $listaRegion);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }


    public function update(Request $request, $id)
    {
        $responseApi = new ResponseApi();


        try {
            // Encontrar al usuario por ID
            $Region = region::find($id);

            if (!$Region) {
                return $responseApi->error("region no encontrado", 404);
            }

            // Validar los datos enviados
            $validacion = Validator::make($request->all(), [
                'cod_regi' => 'sometimes|max:50',
                'nombre' => 'sometimes|max:100|string',
                'telefono' => 'sometimes|unique:region',
                'ruc' => 'sometimes|unique:region',
                'departamento' => 'sometimes|max:200|string',
                'cod_postal' => 'sometimes',
                //'session_fk' => 'required|exists:Sesion,id',   ///nullable   boolean
            ]);

            if ($validacion->fails()) {
                return $responseApi->error("Error en la validación", 422, $validacion->errors());
            }

            // Filtrar solo los campos enviados para la actualización
            $camposActualizados = $request->only([
                'cod_regi',
                'nombre',
                'telefono',
                'ruc',
                'departamento',
                'cod_postal',
            ]);
            // Actualizar al usuario
            $Region->update($camposActualizados);

            return $responseApi->success("Region actualizado con éxito", 200, $Region);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }

    public function show($id)
    {
        $responseApi = new ResponseApi();

        try {
            // Buscar la región por ID
            $region = region::find($id);

            if (!$region) {
                return $responseApi->error("Región no encontrada", 404);
            }

            return $responseApi->success("Región encontrada", 200, $region);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $responseApi = new ResponseApi();

        try {
            // Buscar la región por ID
            $region = region::find($id);

            if (!$region) {
                return $responseApi->error("Región no encontrada", 404);
            }

            // Eliminar la región
            $region->delete();

            return $responseApi->success("Región eliminada con éxito", 200,'');
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }
}
