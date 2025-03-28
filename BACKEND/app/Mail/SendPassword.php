<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendPassword extends Mailable
{
    use Queueable, SerializesModels;

    public $nombre;
    public $gmail;
    public $dni;
    public $verificationUrl;

    public function __construct($nombre, $gmail,$dni, $verificationUrl)
    {
        $this->nombre = $nombre;
        $this->gmail = $gmail;
        $this->dni = $dni;
        $this->verificationUrl = $verificationUrl;
    }

    public function build()
    {
        return $this->subject('Reseteo de Contraseña')
                    ->view('emails.resetPassword')
                    ->with([
                        'nombre' => $this->nombre,
                        'gmail' => $this->gmail, // Aquí se asegura que $gmail esté disponible
                        'dni' => $this->dni,
                        'verificationUrl' => $this->verificationUrl,
                    ]);
    }

}
