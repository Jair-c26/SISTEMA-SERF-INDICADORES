<?php

namespace App\Http\Controllers\fiscal;

use Exception;
use Illuminate\Http\Request;
use App\Models\fiscales\fiscales;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Response\ResponseApi;

class fiscalesController extends Controller
{
    //
    /**
     * Listar todos los fiscales (con relaciones opcionales)
     */
    public function index()
    {
        $responseApi = new ResponseApi();
        try {
            $listaFiscales = fiscales::with(['fiscal', 'despachos', 'dependencia'])
                ->get();

            if ($listaFiscales->isEmpty()) {
                return $responseApi->error("No se encontraron fiscales", 404);
            }

            return $responseApi->success("Lista de fiscales", 200, $listaFiscales, "");
        } catch (Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage(), 500);
        }
    }

    /**
     * Mostrar un fiscal en específico
     */
    public function show($id)
    {
        $responseApi = new ResponseApi();
        try {
            $fiscal = fiscales::with(['fiscal', 'despachos', 'dependencia'])
                ->find($id);

            if (!$fiscal) {
                return $responseApi->error("Fiscal no encontrado", 404);
            }

            return $responseApi->success("Fiscal encontrado", 200, $fiscal);
        } catch (Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage(), 500);
        }
    }

    /**
     * Crear un nuevo fiscal
     */
    public function store(Request $request)
    {
        $responseApi = new ResponseApi();
        try {
            $validacion = Validator::make($request->all(), [
                'id_fiscal'      => 'required|string|max:50|unique:fiscales,id_fiscal',
                'nombres_f'       => 'required|string|max:100',
                'email_f'         => 'required|email|unique:fiscales,email_f',
                'dni_f'           => 'required|string|max:10|unique:fiscales,dni_f',
                'activo'          => 'sometimes|boolean',
                'ti_fiscal_fk'    => 'nullable|exists:fiscal,id',
                'despacho_fk'     => 'nullable|exists:despachos,id',
                'dependencias_fk' => 'required|exists:dependencias,id',
                'espacialidad'    => 'nullable|string|max:100'
            ]);

            if ($validacion->fails()) {
                return $responseApi->error("Error en la validación", 422, $validacion->errors());
            }

            $fiscal = fiscales::create([
                'id_fiscal'      => $request->cod_fiscal,
                'nombres_f'       => $request->nombres_f,
                'email_f'         => $request->email_f,
                'dni_f'           => $request->dni_f,
                'activo'          => $request->activo ?? true,
                'ti_fiscal_fk'    => $request->ti_fiscal_fk,
                'despacho_fk'     => $request->despacho_fk,
                'dependencias_fk' => $request->dependencias_fk,
                'espacialidad'    => $request->espacialidad,
            ]);

            if (!$fiscal) {
                return $responseApi->error("Error al crear el fiscal", 422);
            }

            return $responseApi->success("Fiscal creado con éxito", 201, $fiscal);
        } catch (Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage(), 500);
        }
    }

    /**
     * Actualizar un fiscal existente
     */
    public function update(Request $request, $id)
    {
        $responseApi = new ResponseApi();
        try {
            $fiscal = fiscales::find($id);
            if (!$fiscal) {
                return $responseApi->error("Fiscal no encontrado", 404);
            }

            $validacion = Validator::make($request->all(), [
                'id_fiscal'      => 'sometimes|string|max:50|unique:fiscales,id_fiscal,' . $id,
                'nombres_f'       => 'sometimes|string|max:100',
                'email_f'         => 'sometimes|email|unique:fiscales,email_f,' . $id,
                'dni_f'           => 'sometimes|string|max:10|unique:fiscales,dni_f,' . $id,
                'activo'          => 'sometimes|boolean',
                'ti_fiscal_fk'    => 'sometimes|nullable|exists:fiscal,id',
                'despacho_fk'     => 'sometimes|nullable|exists:despachos,id',
                'dependencias_fk' => 'sometimes|exists:dependencias,id',
                'espacialidad'    => 'sometimes|nullable|string|max:100'
            ]);

            if ($validacion->fails()) {
                return $responseApi->error("Error en la validación", 422, $validacion->errors());
            }

            // Actualizar solo los campos enviados
            $fiscal->update($request->all());
            return $responseApi->success("Fiscal actualizado con éxito", 200, $fiscal);
        } catch (Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage(), 500);
        }
    }

    /**
     * Dar de baja o inactivar un fiscal
     */
    public function destroy($id)
    {
        $responseApi = new ResponseApi();
        try {
            $fiscal = fiscales::find($id);
            if (!$fiscal) {
                return $responseApi->error("Fiscal no encontrado", 404);
            }

            // En lugar de eliminar, marcamos como inactivo
            $fiscal->activo = false;
            $fiscal->save();

            return $responseApi->success("Fiscal inactivado con éxito", 200, $fiscal);
        } catch (Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage(), 500);
        }
    }
}
