<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize()
    {
        // Get the product from the route parameter
        $product = $this->route('product');
        
        // Check if the user is the owner of the product
        return $product && $this->user()->id === $product->user_id;
    }
    public function rules()
    {
        return [
            'name' => 'sometimes|string',
            'description' => 'sometimes|string',
            'quantities' => 'sometimes|array',
            'quantities.*.label' => 'required_with:quantities|string|regex:/\S/',
            'quantities.*.price' => 'required_with:quantities|numeric|min:0.01',
        ];
    }
    public function messages()
    {
        return [
            'name.string' => 'le nom du produit doit être une chaîne',
            'description.string' => 'la description du produit doit être une chaîne',
            'quantities.array' => 'Le format des quantités est invalide.',
            'quantities.*.label.required_with' => 'L\'étiquette de la quantité est requise.',
            'quantities.*.label.regex' => 'L\'étiquette ne peut pas être vide.',
            'quantities.*.price.required_with' => 'Le prix de la quantité est requis.',
            'quantities.*.price.numeric' => 'Le prix doit être numérique.',
            'quantities.*.price.min' => 'Le prix doit être supérieur à 0.',
        ];
    }
}
