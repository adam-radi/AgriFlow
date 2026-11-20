<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'            => $this->id,
            'customer_id'   => $this->customer_id,
            'customer'      => new UserResource($this->whenLoaded('customer')),
            'status'        => $this->status,
            'total_amount'  => (float) $this->total_amount,
            'zone'          => $this->zone,
            'delivery_date' => $this->delivery_date,
            'items'         => OrderItemResource::collection($this->whenLoaded('items')),
            'payment'       => new PaymentResource($this->whenLoaded('payment')),
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,
        ];
    }
}
