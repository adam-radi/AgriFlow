<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InquiryNegotiation extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_inquiry_id',
        'sender_id',
        'sender_role',
        'proposed_price',
        'proposed_quantity',
        'proposed_delivery_date',
        'message',
    ];

    protected $casts = [
        'proposed_price'         => 'float',
        'proposed_quantity'      => 'float',
        'proposed_delivery_date' => 'date',
    ];

    public function inquiry(): BelongsTo
    {
        return $this->belongsTo(PurchaseInquiry::class, 'purchase_inquiry_id');
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
