<?php

namespace App\Policies;

use App\Models\Paciente;
use App\Models\User;
use App\Models\Cita;
use Illuminate\Auth\Access\Response;

class CitaPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function view(User $user, Cita $cita): bool
    {
        return $user->role === 'admin';
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'paciente']);
    }

    public function update(User $user, Cita $cita): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'paciente') {
            return $cita->paciente_id === $user->paciente->id;
        }

        return false;
    }

    public function delete(User $user, Cita $cita): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Paciente $paciente): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Paciente $paciente): bool
    {
        return false;
    }

        public function dragUpdate(User $user, Cita $cita): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'professional') {
            return $cita->professional_id === $user->professional->id;
        }

        return false;
    }
}
