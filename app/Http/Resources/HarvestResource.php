<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HarvestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return ([
            'id'=>$this->id,
            'product_id'=>$this->product_id,
            'status'=>$this->status,
            'start_date'=>$this->start_date,
            'end_date'=>$this->end_date,
            'estimated_total_qte'=>$this->estimated_total_qte,
            'max_daily_qte'=>$this->max_daily_qte,

        ]);
    }
}
