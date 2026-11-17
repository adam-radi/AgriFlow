<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DeliveryGroupResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'              => $this->id,
            'delivery_date'   => $this->delivery_date,
            'zone'            => $this->zone,
            'status'          => $this->status,
            'delivery_user_id'=> $this->delivery_user_id,
            'delivery_user'   => new UserResource($this->whenLoaded('deliveryUser')),
            'items'           => DeliveryGroupItemResource::collection($this->whenLoaded('items')),
            'created_at'      => $this->created_at,
            'updated_at'      => $this->updated_at,
        ];
    }
}
