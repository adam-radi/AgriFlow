<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                 => $this->id,
            'harvest_id'         => $this->harvest_id,
            'harvest'            => new HarvestResource($this->whenLoaded('harvest')),
            'quantity_standard_id' => $this->quantity_standard_id,
            'quantity_standard'  => new ProductQuantityResource($this->whenLoaded('quantityStandard')),
            'quantity'           => $this->quantity,
            'unit_price'         => (float) $this->unit_price,
            'subtotal'           => (float) ($this->unit_price * $this->quantity),
        ];
    }
}
