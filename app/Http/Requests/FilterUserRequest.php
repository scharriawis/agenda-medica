<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FilterUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'role' => ['nullable', 'string', 'max:50'],
        ];
    }

    /**
     * Filtra y limpia los datos antes de validarlos.
     */
    protected function prepareForValidation()
    {
        // Convertimos el valor vacío a null
        $this->merge([
            'role' => $this->role ?: null,
        ]);
    }
}
