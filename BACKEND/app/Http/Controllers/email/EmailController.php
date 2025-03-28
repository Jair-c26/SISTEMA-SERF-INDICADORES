<?php

namespace App\Http\Controllers\email;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class EmailController extends Controller
{
    //

    public function verifyEmail(Request $request, $id, $hash)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        // Verificar el hash
        if (!hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return response()->json(['message' => 'El enlace de verificación no es válido.'], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return view('emails.confirmationEmail', [
                'user'=>$user,
                'mensaje' => "El correo ya ha sido verificado."
            ]);
            //return response()->json(['message' => 'El correo ya ha sido verificado.'], 200);
        }
    

        $user->markEmailAsVerified();

        return view('emails.confirmationEmail', [
            'user'=>$user,
            'mensaje' => "Correo electrónico verificado con éxito."
        ]);
    }

}
