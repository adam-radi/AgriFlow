<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'    => $this->id,
            'items' => CartItemResource::collection($this->whenLoaded('items')),
            'total' => (float) $this->items->sum(fn ($item) => $item->unit_price * $item->quantity),
            'count' => $this->items->sum('quantity'),
        ];
    }
}
