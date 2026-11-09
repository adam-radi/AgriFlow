<?php

namespace App\Http\Requests;
    
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfessionalBuyerProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('professional_buyer') ?? false;
    }

    public function rules(): array
    {
        $profileId = $this->user()
            ?->professionalBuyerProfile
            ?->id;

        return [
            'business_name' => [
                'required',
                'string',
                'max:255',
            ],

            'business_type' => [
                'required',
                'string',
                'max:150',
            ],

            'ice' => [
                'nullable',
                'string',
                'max:30',
                Rule::unique(
                    'professional_buyer_profiles',
                    'ice'
                )->ignore($profileId),
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
            'business_name.required' =>
                'Le nom de l’entreprise est obligatoire.',

            'business_type.required' =>
                'Le type d’activité est obligatoire.',

            'ice.unique' =>
                'Cet ICE est déjà associé à un autre profil.',

            'address.required' =>
                'L’adresse est obligatoire.',

            'city.required' =>
                'La ville est obligatoire.',

            'region.required' =>
                'La région est obligatoire.',
        ];
    }
}
?>