<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HarvestDailyCapacity extends Model
{
    use HasFactory;

    protected $fillable = [
        'harvest_id',
        'date',
        'reserved_quantity',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'string',
        ];
    }

    public function harvest()
    {
        return $this->belongsTo(Harvest::class);
    }
}
