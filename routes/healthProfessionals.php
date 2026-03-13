<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('healthProfessionals', [UserController::class, 'index'])
        ->name('healthProfessionals.index');

    Route::get('healthProfessionals/create', [UserController::class, 'create'])
        ->name('healthProfessionals.create');

    Route::post('healthProfessionals/store', [UserController::class, 'store'])
        ->name('healthProfessionals.store');

    Route::get('healthProfessionals/{user}/edit', [UserController::class, 'edit'])
        ->name('healthProfessionals.edit');

    Route::put('healthProfessionals/{user}', [UserController::class, 'update'])
        ->name('healthProfessionals.update');

    Route::delete('healthProfessionals/{user}', [UserController::class, 'destroy'])
        ->name('healthProfessionals.destroy');
});