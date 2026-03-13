<?php

use App\Http\Controllers\EpsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('eps', [EpsController::class, 'index'])
        ->name('eps.index');
    Route::post('eps', [EpsController::class, 'store'])
        ->name('eps.store');
    Route::put('eps/{id}', [EpsController::class, 'update'])
        ->name('eps.update');
    Route::delete('eps/{eps}', [EpsController::class, 'destroy'])
        ->name('eps.destroy');

});