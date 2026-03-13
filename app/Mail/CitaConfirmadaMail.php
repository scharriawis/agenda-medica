<?php

namespace App\Mail;

use App\Models\Cita;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CitaConfirmadaMail extends Mailable
{
    use Queueable, SerializesModels;

    public Cita $cita;
    public User $professional;
    public $consultorio;

    /**
     * Crear una nueva instancia del mensaje.
     */
    public function __construct(Cita $cita, User $professional, $consultorio = null)
    {
        $this->cita = $cita;
        $this->professional = $professional;
        $this->consultorio = $consultorio;
    }

    /**
     * Construir el mensaje.
     */
    public function build()
    {
        return $this->subject('Confirmación de tu cita médica')
                    ->markdown('emails.cita-confirmada')
                    ->with([
                        'cita' => $this->cita,
                        'professional' => $this->professional,
                        'consultorio' => $this->consultorio,
                    ]);
    }
}
