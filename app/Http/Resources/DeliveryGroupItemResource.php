<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DeliveryGroupItemResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'              => $this->id,
            'delivery_group_id' => $this->delivery_group_id,
            'order_item_id'   => $this->order_item_id,
            'order_item'      => new OrderItemResource($this->whenLoaded('orderItem')),
        ];
    }
}
