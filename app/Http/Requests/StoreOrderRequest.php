<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isClient();
    }

    public function rules(): array
    {
        return [
            'items'                          => 'required|array|min:1',
            'items.*.harvest_id'             => 'required|integer|exists:harvests,id',
            'items.*.quantity_standard_id'   => 'required|integer|exists:product_quantities,id',
            'items.*.quantity'               => 'required|integer|min:1',
            'zone'                           => 'nullable|string|max:255',
            'delivery_date'                  => 'nullable|date|after_or_equal:today',
        ];
    }
}
