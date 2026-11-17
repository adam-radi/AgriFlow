<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Harvest extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id', 'start_date', 'end_date',
        'estimated_total_qte', 'max_daily_qte', 'status',
        'reserved_quantity',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function dailyCapacities()
    {
        return $this->hasMany(HarvestDailyCapacity::class);
    }
}
