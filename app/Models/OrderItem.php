<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id', 'product_id', 'harvest_id',
        'quantity_standard_id', 'quantity', 'unit_price', 'subtotal',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function harvest()
    {
        return $this->belongsTo(Harvest::class);
    }

    public function quantityStandard()
    {
        return $this->belongsTo(ProductQuantity::class, 'quantity_standard_id');
    }

    public function deliveryGroupItem()
    {
        return $this->hasOne(DeliveryGroupItem::class);
    }
}
