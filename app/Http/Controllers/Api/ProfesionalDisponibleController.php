<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DisponibilidadProfesional;
use App\Models\Profesional;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProfesionalDisponibleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'date' => ['required', 'date'],
            'exclude_cita_id' => ['nullable', 'integer', 'exists:citas,id'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos inválidos',
                'errors' => $validator->errors(),
            ], 422);
        }

        $date = Carbon::parse($request->date)->toDateString();
        $excludeCitaId = $request->exclude_cita_id;

        $profesionales = Profesional::query()
            ->where('is_active', true)

            ->whereDoesntHave('citas', function ($q) use ($date, $excludeCitaId) {
                $q->whereDate('fecha', $date)
                    ->whereIn('status', ['confirmada', 'pendiente'])
                    ->when(
                        $excludeCitaId,
                        fn ($q) => $q->where('id', '!=', $excludeCitaId)
                    );
            })

            // 🔥 ESTO ES LO QUE FALTABA
            ->with('user:id,name')

            ->select('id', 'user_id', 'type')
            ->orderBy('id')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'type' => $p->type,
                'user' => [
                    'name' => $p->user->name,
                ],
            ]);

        return response()->json($profesionales);
    }

    public function listar()
    {
        return Profesional::query()
            ->where('is_active', true)
            ->with('user:id,name')
            ->select('id', 'user_id', 'type')
            ->orderBy('id')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'type' => $p->type,
                'user' => [
                    'name' => $p->user->name,
                ],
            ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'professional_id' => ['required', 'exists:professionals,id'],
            'fecha' => ['required', 'date'],
            'horas' => ['required', 'array', 'min:1'],
            'horas.*' => ['date_format:H:i'],
        ]);

        // borrar disponibilidad previa del día
        DisponibilidadProfesional::where('professional_id', $data['professional_id'])
            ->where('fecha', $data['fecha'])
            ->delete();

        foreach ($data['horas'] as $hora) {
            DisponibilidadProfesional::create([
                'professional_id' => $data['professional_id'],
                'fecha' => $data['fecha'],
                'hora' => $hora,
                'created_by' => Auth::id(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Disponibilidad guardada correctamente',
        ]);
    }

    public function show(Request $request)
    {
        $request->validate([
            'start' => ['nullable', 'date'],
            'end' => ['nullable', 'date'],
            'fecha' => ['nullable', 'date'],
        ]);

        $query = DisponibilidadProfesional::with('professional.user');

        if ($request->fecha) {
            $query->where('fecha', $request->fecha);
        }

        if ($request->start && $request->end) {
            $query->whereBetween('fecha', [
                $request->start,
                $request->end,
            ]);
        }

        $disponibilidades = $query
            ->orderBy('fecha')
            ->orderBy('hora')
            ->get()

            /*
            |------------------------------------------------
            | 🔥 FILTRAR HORAS QUE YA TENGAN CITA
            |------------------------------------------------
            */

            ->filter(function ($disp) {

                return ! $disp->professional->citas()
                    ->whereDate('fecha', $disp->fecha)
                    ->whereTime('hora', $disp->hora)
                    ->whereIn('status', ['confirmada', 'pendiente'])
                    ->exists();
            })

            ->groupBy(['fecha', 'professional_id']);

        return $disponibilidades->flatMap(function ($byProfessional, $fecha) {

            return collect($byProfessional)->map(function ($items, $professionalId) use ($fecha) {

                $professional = $items->first()->professional;

                return [
                    'fecha' => $fecha,
                    'professional_id' => $professionalId,
                    'professional' => ucfirst($professional->type).' — '.$professional->user->name,
                    'horas' => $items->pluck('hora')->values(),
                ];
            });

        })->values();
    }

    public function slots(Request $request)
    {
        $data = $request->validate([
            'professional_id' => ['required', 'exists:professionals,id'],
            'fecha' => ['required', 'date'],
        ]);

        $professionalId = $data['professional_id'];
        $fecha = Carbon::parse($data['fecha'])->toDateString();

        /*
        |--------------------------------------------------------------------------
        | Horarios base del sistema
        |--------------------------------------------------------------------------
        */

        $slots = [
            '08:00', '08:30',
            '09:00', '09:30',
            '10:00', '10:30',
            '11:00', '11:30',
            '12:00',

            '14:00', '14:30',
            '15:00', '15:30',
            '16:00', '16:30',
            '17:00',
        ];

        /*
        |--------------------------------------------------------------------------
        | Disponibilidad registrada
        |--------------------------------------------------------------------------
        */

        $disponibles = DisponibilidadProfesional::query()
            ->where('professional_id', $professionalId)
            ->where('fecha', $fecha)
            ->pluck('hora')
            ->toArray();

        /*
        |--------------------------------------------------------------------------
        | Citas ocupadas
        |--------------------------------------------------------------------------
        */

        $ocupadas = \App\Models\Cita::query()
            ->where('professional_id', $professionalId)
            ->whereDate('fecha', $fecha)
            ->whereIn('status', ['confirmada', 'pendiente'])
            ->pluck('hora')
            ->toArray();

        /*
        |--------------------------------------------------------------------------
        | Construir respuesta
        |--------------------------------------------------------------------------
        */

        $result = collect($slots)->map(function ($hora) use ($disponibles, $ocupadas) {

            if (in_array($hora, $ocupadas)) {
                $status = 'booked';
            } elseif (in_array($hora, $disponibles)) {
                $status = 'available';
            } else {
                $status = 'disabled';
            }

            return [
                'hora' => $hora,
                'status' => $status,
            ];
        });

        return response()->json($result);
    }

    public function destroy(Request $request): JsonResponse
    {
        $data = $request->validate([
            'professional_id' => ['required', 'exists:professionals,id'],
            'fecha' => ['required', 'date'],
        ]);

        DisponibilidadProfesional::where('professional_id', $data['professional_id'])
            ->where('fecha', $data['fecha'])
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Disponibilidades eliminadas correctamente',
        ]);
    }
}
