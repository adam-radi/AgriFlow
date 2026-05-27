<?php
namespace App\Http\Resources;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductQuantityResource extends JsonResource
{
    public function toArray($request){
        return [
            'id'=>$this->id,
            'label'=>$this->label,
            'price'=>$this->price,
        ];
    }
}

?>