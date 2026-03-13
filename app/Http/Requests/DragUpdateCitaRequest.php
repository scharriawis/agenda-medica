<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
use Carbon\Carbon;
use App\Models\Cita;
use App\Models\Profesional;
use App\Models\Holiday;

class DragUpdateCitaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // la policy se aplica en el controller
    }

    public function rules(): array
    {
        return [
            'fecha' => ['required', 'date_format:Y-m-d'],
            'hora'  => ['required', 'date_format:H:i'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {

            $fecha = Carbon::parse($this->fecha);
            $hora  = $this->hora;

            // ❌ No hoy ni pasado
            if ($fecha->isToday() || $fecha->isPast()) {
                $validator->errors()->add('fecha', 'No se puede mover la cita para hoy o días pasados.');
            }

            // ❌ Fin de semana
            if ($fecha->isWeekend()) {
                $validator->errors()->add('fecha', 'No se permiten fines de semana.');
            }

            // ❌ Festivos
            if (Holiday::where('fecha', $fecha->format('Y-m-d'))->exists()) {
                $validator->errors()->add('fecha', 'No se permiten días festivos.');
            }

            // ❌ Horario inválido
            if (!$this->horaValida($hora)) {
                $validator->errors()->add('hora', 'Hora fuera del horario permitido.');
            }

            // ❌ Profesional inactivo
            $profesional = Profesional::find($this->route('cita')->profesional_id);

            if (!$profesional || !$profesional->is_active) {
                $validator->errors()->add('profesional_id', 'El profesional no está activo.');
                return;
            }

            // ❌ Doble agendamiento
            if (
                Cita::where('profesional_id', $profesional->id)
                    ->where('fecha', $fecha->format('Y-m-d'))
                    ->where('hora', $hora)
                    ->where('id', '!=', $this->route('cita')->id)
                    ->exists()
            ) {
                $validator->errors()->add('hora', 'Ese horario ya está ocupado.');
            }
        });
    }

    private function horaValida(string $hora): bool
    {
        $time = Carbon::createFromFormat('H:i', $hora);

        return
            ($time->between(
                Carbon::createFromTime(8, 0),
                Carbon::createFromTime(12, 0)
            )) ||
            ($time->between(
                Carbon::createFromTime(14, 0),
                Carbon::createFromTime(17, 0)
            ));
    }
}
