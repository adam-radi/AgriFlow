<?php

namespace App\Models;

use App\Enums\InquiryStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseInquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id',
        'farmer_id',
        'product_id',
        'harvest_id',
        'quantity_standard_id',
        'status',
        'initial_quantity',
        'initial_price',
        'current_quantity',
        'current_price',
        'delivery_zone',
        'desired_delivery_date',
        'notes',
    ];

    protected $casts = [
        'initial_quantity'      => 'float',
        'initial_price'         => 'float',
        'current_quantity'      => 'float',
        'current_price'         => 'float',
        'desired_delivery_date' => 'date',
    ];

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function farmer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function harvest(): BelongsTo
    {
        return $this->belongsTo(Harvest::class);
    }

    public function quantityStandard(): BelongsTo
    {
        return $this->belongsTo(ProductQuantity::class, 'quantity_standard_id');
    }

    public function negotiations(): HasMany
    {
        return $this->hasMany(InquiryNegotiation::class)->latest();
    }

    public function isParticipant(User $user): bool
    {
        return $user->id === $this->buyer_id || $user->id === $this->farmer_id || $user->isAdmin();
    }

    public function canNegotiate(): bool
    {
        return in_array($this->status, [InquiryStatus::Pending, InquiryStatus::Negotiating, InquiryStatus::Accepted]);
    }
}
