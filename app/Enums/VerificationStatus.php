<?php

namespace App\Enums;

enum VerificationStatus: string
{
    case NOT_SUBMITTED = 'not_submitted';

    case PENDING = 'pending';

    case UNDER_REVIEW = 'under_review';

    case APPROVED = 'approved';

    case REJECTED = 'rejected';

    case ADDITIONAL_INFORMATION_REQUIRED =
        'additional_information_required';

    /**
     * Determine whether a request is still active.
     */
    public function isActive(): bool
    {
        return in_array($this, [
            self::PENDING,
            self::UNDER_REVIEW,
            self::ADDITIONAL_INFORMATION_REQUIRED,
        ], true);
    }

    /**
     * Determine whether a request is finalized.
     */
    public function isFinal(): bool
    {
        return in_array($this, [
            self::APPROVED,
            self::REJECTED,
        ], true);
    }

    /**
     * Determine whether the user can submit a new request.
     */
    public function allowsNewRequest(): bool
    {
        return $this->isFinal();
    }

    /**
     * Return the available status values.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
?>