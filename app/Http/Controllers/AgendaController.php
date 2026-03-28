<?php

namespace App\Http\Controllers;

use App\Events\CitaActualizada;
use App\Http\Requests\StoreAgendaRequest;
use App\Http\Requests\UpdateAgendaRequest;
use App\Models\Cita;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AgendaController extends Controller
{
    public function __construct()
    {
        // 🔐 Aplica policies automáticamente a todos los métodos REST
        $this->authorizeResource(Cita::class, 'cita');
    }

    /**
     * GET /citas
     * Policy: viewAny
     */
    public function index()
    {
        $user = Auth::user();

        $citas = Cita::forUser($user)
            ->with([
                'professional.user:id,name',
                'paciente.user:id,name',
            ])
            ->get()
            ->map(function ($cita) {
                $start = "{$cita->fecha}T{$cita->hora}";

                // ⏱️ 30 minutos por defecto
                $end = \Carbon\Carbon::parse($start)
                    ->addMinutes(30)
                    ->toISOString();

                return [
                    'id' => $cita->id,
                    'title' => $cita->professional->user->name,
                    'start' => $start,
                    'end' => $end,

                    // 👉 TODO lo que FullCalendar necesita
                    'extendedProps' => [
                        'profesional' => $cita->professional->user->name,
                        'profesional_id' => $cita->professional_id,
                        'paciente' => $cita->paciente->user->name,
                        'paciente_id' => $cita->paciente_id,
                        'status' => $cita->status,
                    ],
                ];
            });

        return Inertia::render('agenda/index', [
            'citas' => $citas,
            'user' => [
                'id' => $user->id,
                'role' => $user->role,
            ],
        ]);
    }

    /**
     * GET /citas/{cita}
     * Policy: view
     */
    public function show(Cita $cita)
    {
        return Inertia::render('Citas/Show', [
            'cita' => $cita->load(['user', 'professional']),
        ]);
    }

    /**
     * GET /citas/create
     * Policy: create
     */
    public function create()
    {
        return Inertia::render('Citas/Create');
    }

    /**
     * POST /citas
     * Policy: create
     */
    public function store(StoreAgendaRequest $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'professional_id' => ['required', 'exists:professionals,id'],
            'fecha' => ['required', 'date'],
            'tipo_cita' => ['required', 'string'],
        ]);

        $cita = Cita::create($validated);

        event(new CitaActualizada($cita));

        return redirect()
            ->route('agenda.index')
            ->with('success', 'Cita creada correctamente');
    }

    /**
     * GET /citas/{cita}/edit
     * Policy: update
     */
    public function edit(Cita $cita)
    {
        return Inertia::render('Citas/Edit', [
            'cita' => $cita,
        ]);
    }

    /**
     * PUT /citas/{cita}
     * Policy: update
     */
    public function update(UpdateAgendaRequest $request, Cita $cita)
    {
        $validated = $request->validate([
            'fecha' => ['required', 'date'],
            'tipo_cita' => ['required', 'string'],
            'status' => ['required', 'string'],
        ]);

        $cita->update($validated);

        return redirect()
            ->route('agenda.index')
            ->with('success', 'Cita actualizada correctamente');
    }

    /**
     * DELETE /citas/{cita}
     * Policy: delete
     */
    public function destroy(Cita $cita)
    {
        $cita->delete();

        return redirect()
            ->route('agenda.index')
            ->with('success', 'Cita eliminada correctamente');
    }

    public function dragUpdate(Request $request, Cita $cita)
    {
        // 🔐 Autorización por policy
        $this->authorize('dragUpdate', $cita);

        // ✅ Validación
        $data = $request->validate([
            'fecha' => ['required', 'date'],
            'hora' => ['required'],
            'professional_id' => ['required', 'exists:professionals,id'],
            'paciente_id' => ['required', 'exists:users,id'],
        ]);

        // 🆕 Profesional seleccionado en Día B
        $professionalId = $data['professional_id'];

        // 🕒 Construir fecha inicio y fin (duración fija 30 min)
        $inicio = Carbon::parse($data['fecha'].' '.$data['hora']);
        $fin = (clone $inicio)->addMinutes(30);

        // 🔒 Validar solapamientos con el NUEVO profesional
        $existeSolapamiento = Cita::where('professional_id', $professionalId)
            ->where('id', '!=', $cita->id)
            ->where(function ($query) use ($inicio, $fin) {
                $query
                    ->whereRaw('? < (fecha + hora + INTERVAL 30 MINUTE)', [$inicio])
                    ->whereRaw('? > (fecha + hora)', [$fin]);
            })
            ->exists();

        if ($existeSolapamiento) {
            return response()->json([
                'message' => 'La cita se solapa con otra existente para este profesional',
            ], 422);
        }

        // ✅ Actualizar cita (fecha, hora y profesional)
        $cita->update([
            'fecha' => $data['fecha'],
            'hora' => $data['hora'],
            'professional_id' => $professionalId,
            'updated_by' => Auth::id(),
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Cita reprogramada correctamente',
        ]);
    }

}
