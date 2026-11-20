<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VerificationDocument extends Model
{
    protected $fillable = [
        'verification_request_id',
        'uploaded_by',
        'document_type',
        'original_name',
        'disk',
        'file_path',
        'mime_type',
        'file_size',
        'checksum',
    ];

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
        ];
    }

    public function verificationRequest(): BelongsTo
    {
        return $this->belongsTo(
            VerificationRequest::class
        );
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'uploaded_by'
        );
    }
}
