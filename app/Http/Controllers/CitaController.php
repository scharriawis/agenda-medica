<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Http\Requests\StoreCitaRequest;
use App\Http\Requests\UpdateCitaRequest;
use App\Models\Paciente;
use Inertia\Inertia;

class CitaController extends Controller
{
    public function __construct()
    {
        //$this->authorizeResource(Cita::class, 'cita');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('citas/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCitaRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Paciente $paciente)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Paciente $paciente)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCitaRequest $request, Paciente $paciente)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Paciente $paciente)
    {
        //
    }
}
