<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProfessionelBuyerProfile extends Model
{
       protected $fillable = [
        'user_id',
        'business_name',
        'business_type',
        'ice',
        'address',
        'city',
        'region',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
