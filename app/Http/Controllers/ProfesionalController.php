<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProfesionalRequest;
use App\Http\Requests\UpdateProfesionalRequest;
use App\Models\Consultorio;
use App\Models\Profesional;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ProfesionalController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Profesional::class);

        $type = $request->get('type'); // doctor | odontologo | null

        $query = Profesional::with([
            'user.consultorio',
        ]);

        if ($type && $type !== 'todos') {
            $query->where('type', $type);
        }

        return Inertia::render('profesionales/index', [
            'profesionales' => $query->get(),
            'types' => Profesional::select('type')->distinct()->pluck('type'),
            'filtroActivo' => $type ?? 'todos',
        ]);
    }

    public function create()
    {
        Gate::authorize('create', User::class);

        return Inertia::render('profesionales/form', [
            'consultorios' => Consultorio::all(),
            'usuariosAll' => User::all(),
        ]);
    }

    public function store(StoreProfesionalRequest $request)
    {
        Gate::authorize('create', User::class);

        DB::transaction(function () use ($request) {
            $data = $request->validated();

            // Crear usuario
            $user = User::create([
                'consultorio_id' => $data['consultorio_id'],
                'role' => $data['role'],
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
            ]);

            // Crear perfil profesional si aplica
            if ($data['role'] === 'professional') {
                $user->professional()->create([
                    'type' => $data['type'],
                    'license_number' => $data['license_number'] ?? null,
                    'phone' => $data['phone'] ?? null,
                    'is_active' => true,
                ]);
            }
        });

        return redirect()
            ->route('profesionales.index')
            ->with('success', 'El usuario fue creado correctamente.');
    }

    public function edit(User $user)
    {
        Gate::authorize('update', $user);

        return Inertia::render('profesionales/form', [
            'user' => $user->load('professional'),
            'consultorios' => Consultorio::all(),
            'usuariosAll' => User::all(),
        ]);
    }

    public function update(UpdateProfesionalRequest $request, User $user)
    {
        Gate::authorize('update', $user);

        DB::transaction(function () use ($request, $user) {
            $data = $request->validated();

            // Actualizar usuario
            $user->update([
                'consultorio_id' => $data['consultorio_id'],
                'role' => $data['role'],
                'name' => $data['name'],
                'email' => $data['email'],
            ]);

            // Profesional
            if ($data['role'] === 'professional') {
                $user->professional()->updateOrCreate(
                    [],
                    [
                        'type' => $data['type'],
                        'license_number' => $data['license_number'] ?? null,
                        'phone' => $data['phone'] ?? null,
                        'is_active' => $data['is_active'] ?? true,
                    ]
                );
            } else {
                // Si deja de ser profesional
                $user->professional()?->delete();
            }
        });

        return redirect()
            ->route('profesionales.index')
            ->with('success', 'El usuario fue actualizado correctamente.');
    }

    public function destroy(User $user)
    {
        Gate::authorize('delete', $user);

        $user->delete();

        return redirect()
            ->route('profesionales.index')
            ->with('success', 'El usuario fue eliminado exitosamente.');
    }
}
