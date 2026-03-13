<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class StoreProfesionalRequest extends FormRequest
{

    public function rules(): array
    {
        return [
            // User
            'consultorio_id' => ['required', 'integer', 'exists:consultorios,id'],
            'role' => ['required', Rule::in(['professional', 'paciente'])],
            'name' => ['required', 'string', 'max:200'],
            'email' => ['required', 'email', 'max:200', 'unique:users,email'],

            // Auth
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
                    ->uncompromised(),
            ],

            // Professional (solo si es professional)
            'type' => ['required_if:role,professional', Rule::in(['doctor', 'odontologo'])],
            'license_number' => ['nullable', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'consultorio_id.required' => 'El consultorio es obligatorio.',
            'role.required' => 'El rol es obligatorio.',
            'role.in' => 'El rol seleccionado no es válido.',

            'name.required' => 'El nombre es obligatorio.',
            'email.required' => 'El correo es obligatorio.',
            'email.unique' => 'Este correo ya existe.',

            'password.required' => 'La contraseña es obligatoria.',
            'password.confirmed' => 'Las contraseñas no coinciden.',

            'type.required_if' => 'El tipo de profesional es obligatorio.',
            'type.in' => 'El tipo de profesional no es válido.',
        ];
    }
}
