<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Profesional;

class ProfesionalPolicy
{
    /**
     * Ver listado de profesionales
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin']);
    }

    /**
     * Ver un profesional específico
     */
    public function view(User $user, Profesional $professional): bool
    {
        return in_array($user->role, ['admin']);
    }

    /**
     * Crear usuarios
     */
    public function create(User $authUser): bool
    {
        return $authUser->role === 'admin';
    }

    /**
     * Actualizar usuarios
     */
    public function update(User $authUser, User $user): bool
    {
        // admin sí, pero no editarse a sí mismo (buena práctica)
        return $authUser->role === 'admin'
            && $authUser->id !== $user->id;
    }

    /**
     * Eliminar usuarios
     */
    public function delete(User $authUser, User $user): bool
    {
        return $authUser->role === 'admin'
            && $authUser->id !== $user->id;
    }
}
