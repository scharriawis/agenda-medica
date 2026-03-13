<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Auth\Events\Login;
use App\Listeners\UpdateProfessionalLastLogin;
use Inertia\Inertia;
use App\Enums\TipoDocumento;
use App\Models\User;
use App\Policies\UserPolicy;

class AppServiceProvider extends ServiceProvider
{
    protected $listen = [
        Login::class => [
            UpdateProfessionalLastLogin::class,
        ],
    ];
    
    protected $policies = [
        User::class => UserPolicy::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
        Inertia::share([
            'tiposDocumento' => TipoDocumento::forSelect(),
        ]);
    }
}
