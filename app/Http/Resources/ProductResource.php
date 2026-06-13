<?php

namespace App\Http\Resources;
use Illuminate\Http\Resources\Json\JsonResource;
class ProductResource extends JsonResource
{
    public function toArray($request){
        return [
            'id'=>$this->id,
            'name'=>$this->name,
            'description'=>$this->description,
            'base_price'=>$this->base_price,
            'user_id'=>$this->user_id,
            'created_at'=>$this->created_at,
            'quantities'=>ProductQuantityResource::collection($this->productQuantities),
            
        ];
    }
}

?>