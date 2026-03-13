<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\SocialLoginController;
use Inertia\Inertia;

//Home
Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

//Agendamientos citas pacientes
require __DIR__.'/citas.php';
//Agendamientos citas professionals
require __DIR__.'/agenda.php';
//API
require __DIR__.'/api.php';
//Setings
require __DIR__.'/settings.php';
//Auth
require __DIR__.'/auth.php';
//Consultorio
require __DIR__.'/consultorio.php';
//Profesionales
require __DIR__.'/profesionales.php';
//Eps
require __DIR__.'/eps.php';

//Social
Route::get('auth/{provider}/redirect', [SocialLoginController::class, 'redirect'])
    ->name('auth.redirect');

Route::get('auth/{provider}/callback', [SocialLoginController::class, 'callback'])
    ->name('auth.callback');
