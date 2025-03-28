<?php

namespace App\Http\Controllers\email\resetPassword;

use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Response\ResponseApi;

class processResetPasswordController extends Controller
{

    public function processResetPassword(Request $request)
    {
        $responseApi = new ResponseApi();

        try {
            // Validar entrada
            //dd($request);
            $validacion = Validator::make($request->all(), [
                'uuid' => 'required|exists:users,uuid',
                'password' => 'required|confirmed|min:5',
            ]);

            if ($validacion->fails()) {
                return $responseApi->error("Error en la validación", 422, $validacion->errors());
            }
            

            $user = User::where('uuid', $request->uuid)->first();

            //$user = User::find($request->uuid);
            
            //dd($user);
            if (!$user) {
                return $responseApi->error('Usuario no encontrado', 404);
            }


            // Actualizar contraseña
            $user->password = Hash::make($request->password);
            $user->save();

            return $responseApi->success("Contraseña actualizada con éxito.", 200, "");
            
            return view('emails.resetPassword.reset_password', [
                'uuid' => $user->uuid,
                'nombre'=>$user->nombre ." ". $user->apellido,
                'correo' =>$user->email
            ]);

        } catch (Exception $e) {
            return $responseApi->error("Error al actualizar la contraseña: " . $e->getMessage(), 500);
        }
    }
}
