<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Ver listado de usuarios
     */
    public function viewAny(User $authUser): bool
    {
        return $authUser->role === 'admin';
    }

    /**
     * Ver un usuario específico
     */
    public function view(User $authUser, User $user): bool
    {
        return $authUser->role === 'admin';
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
