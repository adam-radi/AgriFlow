<?php

namespace App\Http\Requests\Verification;

use Illuminate\Foundation\Http\FormRequest;

class SubmitVerificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'documents' => [
                'required',
                'array',
                'min:1',
                'max:10',
            ],

            'documents.*.type' => [
                'required',
                'string',
                'in:identity,registration,professional_certificate,address_proof,other',
            ],

            'documents.*.file' => [
                'required',
                'file',
                'mimes:pdf,jpg,jpeg,png',
                'max:5120',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'documents.required' =>
                'Vous devez joindre au moins un document.',

            'documents.min' =>
                'Vous devez joindre au moins un document.',

            'documents.max' =>
                'Vous ne pouvez pas joindre plus de 10 documents.',

            'documents.*.type.required' =>
                'Le type de chaque document est obligatoire.',

            'documents.*.type.in' =>
                'Le type de document sélectionné est invalide.',

            'documents.*.file.required' =>
                'Chaque document doit contenir un fichier.',

            'documents.*.file.mimes' =>
                'Les formats autorisés sont PDF, JPG, JPEG et PNG.',

            'documents.*.file.max' =>
                'Chaque document ne doit pas dépasser 5 Mo.',
        ];
    }
}
