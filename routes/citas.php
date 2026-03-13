<?php

use App\Http\Controllers\CitaController;
use Illuminate\Support\Facades\Route;

Route::get('citas', [CitaController::class, 'index'])
    ->name('citas.index');

Route::post('citas', [CitaController::class, 'store'])
    ->name('citas.store');

Route::get('citas/{cita}', [CitaController::class, 'show'])
    ->name('citas.show');

Route::put('citas/{cita}', [CitaController::class, 'update'])
    ->name('citas.update');

Route::delete('citas/{cita}', [CitaController::class, 'destroy'])
    ->name('citas.destroy');
