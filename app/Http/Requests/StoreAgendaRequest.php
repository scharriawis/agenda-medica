<?php

namespace App\Http\Requests;

use App\Helpers\FestivosColombia;
use App\Models\Cita;
use App\Models\Profesional;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreAgendaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'paciente_id' => ['required', 'exists:pacientes,id'],
            'professional_id' => ['nullable', 'exists:profesionales,id'],
            'fecha' => ['required', 'date_format:Y-m-d'],
            'hora' => ['required', 'date_format:H:i'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {

            $fecha = Carbon::parse($this->fecha);
            $hora = $this->hora;

            // ❌ No hoy ni pasado
            if ($fecha->isToday() || $fecha->isPast()) {
                $validator->errors()->add('fecha', 'No se pueden agendar citas para hoy o días pasados.');
            }

            // ❌ Fines de semana
            if ($fecha->isWeekend()) {
                $validator->errors()->add('fecha', 'No se pueden agendar citas los fines de semana.');
            }

            // ❌ Festivos
            if (FestivosColombia::esFestivo($fecha)) {
                $validator->errors()->add('fecha', 'No se pueden agendar citas en días festivos.');
            }

            // ❌ Horario inválido
            if (! $this->horaValida($hora)) {
                $validator->errors()->add('hora', 'La hora no está dentro del horario permitido.');
            }

            // Profesionales activos
            $profesionales = Profesional::where('is_active', true)->get();

            if ($profesionales->isEmpty()) {
                $validator->errors()->add('professional_id', 'No hay profesionales disponibles.');

                return;
            }

            // Filtrar profesionales disponibles
            $disponibles = $profesionales->filter(function ($prof) use ($fecha, $hora) {
                return ! Cita::where('professional_id', $prof->id)
                    ->where('fecha', $fecha->format('Y-m-d'))
                    ->where('hora', $hora)
                    ->exists();
            });

            if ($disponibles->isEmpty()) {
                $validator->errors()->add('hora', 'No hay profesionales disponibles en este horario.');
            }

            // Si viene professional_id, validar que esté disponible
            if ($this->professional_id) {
                if (! $disponibles->pluck('id')->contains($this->professional_id)) {
                    $validator->errors()->add('professional_id', 'El profesional seleccionado no está disponible.');
                }
            }
        });
    }

    private function horaValida(string $hora): bool
    {
        $time = Carbon::createFromFormat('H:i', $hora);

        return
            $time->between(Carbon::createFromTime(8, 0), Carbon::createFromTime(12, 0)) ||
            ($time->between(Carbon::createFromTime(14, 0), Carbon::createFromTime(17, 0)));
    }
}
