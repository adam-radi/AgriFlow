<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VerificationReview extends Model
{
    protected $fillable = [
        'verification_request_id',
        'reviewer_id',
        'previous_status',
        'new_status',
        'comment',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
        ];
    }

    public function verificationRequest(): BelongsTo
    {
        return $this->belongsTo(
            VerificationRequest::class
        );
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'reviewer_id'
        );
    }
}
