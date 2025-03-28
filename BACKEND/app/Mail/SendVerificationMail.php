<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $nombre;
    public $gmail;
    public $verificationUrl;

    public function __construct($nombre, $gmail, $verificationUrl)
    {
        $this->nombre = $nombre;
        $this->gmail = $gmail;
        $this->verificationUrl = $verificationUrl;
    }

    public function build()
    {
        return $this->subject('Confirmación de Correo Electrónico')
                    ->view('emails.verifiEmail')
                    ->with([
                        'nombre' => $this->nombre,
                        'gmail' => $this->gmail, // Aquí se asegura que $gmail esté disponible
                        'verificationUrl' => $this->verificationUrl,
                    ]);
    }



}
