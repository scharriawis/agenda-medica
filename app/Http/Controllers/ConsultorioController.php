<?php

namespace App\Http\Controllers;

use App\Models\Consultorio;
use App\Http\Requests\StoreConsultorioRequest;
use App\Http\Requests\UpdateConsultorioRequest;
use Inertia\Inertia;

class ConsultorioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('consultorio/index', [
            'consultorios' => Consultorio::with('users')->get()

        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia('consultorio/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreConsultorioRequest $request)
    {
        Consultorio::create($request->validated());
        return redirect()->route('consultorio.index')
            ->with('success', 'Consultorio creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Consultorio $consultorio)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Consultorio $consultorio)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateConsultorioRequest $request, Consultorio $consultorio)
    {
        $consultorio->update($request->only('nombre'));

        return redirect()->route('consultorio.index')
            ->with('success', 'Consultorio actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Consultorio $consultorio)
    {
        $consultorio->delete();

        return redirect()->route('consultorio.index')
            ->with('success', 'Consultorio eliminado correctamente.');
    }
}
