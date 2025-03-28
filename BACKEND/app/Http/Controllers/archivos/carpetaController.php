<?php

namespace App\Http\Controllers\archivos;

use Illuminate\Http\Request;
use App\Models\archivos\Carpetas;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Response\ResponseApi;
use Illuminate\Support\Facades\Storage;
use PhpParser\Node\Expr\FuncCall;

class carpetaController extends Controller
{
    public function index()
    {

        $responseApi = new ResponseApi();
        try {
            $carpetas = Carpetas::with('tipoRepor')->get();

            if ($carpetas->isEmpty()) {
                return $responseApi->error("No hay carpetas registradas", 404);
            }

            return $responseApi->success("Lista de carpetas registradas", 200, $carpetas);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }


    public function store(Request $request)
    {
        $responseApi = new ResponseApi();
        try {
            // Validar los datos de la solicitud
            $validacion = Validator::make($request->all(), [
                'codigo_carp' => 'required|max:50|unique:carpetas',
                'nombre_carp' => 'required|max:100|string',
                'tip_carp' => 'required|max:50|string',
                'tipo_repor_fk' => 'nullable|exists:tipo_repor,id',
            ]);

            // Si la validación falla, devolver error
            if ($validacion->fails()) {
                return $responseApi->error("Error en la validación", 422, $validacion->errors());
            }

            // Crear la carpeta en el sistema de archivos
            $rutaCarpeta = 'carpetas/' . $request->codigo_carp;

            // Verificar si ya existe la carpeta
            if (Storage::exists($rutaCarpeta)) {
                return $responseApi->error("La carpeta ya existe.", 422);
            }

            //'modulos/delitos_incidencia/'
            // Crear la carpeta
            Storage::makeDirectory($rutaCarpeta);

            // Crear el registro de la carpeta en la base de datos
            $carpeta = Carpetas::create([
                'codigo_carp' => $request->codigo_carp,
                'nombre_carp' => $request->nombre_carp,
                'tip_carp' => $request->tip_carp,
                'direc_carp' => $rutaCarpeta,  // La ruta de la carpeta
                'tipo_repor_fk' => $request->tipo_repor_fk,
            ]);

            return $responseApi->success("Carpeta creada correctamente", 201, $carpeta);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }


    public function show($id)
    {
        $responseApi = new ResponseApi();
        try {
            $carpeta = Carpetas::with('tipoRepor')->find($id);

            if (!$carpeta) {
                return $responseApi->error("Carpeta no encontrada", 404);
            }

            return $responseApi->success("Carpeta encontrada", 200, $carpeta);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $responseApi = new ResponseApi();
        try {
            $carpeta = Carpetas::find($id);

            if (!$carpeta) {
                return $responseApi->error("Carpeta no encontrada", 404);
            }

            $validacion = Validator::make($request->all(), [
                'codigo_carp' => 'sometimes|max:50|unique:carpetas,codigo_carp,' . $id,
                'nombre_carp' => 'sometimes|max:100|string',
                'tip_carp' => 'sometimes|max:50|string',
                'tipo_repor_fk' => 'sometimes|exists:tipo_repor,id',
            ]);

            if ($validacion->fails()) {
                return $responseApi->error("Error en la validación", 422, $validacion->errors());
            }

            $camposActualizados = $request->only([
                'codigo_carp',
                'nombre_carp',
                'tip_carp',
                'tipo_repor_fk',
            ]);

            $carpeta->update($camposActualizados);

            return $responseApi->success("Carpeta actualizada con éxito", 200, $carpeta);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $responseApi = new ResponseApi();
        try {
            $carpeta = Carpetas::find($id);

            if (!$carpeta) {
                return $responseApi->error("Carpeta no encontrada", 404);
            }

            // Eliminar la carpeta del sistema de archivos
            Storage::deleteDirectory($carpeta->direc_carp);

            // Eliminar el registro de la base de datos
            $carpeta->delete();

            return $responseApi->success("Carpeta eliminada con éxito", 200, '');
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }




    public function llitsArchivosPorCarpeta()
    {
        $responseApi = new ResponseApi();

        try {
            $user = auth()->user();

            if ($user->nombre == 'Admin') {
                // Admin: obtiene todas las carpetas con sus archivos
                $carpetas = Carpetas::with('archivos')->get();
            } else {
                // Usuario estadistico: obtiene solo las carpetas con sus propios archivos
                $carpetas = Carpetas::whereHas('archivos', function ($query) use ($user) {
                    $query->where('user_fk', $user->id);
                })->with(['archivos' => function ($query) use ($user) {
                    $query->where('user_fk', $user->id);
                }])->get();
            }

            if ($carpetas->isEmpty()) {
                return $responseApi->error("No se encontraron carpetas", 404);
            }

            // Construir la respuesta con la cantidad de archivos por carpeta
            $resultado = $carpetas->map(function ($carpeta) {
                return [
                    'id' => $carpeta->id,
                    'codigo_carp' => $carpeta->codigo_carp,
                    'nombre_carp' => $carpeta->nombre_carp,
                    'tip_carp' => $carpeta->tip_carp,
                    'direc_carp' => $carpeta->direc_carp,
                    'tipo_repor_fk' => $carpeta->tipo_repor_fk,
                    'cant_archivos' => $carpeta->archivos->count(),
                    'archivos' => $carpeta->archivos
                ];
            });

            return $responseApi->success("Carpetas encontradas", 200, $resultado);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage(), 400);
        }
    }


    public function litsArchivosPorCarpeta()
    {
        $responseApi = new ResponseApi();

        try {
            $user = auth()->user();

            //dd($user);

            if ($user->roles_fk == 1) {
                // Admin: obtiene todas las carpetas con todos los archivos y la relación de usuario en cada archivo
                $carpetas = Carpetas::with('archivos.user')->get();
            } else {
                // Usuario: obtiene solo las carpetas que tienen archivos del usuario autenticado
                $carpetas = Carpetas::whereHas('archivos', function ($query) use ($user) {
                    $query->where('user_fk', $user->id);
                })->with(['archivos' => function ($query) use ($user) {
                    $query->where('user_fk', $user->id)->with('user');
                }])->get();
            }

            if ($carpetas->isEmpty()) {
                return $responseApi->error("No se encontraron carpetas", 404);
            }

            // Para cada carpeta, agrupar los archivos por usuario
            $resultado = $carpetas->map(function ($carpeta) {
                // Agrupar archivos por 'user_fk'
                $usuarios_archivos = $carpeta->archivos->groupBy('user_fk')->map(function ($archivos) {
                    // Obtenemos la información del usuario (asumimos que está cargada en la relación "user")
                    $usuario = $archivos->first()->user;
                    return [
                        'usuario' => [
                            'id'     => $usuario->id,
                            'nombre' => $usuario->nombre,
                            'email'  => $usuario->email,
                            'estado' => $usuario->estado,
                            'archivos_del_usuario' => $archivos->map(function ($archivo) {
                                return [
                                    'id'          => $archivo->id,
                                    'codigo'      => $archivo->codigo,
                                    'nombre'      => $archivo->nombre,
                                    'peso_arch'   => $archivo->peso_arch,
                                    'tipo_arch'   => $archivo->tipo_arch,
                                    'url_archivo' => $archivo->url_archivo,
                                    'file_path'   => $archivo->file_path,
                                    'created_at'  => $archivo->created_at,
                                    'updated_at'  => $archivo->updated_at,
                                ];
                            })->values(),
                        ],

                    ];
                })->values();

                return [
                    'id'             => $carpeta->id,
                    'codigo_carp'    => $carpeta->codigo_carp,
                    'nombre_carp'    => $carpeta->nombre_carp,
                    'tip_carp'       => $carpeta->tip_carp,
                    'direc_carp'     => $carpeta->direc_carp,
                    'tipo_repor_fk'  => $carpeta->tipo_repor_fk,
                    'cant_archivos'  => $carpeta->archivos->count(),
                    'usuarios_archivos' => $usuarios_archivos,
                ];
            });

            return $responseApi->success("Carpetas encontradas", 200, $resultado);
        } catch (\Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage(), 400);
        }
    }
}
