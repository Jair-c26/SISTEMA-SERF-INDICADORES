<?php

namespace App\Http\Controllers\user;

use Exception;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendVerificationCodeMail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Response\ResponseApi;
use App\Mail\SendCodePassMail;
use App\Models\fiscalia\despachos;

class perfilController extends Controller
{

    public function index()
    {
        $responseApi = new ResponseApi();

        try {

            $user = auth()->user();
            //dd( $user);

            $user = User::where('uuid', $user->uuid)
                ->where('activo', true) // Solo usuarios activos
                ->with(
                    'despacho_fk',
                    'fiscal_fk',
                    'roles_fk.permisos_fk'
                ) // Carga las relaciones ->with('fiscal_fk', 'roles_fk') // Carga las relaciones
                ->first();

            // Validaciones de usuario y contraseña
            if (!$user) {
                return $responseApi->error('Error: Usuario no encontrado o inactivo', 401);
            }

            // Verificar si el correo está verificado
            if (is_null($user->email_verified_at)) {
                return $responseApi->error('Error: El correo electrónico no ha sido verificado', 403);
            }


            $despacho = despachos::with([
                'dependencia_fk.sede_fk.regional_fk' // Carga la relación en cascada: Despacho -> Dependencia -> Sede -> Región
            ])->find($user->despacho_fk);
        
            if (!$despacho) {
                return response()->json(['message' => 'Despacho no encontrado'], 404);
            }



            $data = [
                'data_user' => $user,
                'roles' => $user->roles_fk,
                'area'=>  $despacho,
            ];


            return $responseApi->success('Datos usuario', 200, $data, '');
        } catch (Exception $e) {
            //throw $th;
            return $responseApi->error('Error: falló en mi perfil. ' . $e->getMessage());
        }
    }

    public function update(Request $request)
    {
        $responseApi = new ResponseApi();


        try {
            $userMI = auth()->user();
            // Encontrar al usuario por ID
            $user = User::where('uuid', $userMI->uuid)
                ->where('activo', true) // Solo usuarios activos
                ->with(
                    'despacho_fk',
                    'fiscal_fk',
                    'roles_fk.permisos_fk'
                ) // Carga las relaciones ->with('fiscal_fk', 'roles_fk') // Carga las relaciones
                ->first();


            // Validar los datos enviados
            $validacion = Validator::make($request->all(), [
                'nombre' => 'sometimes|max:50',
                'apellido' => 'sometimes|max:100|string',
                'telefono' => 'sometimes|unique:users,telefono,' . $user->id, // Laravel permite que el usuario mantenga su propio teléfono, pero impide que lo use otro usuario.
                'email' => 'sometimes|email|unique:users,email,' . $user->id,
                'dni' => 'sometimes|max:8|string',
                'direccion' => 'sometimes',
                'sexo' => 'sometimes|in:masculino,femenino',
                'fecha_nacimiento' => 'sometimes|date',
                'foto_perfil' => 'sometimes|image|mimes:jpg,jpeg,png|max:2048',
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

            // Manejo de la imagen de perfil
            $fotoPerfilPath = null;
            if ($request->hasFile('foto_perfil')) {
                $fotoPerfil = $request->file('foto_perfil');

                // Generar el nombre del archivo: "lista de usuarios-{nombre_usuario}-{fecha actual}"
                $userName = auth()->user()->nombre ?? null; // Ajustar según cómo obtienes el nombre del usuario
                $uuidUser = auth()->user()->uuid ?? null;
                $nombre_modificado = str_replace(" ", "_", trim($userName));
                $currentDate = now()->format('d-m-Y_H-i-s'); // Fecha con formato seguro para nombres de archivo
                //$random = Str::random(20); //agrega seguridad a archivos publicos C:
                $fileName = "Perfil-{$nombre_modificado}-{$currentDate}-{$uuidUser}." . $fotoPerfil->getClientOriginalExtension();

                // Obtener el contenido del excel
                $imageContent = file_get_contents($fotoPerfil->getRealPath());

                // Guardar el archivo en el sistema de almacenamiento predeterminado
                $path = 'carpeta_users/' . $nombre_modificado . '_' . $uuidUser . '/perfil/' . $fileName;

                Storage::disk('minio-public')->put($path, $imageContent);

                $fotoPerfilPath = $this->minioStorage($fotoPerfil);

                // El $fotoPerfilPath será la ruta del archivo img en MinIO
                //$fotoPerfilPath = env('AWS_URL') . '/' . env('AWS_BUCKET_PUBLIC') . '/' . $path;

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
                'foto_perfil',
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

            // Si se subió una imagen, se agrega la URL generada
            if ($fotoPerfilPath) {
                $camposActualizados['foto_perfil'] = $fotoPerfilPath;
            }

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


    public function passReset(Request $request)
    {
        $responseApi = new ResponseApi();

        try {
            $user = auth()->user();

            // Validar la entrada
            $request->validate([
                'pass_actual' => 'required',
                'password' => 'required|min:5|different:pass_actual|confirmed', // Evitar que sea la misma contraseña
            ]);

            // Verificar si la contraseña actual es correcta
            if (!Hash::check($request->pass_actual, $user->password)) {
                return $responseApi->error('Error: Contraseña incorrecta', 401);
            }

            // Encriptar la nueva contraseña
            $user->password = Hash::make($request->password);
            $user->save();

            // Cerrar todas las sesiones activas (opcional, pero recomendable)
            //auth()->logoutOtherDevices($request->pass_actual);

            return $responseApi->success("Se cambió la contraseña exitosamente", 200, $user->nombre);
        } catch (\Throwable $th) {
            return $responseApi->error("Error del servidor: " . $th->getMessage(), 500);
        }
    }


    private function minioStorage($file): string
    {

        try {

            // Generar el nombre del archivo: "lista de usuarios-{nombre_usuario}-{fecha actual}"
            $userName = auth()->user()->nombre ?? null; // Ajustar según cómo obtienes el nombre del usuario
            $uuidUser = auth()->user()->uuid ?? null;
            $nombre_modificado = str_replace(" ", "_", trim($userName));
            $currentDate = now()->format('d-m-Y_H-i-s'); // Fecha con formato seguro para nombres de archivo
            $random = Str::random(30); //agrega seguridad a archivos publicos C:
            $fileName = "Areas-{$nombre_modificado}-{$currentDate}-{$random}." . $file->getClientOriginalExtension();

            // Obtener el contenido de la
            $imageContent = file_get_contents($file->getRealPath());

            // Guardar el archivo en el sistema de almacenamiento predeterminado
            $path = 'INDICADORES/carpeta_users/' . $nombre_modificado . '_' . $uuidUser . '/perfil/' . $fileName;

            Storage::disk('minio-public')->put($path, $imageContent);

            $url = env('AWS_URL') . '/' . env('AWS_BUCKET_PUBLIC') . '/' . $path;

            //$this->archivosRegister($url,$fileName,$file,$urlCarpeta->id);  ///--------------------

            return $url;
        } catch (\Exception $e) {
            //throw $th;

        }
    }


    public function destroyCode(Request $request)
    {
        $responseApi = new ResponseApi();

        try {

            // Validar la entrada
            $request->validate([
                //'email' => 'required|email|exists:users,email',
                'codigo' => 'required|string|max:6',
            ]);

            $userMI = auth()->user();

            // Buscar al usuario autenticado
            $user = User::where('uuid', $userMI->uuid)
                ->where('activo', true)
                ->first();

            if (!$user || $user->verification_code !== $request->codigo) {
                return $responseApi->error("Código incorrecto.", 422);
            }

            // Verificar si el código ha expirado
            if (Carbon::now()->greaterThan($user->code_expires_at)) {
                return $responseApi->error("El código ha expirado", 422);
            }

            // Marcar el usuario como inactivo
            $user->update([
                'estado' => false,
                'activo' => false,
                'verification_code' => null, // Eliminar el código después de validarlo
                'code_expires_at' => null
            ]);

            $this->logout();

            return $responseApi->success("Usuario marcado como inactivo con éxito", 200, $user);
        } catch (Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage(), 500);
        }
    }



    public function sendVerificationCode()
    {
        $responseApi = new ResponseApi();

        try {
            // Validar la entrada
            $userMI = auth()->user();

            // Buscar el usuario por su email
            $user = User::where('email', $userMI->email)->first();

            if (!$user) {
                return $responseApi->error("Usuario no encontrado", 404);
            }

            // Generar un código de 6 dígitos
            //$codigo = mt_rand(100000, 999999);
            $codigo = strtoupper(Str::random(6));

            //dd('hasta qui ');

            // Guardar el código y la fecha de expiración en la base de datos
            $user->update([
                'verification_code' => $codigo,
                'code_expires_at' => Carbon::now()->addMinutes(10),
            ]);

            // Enviar el correo con el código
            Mail::to($user->email)->send(new SendVerificationCodeMail($user->nombre, $user->email, $codigo));

            return $responseApi->success("Código de verificación enviado", 200, $user->email);
        } catch (Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage(), 500);
        }
    }


    public function CodePassMail()
    {
        $responseApi = new ResponseApi();

        try {
            // Validar la entrada
            $userMI = auth()->user();

            // Buscar el usuario por su email
            $user = User::where('email', $userMI->email)->first();

            if (!$user) {
                return $responseApi->error("Usuario no encontrado", 404);
            }
            // Generar un código de 6 dígitos
            //$codigo = mt_rand(100000, 999999);
            $codigo = strtoupper(Str::random(6));

            // Guardar el código y la fecha de expiración en la base de datos
            $user->update([
                'verification_code' => $codigo,
                'code_expires_at' => Carbon::now()->addMinutes(10),
            ]);

            // Enviar el correo con el código
            Mail::to($user->email)->send(new SendCodePassMail($user->nombre, $user->email, $codigo));

            return $responseApi->success("Código de reseteo de contraseña enviado.", 200, $user->email);
        } catch (Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage(), 500);
        }
    }
    public function codePassReset(Request $request)
    {
        $responseApi = new ResponseApi();

        try {
            // Validar la entrada
            $request->validate([
                'codigo' => 'required|string|max:6',
                'password' => 'required|min:5|confirmed', 
            ]);

            //dd("sdsafsf");

            $userMI = auth()->user();

            // Buscar al usuario autenticado
            $user = User::where('uuid', $userMI->uuid)
                ->where('activo', true)
                ->first();

            if (!$user || $user->verification_code !== $request->codigo) {
                return $responseApi->error("Código incorrecto.", 422);
            }

            // Verificar si el código ha expirado
            if (Carbon::now()->greaterThan($user->code_expires_at)) {
                return $responseApi->error("El código ha expirado", 422);
            }

            // Actualizar la contraseña y eliminar el código
            $actualizado = $user->update([
                'password' => Hash::make($request->password),
                'verification_code' => null,
                'code_expires_at' => null,
            ]);

            if (!$actualizado) {
                return $responseApi->error("No se pudo actualizar la contraseña.", 500);
            }

            // Cerrar sesiones en otros dispositivos (Opcional)
            //auth()->logoutOtherDevices($request->password);

            // Cerrar la sesión actual
            $this->logout();

            return $responseApi->success("Se cambió la contraseña exitosamente", 200, $user->nombre);
        } catch (Exception $e) {
            return $responseApi->error("Error: " . $e->getMessage(), 500);
        }
    }


    private function logout()
    {
        //dd($request->user());
        $this->sesionDesactivado(auth()->user()->id);  ///    ojo!!!
        //dd($request->user()->id);
        // Revocar los tokens del usuario autenticado
        auth()->user()->tokens()->delete();

        return response()->json(['message' => 'Tokens revocados']);
    }


    public function sesionDesactivado($id)
    {
        $SesionUser = new SesionUserController();
        $SesionUser->updateFechafin($id);
    }
}
