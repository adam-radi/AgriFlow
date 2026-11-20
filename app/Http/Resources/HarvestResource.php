<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class HarvestResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                  => $this->id,
            'product_id'          => $this->product_id,
            'product'             => new ProductResource($this->whenLoaded('product')),
            'status'              => $this->status,
            'start_date'          => $this->start_date,
            'end_date'            => $this->end_date,
            'estimated_total_qte' => (float) $this->estimated_total_qte,
            'max_daily_qte'       => (float) $this->max_daily_qte,
            'reserved_quantity'   => (float) $this->reserved_quantity,
            'created_at'          => $this->created_at,
            'updated_at'          => $this->updated_at,
        ];
    }
}
