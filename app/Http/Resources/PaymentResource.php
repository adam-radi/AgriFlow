<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'             => $this->id,
            'order_id'       => $this->order_id,
            'amount'         => (float) $this->amount,
            'status'         => $this->status,
            'provider'       => $this->provider,
            'transaction_id' => $this->transaction_id,
            'created_at'     => $this->created_at,
            'updated_at'     => $this->updated_at,
        ];
    }
}
