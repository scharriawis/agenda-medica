<?php

namespace App\Policies;

use App\Models\Cita;
use App\Models\User;

class AgendaPolicy
{
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
