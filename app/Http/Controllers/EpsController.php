<?php

namespace App\Http\Controllers;

use App\Models\Eps;
use App\Http\Requests\StoreEpsRequest;
use App\Http\Requests\UpdateEpsRequest;
use Inertia\Inertia;

class EpsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('eps/index', [
            'epss' => Eps::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia('eps/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEpsRequest $request)
    {
        Eps::create($request->validated());

        return redirect()
            ->route('eps.index')
            ->with('success', 'Eps creada correctamente.');
    }


    /**
     * Display the specified resource.
     */
    public function show(Eps $eps)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Eps $eps)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEpsRequest $request, $id)
    {
        $eps = Eps::findOrFail($id);
        $eps->update($request->validated());

        return redirect()->route('eps.index')
            ->with('success', 'Eps actualizado correctamente.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Eps $eps)
    {
        $eps->delete();

        return redirect()->route('eps.index')
            ->with('success', 'Eps eliminada correctamente.');
    }
}
