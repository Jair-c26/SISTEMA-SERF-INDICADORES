<?php

namespace App\Http\Controllers\user;

use Exception;
use App\Models\User;
use App\Mail\SendPassword;
use App\Models\user\Sesion;
use Illuminate\Support\Str;
use App\Mail\SendVerifiMail;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Mail\SendVerificationMail;
use App\Mail\SendResetMailPassword;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Response\ResponseApi;

class UserController extends Controller
{

    public function listaUSer(){
        try {
            $responseApi = new ResponseApi();

            $listaUser = User::all();

            return $responseApi->success('lista users',200,$listaUser);
        } catch (Exception $e) {
            //throw $th;
            return $responseApi->error('error en la lista de user'.$e->getMessage());
        }
    }


    public function index()
    {
        $responseApi = new ResponseApi();
        try {
            // Filtrar usuarios activos, excluir al usuario con correo admin@gmail.com y cargar relaciones necesarias
            $listaUser = User::with('roles_fk')
                //->where('activo', true)
                ->where('email', '!=', 'admin@gmail.com') // Excluir correo específico
                ->get();

            if ($listaUser->isEmpty()) {
                return $responseApi->error("No hay usuarios activos encontrados", 404);
            }

            return $responseApi->success("Lista de usuarios activos", 200, $listaUser, "");
        } catch (Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }


    public function show($id)
    {
        $responseApi = new ResponseApi();
        try {
            // Usa `with` para cargar relaciones necesarias como 'roles_fk'
            $user = User::with('roles_fk.permisos_fk', 'fiscal_fk', 'despacho_fk')
                //->where('activo', true)
                ->where('email', '!=', 'admin@gmail.com')
                ->find($id);

            // Si no se encuentra el usuario, devuelve un error
            if (!$user) {
                return $responseApi->error("Usuario no encontrado o inactivo.", 404);
            }

            // Si el usuario existe, retorna la información
            return $responseApi->success("Usuario encontrado", 200, $user);
        } catch (Exception $e) {
            // Maneja errores inesperados
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $responseApi = new ResponseApi();

        //dd("storeeee");
        try {
            $validacion = Validator::make($request->all(), [
                'nombre' => 'required|max:50',
                'apellido' => 'required|max:100|string',
                'telefono' => 'required|unique:users',
                'email' => 'required|email|unique:users',
                'dni' => 'required|max:8|string',
                'sexo' => 'required|in:m,f',
                'direccion' => 'required',
                'fecha_nacimiento' => 'nullable|date',
                'foto_perfil' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // Validación de la imagen
                'extension' => 'max:20|nullable',
                'tipo_fiscal' => 'required|max:50|string',
                //'activo' => 'required',
                'fecha_ingreso' => 'nullable|date',
                'email_verified_at' => 'nullable|date',
                'password' => 'required|confirmed|min:5',
                //'estado' => 'required|boolean',
                'fiscal_fk' => 'nullable',
                'roles_fk' => 'nullable',
                'despacho_fk' => 'nullable',
            ]);

            if ($validacion->fails()) {
                return $responseApi->error("Error en la validación", 422, $validacion->errors());
            }

            // Manejo de la imagen de perfil
            $fotoPerfilPath = null;
            if ($request->hasFile('foto_perfil')) {
                $fotoPerfil = $request->file('foto_perfil');

                // Obtén el nombre del usuario y el ID del usuario
                $nombreUsuario = strtoupper(str_replace(' ', '_', $request->nombre)); // Convertir el nombre a mayusculas y reemplazar espacios por guiones bajos

                // Obtén la fecha actual
                $fechaActual = now()->format('d-m-Y_H-i-s'); // Formato de fecha: día-mes-año_hora-minuto-segundo

                $random = Str::random(30);
                // Crear el nombre del archivo con el formato: nombre_usuario-fecha.jpg
                $nombreArchivo = "{$nombreUsuario}-{$fechaActual}-{$random}." . $fotoPerfil->getClientOriginalExtension();

                // Obtener el contenido de la imagen
                $imageContent = file_get_contents($fotoPerfil->getRealPath());

                $path = 'INDICADORES/usuarios_perfil/' . $nombreArchivo;
                Storage::disk('minio-public')->put($path, $imageContent);

                // El $fotoPerfilPath será la ruta del archivo en MinIO
                $fotoPerfilPath = env('AWS_URL') . '/' . env('AWS_BUCKET_PUBLIC') . '/' . $path;

                //$fotoPerfilPath = Storage::disk('minio-public')->url($path);  // URL de la imagen almacenada en MinIO
            }


            // Creación del usuario
            $user = User::create([
                'nombre' => strtoupper($request->nombre),
                'apellido' => strtoupper($request->apellido),
                'telefono' => $request->telefono,
                'email' => strtoupper($request->email),
                'dni' => $request->dni,
                'direccion' => strtoupper($request->direccion),
                'sexo' => $request->sexo,
                'fecha_nacimiento' => $request->fecha_nacimiento,
                'foto_perfil' => $fotoPerfilPath, // Guardamos la ruta de la imagen
                'extension' => $request->extencion ?? "000000",
                'tipo_fiscal' => $request->tipo_fiscal,
                'activo' => $request->activo ?? true,
                'fecha_ingreso' => $request->fecha_ingreso ?? now(),
                'password' => Hash::make($request->password),
                'estado' => $request->estado ?? true,
                'fiscal_fk' => $request->fiscal_fk,
                'roles_fk' => $request->roles_fk,
                'despacho_fk' => $request->despacho_fk,
            ]);

            if (!$user) {
                return $responseApi->error("Error en la creación del usuario", 422);
            }

            // Crear la sesión del usuario
            $sesionUser = new SesionUserController();
            $sesionUser->store($user->email);

            // Enviar correo de verificación
            $this->sendVerificationEmail($user);

            return $responseApi->success("Usuario creado con éxito. Tiene que confirmar el correo electrónico para iniciar sesión", 200, $user);
        } catch (Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }


    public function update(Request $request, $id)
    {
        $responseApi = new ResponseApi();


        try {
            // Encontrar al usuario por ID
            $user = User::find($id);

            if (!$user) {
                return $responseApi->error("Usuario no encontrado", 404);
            }

            // Validar los datos enviados
            $validacion = Validator::make($request->all(), [
                'nombre' => 'sometimes|max:50',
                'apellido' => 'sometimes|max:100|string',
                'telefono' => 'sometimes|unique:users,telefono,' . $id,
                'email' => 'sometimes|email|unique:users,email,' . $id,
                'dni' => 'sometimes|max:8|string',
                'direccion' => 'sometimes',
                'sexo' => 'sometimes|in:masculino,femenino',
                'fecha_nacimiento' => 'sometimes|date',
                'extension' => 'sometimes|max:20',
                'tipo_fiscal' => 'sometimes|max:50',
                'activo' => 'sometimes|boolean',
                'fecha_ingreso' => 'sometimes|date',
                'password' => 'sometimes|confirmed|min:5',
                'estado' => 'sometimes|boolean',
                'fiscal_fk' => 'sometimes|nullable',
                'roles_fk' => 'sometimes|nullable',
                'despacho_fk' => 'sometimes|nullable',

            ]);

            if ($validacion->fails()) {
                return $responseApi->error("Error en la validación", 422, $validacion->errors());
            }

            // Filtrar solo los campos enviados para la actualización
            $camposActualizados = $request->only([
                'nombre',
                'apellido',
                'telefono',
                'email',
                'dni',
                'extension',
                'sexo',
                'fecha_nacimiento',
                'extencion',
                'tipo_fiscal',
                'activo',
                'fecha_ingreso',
                'password',
                'estado',
                'fiscal_fk',
                'roles_fk',
                'despacho_fk',
            ]);

            // Encriptar la contraseña si se proporciona
            if (isset($camposActualizados['password'])) {
                $camposActualizados['password'] = Hash::make($camposActualizados['password']);
            }

            // Actualizar al usuario
            $user->update($camposActualizados);

            return $responseApi->success("Usuario actualizado con éxito", 200, $user);
        } catch (Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }



    public function destroy($id)
    {
        $responseApi = new ResponseApi();

        try {
            // Buscar el usuario por su ID
            $user = User::find($id);

            // Verificar si el usuario existe
            if (!$user) {
                return $responseApi->error("Usuario no encontrado", 404);
            }

            // Verificar si el usuario ya está inactivo
            if (!$user->activo) {
                return $responseApi->error("El usuario ya está inactivo", 400);
            }

            // Marcar el usuario como inactivo
            $user->activo = false;
            $user->save();

            return $responseApi->success("Usuario marcado como inactivo con éxito", 200, $user);
        } catch (Exception $e) {
            // Manejar errores inesperados
            return $responseApi->error("Error: " . $e->getMessage());
        }
    }





    public function login(Request $request)
    {
        try {
            $start = microtime(true);

            $responseApi = new ResponseApi();

            // Validar los datos de entrada
            $validacion = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|min:5'
            ]);

            if ($validacion->fails()) {
                return $responseApi->error("Error en la validación", 422, $validacion->errors());
            }

            // Buscar al usuario por email y verificar que esté activo
            $user = User::where('email', $request->email)
                ->where('activo', true) // Solo usuarios activos
                ->with(
                    'despacho_fk',
                    'fiscal_fk',
                    'roles_fk.permisos_fk'
                ) // Carga las relaciones ->with('fiscal_fk', 'roles_fk') // Carga las relaciones
                ->first();
            /*
            function ($query) {
        $query->select('id', 'nombre', 'descripcion');
        */

            // Validaciones de usuario y contraseña
            if (!$user) {
                return $responseApi->error('Error: Usuario no encontrado o inactivo', 401);
            }

            
            // Verificar si el correo está verificado
            if (is_null($user->email_verified_at)) {
                return $responseApi->error('Error: El correo electrónico no ha sido verificado', 403);
            }

            if (!Hash::check($request->password, $user->password)) {
                return $responseApi->error('Error: Contraseña incorrecta', 401);
            }

            // Crear un token para el usuario
            $token = $user->createToken('Personal Access Token')->plainTextToken;
            
            $user['password'] = null;
            
            $this->sesionActiva($user->id);

            $end = microtime(true);
            Log::info('Tiempo de ejecución del login: ' . ($end - $start) . ' segundos');
            return $responseApi->success("Inicio de sesión exitoso", 200, $user, $token);
        } catch (\Throwable $th) {
            return $responseApi->error("Error del servidor: " . $th->getMessage(), 500);
        }
    }


    public function logout()
    {
        //dd(auth()->user()->id);
        $this->sesionDesactivado(auth()->user()->id);  ///    ojo!!!
        //dd($request->user()->id);
        auth()->user()->tokens()->delete();

        /*
        $user = Sesion::where('email', $request->email)
        ->where('activo', true) // Solo usuarios activos
        ->with('fiscal_fk', 'roles_fk') // Carga las relaciones
        ->first();
*/

        return response()->json(['message' => 'Tokens revocados']);
    }

    /////////////////////  metodos de sesiones  ///////////////////////////////////////////////////////////
    public function sesionActiva($id)
    {
        $SesionUser = new SesionUserController();

        $SesionUser->updateFechaInicio($id); ////    ojo !!
    }

    public function sesionDesactivado($id)
    {
        $SesionUser = new SesionUserController();
        $SesionUser->updateFechafin($id);
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    public function resetPassword(Request $request)
    {
        $responseApi = new ResponseApi();

        try {
            // Validar entrada
            $validacion = Validator::make($request->all(), [
                'email' => 'required|email',
            ]);

            if ($validacion->fails()) {
                return $responseApi->error("Error en la validación", 422, $validacion->errors());
            }

            // Buscar usuario
            $user = User::where('email', $request->email)
                ->where('activo', true)
                ->first();

            if (!$user) {
                return $responseApi->error('Error: Usuario no encontrado o inactivo', 404);
            }

            // Generar enlace de reseteo
            $resetUrl = URL::temporarySignedRoute(
                'password.reset', // Nombre de la ruta para manejar el reseteo
                now()->addMinutes(60), // El enlace expira en 60 minutos
                ['id' => $user->id, 'hash' => sha1($user->email)]
            );

            // Enviar correo con el enlace
            Mail::to($user->email)->send(new SendPassword($user->nombre, $user->email, $user->dni, $resetUrl));

            return $responseApi->success("Enlace de reseteo enviado al correo registrado.", 200, "");
        } catch (Exception $e) {
            return $responseApi->error("Error al enviar el enlace de reseteo: " . $e->getMessage(), 500);
        }
    }


    public function sendVerificationEmail($user)
    {
        try {
            $verificationUrl = URL::temporarySignedRoute(
                'verification.verify', // Nombre de la ruta
                now()->minute(60), // Expiración de 1 horas
                ['id' => $user->id, 'hash' => sha1($user->getEmailForVerification())]
            );

            Mail::to($user->email)->send(new SendVerificationMail($user->nombre, $user->email, $verificationUrl));
        } catch (Exception $e) {
            throw new Exception("Error al enviar el correo de verificación: " . $e->getMessage());
        }
    }


    /*
    public function sendVerifiEmail($user)
    {
        try {
            //$user = User::where('email', '=', $email)->first();

            if ($user) {

                $verificationUrl = URL::temporarySignedRoute(
                    'verification.verify',
                    Carbon::now()->addDay(1),
                    ['id' => $user->id, 'hash' => sha1($user->getEmailForVerification())]
                );
                $nombre = $user->nombre . ' - ' . $user->apellido;

                Mail::to($user->email)->send(new SendVerifiMail($nombre, $verificationUrl));

                // Actualizar la columna email_verified_at si el correo se envía exitosamente
                //$user->email_verified_at = now();
                //$user->save();

                //return response()->json(['message' => 'Correo enviado con éxito.'], 200);

                /*$data = [
                    "userName" => $user->nombre
                ];*/
    //return true;

    /*}/* else {
                //return response()->json(['message' => 'Usuario no encontrado.'], 404);
                return ApiResponse::error("Usuario no encontrado.",404);
            }*//*
        } catch (Exception $e) {

            return response()->json("Error: " . $e->getMessage(), 401);

            //return false;
            //return ApiResponse::error("error: ".$e->getMessage(),404);
            //throw $th;
        }
    }

    */
}
