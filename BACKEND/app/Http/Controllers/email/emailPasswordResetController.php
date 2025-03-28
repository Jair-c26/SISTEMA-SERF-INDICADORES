<?php

namespace App\Http\Controllers\email;

use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Response\ResponseApi;

class emailPasswordResetController extends Controller
{
    //
    public function resetPass(Request $request, $id, $hash)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        // Genera el hash esperado utilizando SHA-1
        $expectedHash = sha1($user->getEmailForVerification());

        // Verificar que la URL sea válida y no haya expirado
        if (!hash_equals($expectedHash, $hash)) {
            return response()->json(['message' => 'El enlace de verificación no es válido.'], 403);
        }

        //dd("ess");
        // Verificar que la URL sea válida y no haya expirado
        if (!URL::hasValidSignature($request)) {
            return response()->json(['message' => 'El enlace ha expirado o no es válido.'], 403);
        }

        //$user = User::find($id);

        if (!$user || sha1($user->email) !== $hash) {
            return response()->json(['message' => 'Enlace inválido.'], 403);
        }

        // Retorna el formulario de cambio de contraseña
        return view('emails.resetPassword.reset_password', [
            'uuid' => $user->uuid,
            'nombre'=>$user->nombre ." ". $user->apellido,
            'correo' =>$user->email
        ]);

        return response()->json(['message' => 'Enlace válido. Procede a cambiar la contraseña.'], 200);
    }
}
