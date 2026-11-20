<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                    => $this->id,
            'product_id'            => $this->product_id,
            'product'               => new ProductResource($this->whenLoaded('product')),
            'harvest_id'            => $this->harvest_id,
            'quantity_standard_id'  => $this->quantity_standard_id,
            'quantity_standard'     => new ProductQuantityResource($this->whenLoaded('quantityStandard')),
            'quantity'              => $this->quantity,
            'unit_price'            => (float) $this->unit_price,
            'subtotal'              => (float) $this->subtotal,
            'scheduled_harvest_date'=> $this->scheduled_harvest_date,
        ];
    }
}
