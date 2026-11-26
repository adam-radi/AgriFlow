<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CounterOfferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'proposed_price'         => 'required|numeric|min:0.01',
            'proposed_quantity'      => 'required|numeric|min:0.01',
            'proposed_delivery_date' => 'nullable|date|after_or_equal:today',
            'message'                => 'nullable|string|max:2000',
        ];
    }
}
