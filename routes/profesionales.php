<?php

use App\Http\Controllers\ProfesionalController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('profesionales', [ProfesionalController::class, 'index'])
        ->name('profesionales.index');

    Route::get('profesionales/create', [ProfesionalController::class, 'create'])
        ->name('profesionales.create');

    Route::post('profesionales/store', [ProfesionalController::class, 'store'])
        ->name('profesionales.store');

    Route::get('profesionales/{user}/edit', [ProfesionalController::class, 'edit'])
        ->name('profesionales.edit');

    Route::put('profesionales/{user}', [ProfesionalController::class, 'update'])
        ->name('profesionales.update');

    Route::delete('profesionales/{user}', [ProfesionalController::class, 'destroy'])
        ->name('profesionales.destroy');
});