<?php

namespace App\Http\Controllers\email;

use Exception;
use App\Models\User;
use App\Mail\notificacion;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Response\ResponseApi;
use Illuminate\Support\Facades\Mail;



class MailController extends Controller
{
    //

    
    public function enviarCorreo($email)
    {
        $responseApi = new ResponseApi();

        //$destinatario = 'prueba@correo.com'; // Cambia esto por el destinatario
        //$nombre = 'Usuario de Prueba';
        $user = User::where('email', $email)->first();

        if (!$user) {
            return $responseApi->error("Usuario no encontrado", 404);
        }

        //dd("hasta qui");

        try {
            Mail::to($user->email)->send(new notificacion($user->nombre));
            return response()->json(['message' => 'Correo enviado con éxito.']);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
