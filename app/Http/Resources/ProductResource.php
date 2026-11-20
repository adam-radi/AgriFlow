<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'description' => $this->description,
            'base_price'  => (float) $this->base_price,
            'price'       => (float) $this->base_price,
            'image'       => $this->image_path
                                ? asset('storage/' . $this->image_path)
                                : null,
            'user_id'     => $this->user_id,
            'farmer'      => new UserResource($this->whenLoaded('user')),
            'quantities'  => ProductQuantityResource::collection($this->whenLoaded('productQuantities')),
            'harvests'    => HarvestResource::collection($this->whenLoaded('harvests')),
            'is_available' => $this->is_available ?? true,
            'created_at'  => $this->created_at,
            'updated_at'  => $this->updated_at,
        ];
    }
}
