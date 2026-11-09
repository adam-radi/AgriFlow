<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFarmerProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('farmer') ?? false;
    }

    public function rules(): array
    {
        return [
            'farm_name' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'address' => [
                'required',
                'string',
                'max:255',
            ],

            'city' => [
                'required',
                'string',
                'max:100',
            ],

            'region' => [
                'required',
                'string',
                'max:100',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'farm_name.required' =>
                'Le nom de l’exploitation est obligatoire.',

            'address.required' =>
                'L’adresse est obligatoire.',

            'city.required' =>
                'La ville est obligatoire.',

            'region.required' =>
                'La région est obligatoire.',
        ];
    }
}