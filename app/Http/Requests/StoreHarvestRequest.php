<?php

namespace App\Http\Requests;

use App\Enums\HarvestStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreHarvestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isFarmer() === true;
    }

    public function rules(): array
    {
        return [
            'product_id'             => 'required|exists:products,id',
            'start_date'             => 'required|date',
            'end_date'               => 'nullable|date|after_or_equal:start_date',
            'estimated_total_qte'    => 'required|numeric|min:0',
            'max_daily_qte'          => 'nullable|numeric|min:0',
            'status'                 => 'nullable|in:' . HarvestStatus::Open . ',' . HarvestStatus::Close,
        ];
    }
}
