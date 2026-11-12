<?php

namespace App\Models;

use App\Enums\VerificationStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VerificationRequest extends Model
{
    protected $fillable = [
        'user_id',
        'active_user_id',
        'status',
        'account_type',
        'admin_notes',
        'rejection_reason',
        'requested_information',
        'submitted_at',
        'reviewed_at',
        'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => VerificationStatus::class,
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'approved_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(VerificationDocument::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(VerificationReview::class);
    }

    public function isActive(): bool
    {
        return $this->status?->isActive() ?? false;
    }

    public function isApproved(): bool
    {
        return $this->status === VerificationStatus::APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === VerificationStatus::REJECTED;
    }
}
