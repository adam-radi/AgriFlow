<?php

namespace App\Services;

use Illuminate\Validation\ValidationException;

class OrderService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }
    public function  createOrder($items){
         $user=Auth->user();
         if(!HarvestCapacityService->canReserve(...)){
            throw ValidationException::withMessages([
                'harvest'=>'harvest qantity finit '    
                       ]);
         }

         Order::create([
            'user_id'->$user->id(),
            'status'->'pending'.
         ]);

         foreach($items in $item){
            $item->validate([
                'product_id'=>'required|exists:products,id',
                'harvest_id'=>'required|exists:harvests,id|status:open',
                'qantity'=>'required|exists:ProductQuantityStandard|in:label',
            ]);

         OrderItems::create([
            'user_id'=>$item->user_id,
            'product_id'=>$item->product_id,
            'harvest_id'=>$item->harvest_id,
            'qantity'=>$item->quantity,
            ''
         ]);

         }
    }
}
