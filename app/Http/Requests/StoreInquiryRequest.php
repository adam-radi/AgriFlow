<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'product_id'            => 'required|exists:products,id',
            'harvest_id'            => 'nullable|exists:harvests,id',
            'quantity_standard_id'  => 'nullable|exists:products_quantities,id',
            'quantity'              => 'required|numeric|min:0.01',
            'proposed_price'        => 'required|numeric|min:0.01',
            'delivery_zone'         => 'nullable|string|max:255',
            'desired_delivery_date' => 'nullable|date|after_or_equal:today',
            'message'               => 'nullable|string|max:2000',
        ];
    }
}
