<?php

namespace App\Providers;

use App\Models\User;
use App\Models\Cita;
use App\Models\Profesional;
use App\Policies\UserPolicy;
use App\Policies\CitaPolicy;
use App\Policies\ProfesionalPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        User::class => UserPolicy::class,
        Cita::class => CitaPolicy::class,
        Profesional::class => ProfesionalPolicy::class,
    ];

    public function boot(): void
    {
        //
    }
}
