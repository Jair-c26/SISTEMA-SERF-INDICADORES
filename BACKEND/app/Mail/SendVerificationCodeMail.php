<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendVerificationCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */

    public $nombre;
    public $email;
    public $codigo;

    /**
     * Crear una nueva instancia del mensaje.
     */
    public function __construct($nombre, $email, $codigo)
    {
        $this->nombre = $nombre;
        $this->email = $email;
        $this->codigo = $codigo;
    }

    /**
     * Construir el mensaje.
     */
    public function build()
    {
        return $this->subject('Código de Verificación - Area de Indicadores - Ministerio Público')
            ->view('emails.codigoVerifi')
            ->with([
                'nombre' => $this->nombre,
                'email' => $this->email,
                'codigo' => $this->codigo,
            ]);
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
