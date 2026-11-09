<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $userId = $this->user()->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],

            'phone' => [
                'required',
                'string',
                'max:30',
                Rule::unique('users', 'phone')->ignore($userId),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' =>
                'Le nom est obligatoire.',

            'email.required' =>
                'L’adresse e-mail est obligatoire.',

            'email.unique' =>
                'Cette adresse e-mail est déjà utilisée.',

            'phone.required' =>
                'Le numéro de téléphone est obligatoire.',

            'phone.unique' =>
                'Ce numéro de téléphone est déjà utilisé.',
        ];
    }
}