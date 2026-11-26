<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseInquiryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                    => $this->id,
            'status'                => $this->status,
            'buyer_id'              => $this->buyer_id,
            'buyer'                 => new UserResource($this->whenLoaded('buyer')),
            'farmer_id'             => $this->farmer_id,
            'farmer'                => new UserResource($this->whenLoaded('farmer')),
            'product_id'            => $this->product_id,
            'product'               => new ProductResource($this->whenLoaded('product')),
            'harvest_id'            => $this->harvest_id,
            'harvest'               => new HarvestResource($this->whenLoaded('harvest')),
            'quantity_standard_id'  => $this->quantity_standard_id,
            'quantity_standard'     => new ProductQuantityResource($this->whenLoaded('quantityStandard')),
            'initial_quantity'      => (float) $this->initial_quantity,
            'initial_price'         => (float) $this->initial_price,
            'initial_total'         => (float) ($this->initial_quantity * $this->initial_price),
            'current_quantity'      => (float) $this->current_quantity,
            'current_price'         => (float) $this->current_price,
            'current_total'         => (float) ($this->current_quantity * $this->current_price),
            'delivery_zone'         => $this->delivery_zone,
            'desired_delivery_date' => $this->desired_delivery_date?->toDateString(),
            'notes'                 => $this->notes,
            'negotiations'          => InquiryNegotiationResource::collection($this->whenLoaded('negotiations')),
            'created_at'            => $this->created_at,
            'updated_at'            => $this->updated_at,
        ];
    }
}
