<?php

namespace App\Policies;

use App\Enums\InquiryStatus;
use App\Models\PurchaseInquiry;
use App\Models\User;

class PurchaseInquiryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isClient() || $user->isFarmer() || $user->isAdmin();
    }

    public function view(User $user, PurchaseInquiry $inquiry): bool
    {
        return $inquiry->isParticipant($user);
    }

    public function create(User $user): bool
    {
        return $user->isClient() || $user->isAdmin();
    }

    public function negotiate(User $user, PurchaseInquiry $inquiry): bool
    {
        return $inquiry->isParticipant($user) && $inquiry->canNegotiate();
    }

    public function accept(User $user, PurchaseInquiry $inquiry): bool
    {
        return $inquiry->isParticipant($user) && $inquiry->canNegotiate();
    }

    public function confirm(User $user, PurchaseInquiry $inquiry): bool
    {
        return $inquiry->isParticipant($user) && in_array($inquiry->status, [
            InquiryStatus::Pending,
            InquiryStatus::Negotiating,
            InquiryStatus::Accepted,
        ]);
    }

    public function reject(User $user, PurchaseInquiry $inquiry): bool
    {
        return $inquiry->isParticipant($user) && !in_array($inquiry->status, [
            InquiryStatus::Confirmed,
            InquiryStatus::Delivered,
        ]);
    }

    public function cancel(User $user, PurchaseInquiry $inquiry): bool
    {
        return ($user->id === $inquiry->buyer_id || $user->isAdmin()) && !in_array($inquiry->status, [
            InquiryStatus::Confirmed,
            InquiryStatus::Delivered,
        ]);
    }

    public function updateDelivery(User $user, PurchaseInquiry $inquiry): bool
    {
        return ($user->id === $inquiry->farmer_id || $user->isAdmin()) && in_array($inquiry->status, [
            InquiryStatus::Confirmed,
            InquiryStatus::InDelivery,
        ]);
    }
}
