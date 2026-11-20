<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DeliveryGroup extends Model
{
    use HasFactory;

    protected $fillable = ['delivery_date', 'zone', 'status', 'delivery_user_id'];

    public function deliveryUser()
    {
        return $this->belongsTo(User::class, 'delivery_user_id');
    }

    public function items()
    {
        return $this->hasMany(DeliveryGroupItem::class);
    }
}
