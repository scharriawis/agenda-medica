<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfesionalRequest extends FormRequest
{

    public function rules(): array
    {
        $user = $this->route('user');

        return [
            // User
            'consultorio_id' => ['required', 'integer', 'exists:consultorios,id'],
            'role' => ['required', Rule::in(['professional', 'paciente'])],
            'name' => ['required', 'string', 'max:200'],
            'email' => [
                'required',
                'email',
                'max:200',
                Rule::unique('users', 'email')->ignore($user->id),
            ],

            // Professional
            'type' => ['required_if:role,professional', Rule::in(['doctor', 'odontologo'])],
            'license_number' => ['nullable', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
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

            'type.required_if' => 'El tipo de profesional es obligatorio.',
        ];
    }
}
