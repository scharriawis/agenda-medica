<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProfesionalDisponibleController;

Route::get(
    '/api/profesionales',
    [ProfesionalDisponibleController::class, 'index']
);

Route::get('/api/profesionales/listar', [ProfesionalDisponibleController::class, 'listar']);

Route::get('/api/disponibilidades', [ProfesionalDisponibleController::class, 'show']);

Route::post(
    '/api/disponibilidades',
    [ProfesionalDisponibleController::class, 'store']
);

Route::get(
    '/api/agenda/slots',
    [ProfesionalDisponibleController::class, 'slots']
);

Route::delete('/api/disponibilidades', [ProfesionalDisponibleController::class, 'destroy']);