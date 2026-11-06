<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = ['cart_id', 'harvest_id', 'quantity_standard_id', 'quantity', 'unit_price'];

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function harvest()
    {
        return $this->belongsTo(Harvest::class);
    }

    public function quantityStandard()
    {
        return $this->belongsTo(ProductQuantity::class, 'quantity_standard_id');
    }
}
