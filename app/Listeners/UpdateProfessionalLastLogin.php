<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;

class UpdateProfessionalLastLogin
{
    public function handle(Login $event): void
    {
        $user = $event->user;

        // Verificamos que el usuario tenga un profesional asociado
        if ($user->professional) {
            $user->professional->update([
                'last_login_at' => now(),
            ]);
        }
    }
}
