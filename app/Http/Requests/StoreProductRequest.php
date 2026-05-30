<?php

namespace App\Http\requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function Authorize()
    {
        return $this->user()->role === 'farmer' || $this->user()->role === 'Farmer';
    }
    public function rules()
    {
        return [
            'name' => 'required|string',
            'description' => 'required|string',
            'quantities' => 'required|array',
            'quantities.*.label' => 'required|string|regex:/\S/',
            'quantities.*.price' => 'required|numeric|min:0.01',
        ];
    }
    public function messages()
    {
        return [
            'name.required' => 'le nom du produit est requis',
            'description.required' => 'la description du produit est requise',
            'quantities.required' => 'Au moins une quantité est requise.',
            'quantities.array' => 'Le format des quantités est invalide.',
            'quantities.*.label.required' => 'L\'étiquette de la quantité est requise.',
            'quantities.*.label.regex' => 'L\'étiquette ne peut pas être vide.',
            'quantities.*.price.required' => 'Le prix de la quantité est requis.',
            'quantities.*.price.numeric' => 'Le prix doit être numérique.',
            'quantities.*.price.min' => 'Le prix doit être supérieur à 0.',
        ];
    }
}
