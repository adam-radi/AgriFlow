<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DeliveryGroupItem extends Model
{
    use HasFactory;

    protected $fillable = ['delivery_group_id', 'order_item_id'];

    public function deliveryGroup()
    {
        return $this->belongsTo(DeliveryGroup::class);
    }

    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }
}
