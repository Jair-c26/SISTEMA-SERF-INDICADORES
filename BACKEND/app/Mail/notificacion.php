<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class notificacion extends Mailable
{
    use Queueable, SerializesModels;

    public $nombre; // Variable para pasar a la vista

    /**
     * Create a new message instance.
     */
    public function __construct($nombre)
    {
        $this->nombre = $nombre;
    }




    public function build()
    {
        return $this->subject('Notificación Importante')
                    ->view('emails.notificacion');
    }

}
