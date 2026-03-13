<?php

use App\Http\Controllers\ConsultorioController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('consultorio', [ConsultorioController::class, 'index'])
        ->name('consultorio.index');
    Route::post('consultorio/store', [ConsultorioController::class, 'store'])
        ->name('consultorio.store');
    Route::put('consultorio/{consultorio}', [ConsultorioController::class, 'update'])
        ->name('consultorio.update');
    Route::delete('consultorio/{consultorio}', [ConsultorioController::class, 'destroy'])
        ->name('consultorio.destroy');
});