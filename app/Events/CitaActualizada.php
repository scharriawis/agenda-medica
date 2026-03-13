<?php

namespace App\Events;

use App\Models\Cita;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CitaActualizada implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $cita;

    public function __construct(Cita $cita)
    {
        $this->cita = $cita;
    }

    public function broadcastOn()
    {
        return new Channel('agenda');
    }

    public function broadcastAs()
    {
        return 'cita.actualizada';
    }
}