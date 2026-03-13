<?php

namespace App\Http\Requests;

use App\Helpers\FestivosColombia;
use App\Models\Cita;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAgendaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // la Policy manda aquí
    }

    public function rules(): array
    {
        return [
            'paciente_id' => ['required', 'exists:pacientes,id'],
            'professional_id' => ['required', 'exists:professionals,id'],
            'fecha' => ['required', 'date_format:Y-m-d'],
            'hora' => ['required', 'date_format:H:i'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {

            /** @var Cita $cita */
            $cita = $this->route('cita');

            $fechaNueva = Carbon::parse($this->fecha);
            $horaNueva = $this->hora;

            // ❌ No editar hoy ni mañana
            if ($fechaNueva->isToday() || $fechaNueva->isTomorrow()) {
                $validator->errors()->add('fecha', 'No se puede editar la cita el mismo día ni el día anterior.');
            }

            // ❌ Si está confirmada
            if ($cita->status === 'confirmada') {
                $validator->errors()->add('status', 'La cita ya está confirmada y no puede ser modificada.');
            }

            // ❌ Fines de semana
            if ($fechaNueva->isWeekend()) {
                $validator->errors()->add('fecha', 'No se pueden agendar citas los fines de semana.');
            }

            // ❌ Festivos
            if (FestivosColombia::esFestivo($fechaNueva)) {
                $validator->errors()->add('fecha', 'No se pueden agendar citas en días festivos.');
            }

            // ❌ Horario inválido
            if (! $this->horaValida($horaNueva)) {
                $validator->errors()->add('hora', 'La hora no está dentro del horario permitido.');
            }

            // ❌ Doble agendamiento (ignora la cita actual)
            $existe = Cita::where('professional_id', $this->professional_id)
                ->where('fecha', $fechaNueva->format('Y-m-d'))
                ->where('hora', $horaNueva)
                ->where('id', '!=', $cita->id)
                ->exists();

            if ($existe) {
                $validator->errors()->add('hora', 'El profesional ya tiene una cita en ese horario.');
            }
        });
    }

    private function horaValida(string $hora): bool
    {
        $time = Carbon::createFromFormat('H:i', $hora);

        return
            $time->between(
                Carbon::createFromTime(8, 0),
                Carbon::createFromTime(12, 0)
            ) ||
            $time->between(
                Carbon::createFromTime(14, 0),
                Carbon::createFromTime(17, 0)
            );
    }
}
