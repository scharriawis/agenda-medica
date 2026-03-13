<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AgendaController;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {

    Route::get('/agenda', [AgendaController::class, 'index'])
        ->name('agenda.index');

    Route::get('/agenda/create', [AgendaController::class, 'create'])
        ->name('agenda.create');

    Route::post('/agenda', [AgendaController::class, 'store'])
        ->name('agenda.store');

    Route::get('/agenda/{cita}', [AgendaController::class, 'show'])
        ->name('agenda.show');

    Route::get('/agenda/{cita}/edit', [AgendaController::class, 'edit'])
        ->name('agenda.edit');

    Route::put('/agenda/{cita}', [AgendaController::class, 'update'])
        ->name('agenda.update');

    Route::put('/agenda/{cita}/drag', [AgendaController::class, 'dragUpdate'])
        ->name('agenda.drag');

    Route::delete('/agenda/{cita}', [AgendaController::class, 'destroy'])
        ->name('agenda.destroy');
});


