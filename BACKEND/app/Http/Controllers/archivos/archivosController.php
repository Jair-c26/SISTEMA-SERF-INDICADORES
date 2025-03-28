<?php

namespace App\Http\Controllers\archivos;

use Illuminate\Http\Request;
use App\Models\archivos\archivos;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Response\ResponseApi;
use Illuminate\Support\Facades\Validator;

class archivosController extends Controller
{

    // Listar todos los archivos
    public function index()
    {
        $responseApi = new ResponseApi();
        try {
            $listArchivos = archivos::all();
            if ($listArchivos->isEmpty()) {
                return $responseApi->error('ERROR: No se encontraron archivos', 404);
            }
            return $responseApi->success('Lista de archivos', 200, $listArchivos);
        } catch (\Exception $th) {
            return $responseApi->error('Error al listar archivos: ' . $th->getMessage(), 500);
        }
    }

    // Crear un nuevo archivo
    public function store(Request $request)
    {
        $responseApi = new ResponseApi();
        try {
            $validacion = Validator::make($request->all(), [
                'codigo' => 'required|string|max:50|unique:archivos,codigo',
                'nombre' => 'required|string|max:100',
                'peso_arch' => 'required|numeric',
                'tipo_arch' => 'required|string|max:50',
                'url_archivo' => 'required|string',
                'user_fk' => 'required|exists:users,id',
                'carpeta_fk' => 'required|exists:carpetas,id',
            ]);

            if ($validacion->fails()) {
                return $responseApi->error('Error en la validación', 422, $validacion->errors());
            }

            $archivo = archivos::create($request->all());
            return $responseApi->success('Archivo creado con éxito', 201, $archivo);
        } catch (\Exception $th) {
            return $responseApi->error('Error al crear archivo: ' . $th->getMessage(), 500);
        }
    }

    // Obtener un archivo por ID
    public function show($id)
    {
        $responseApi = new ResponseApi();
        try {
            $archivo = archivos::find($id);
            if (!$archivo) {
                return $responseApi->error('Archivo no encontrado', 404);
            }
            return $responseApi->success('Archivo encontrado', 200, $archivo);
        } catch (\Exception $th) {
            return $responseApi->error('Error al obtener archivo: ' . $th->getMessage(), 500);
        }
    }

    // Actualizar un archivo
    public function update(Request $request, $id)
    {
        $responseApi = new ResponseApi();
        try {
            $archivo = archivos::find($id);
            if (!$archivo) {
                return $responseApi->error('Archivo no encontrado', 404);
            }

            $validacion = Validator::make($request->all(), [
                'codigo' => 'sometimes|string|max:50|unique:archivos,codigo,' . $id,
                'nombre' => 'sometimes|string|max:100',
                'peso_arch' => 'sometimes|numeric',
                'tipo_arch' => 'sometimes|string|max:50',
                'url_archivo' => 'sometimes|string',
                'user_fk' => 'sometimes|exists:users,id',
                'carpeta_fk' => 'sometimes|exists:carpetas,id',
            ]);

            if ($validacion->fails()) {
                return $responseApi->error('Error en la validación', 422, $validacion->errors());
            }

            $archivo->update($request->all());
            return $responseApi->success('Archivo actualizado con éxito', 200, $archivo);
        } catch (\Exception $th) {
            return $responseApi->error('Error al actualizar archivo: ' . $th->getMessage(), 500);
        }
    }

    // Eliminar un archivo
    public function destroy($id)
    {
        $responseApi = new ResponseApi();
        try {
            $archivo = archivos::find($id);
            if (!$archivo) {
                return $responseApi->error('Archivo no encontrado', 404);
            }
            $archivo->delete();
            return $responseApi->success('Archivo eliminado con éxito', 200,$id);
        } catch (\Exception $th) {
            return $responseApi->error('Error al eliminar archivo: ' . $th->getMessage(), 500);
        }
    }
}
