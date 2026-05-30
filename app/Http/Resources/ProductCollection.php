<?php
namespace App\Http\Resources;
use Illuminate\Http\Resources\Json\JsonResource;
class ProductCollection extends JSonResource
{
    public function toArray($request){
        return [
            'data'=>ProductResource::collection($this->collection),
        ]  ;  }
}


?>