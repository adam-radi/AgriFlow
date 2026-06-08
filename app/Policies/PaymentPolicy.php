<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isClient() || $user->isAdmin();
    }

    public function view(User $user, Payment $payment): bool
    {
        return $payment->order->customer_id === $user->id || $user->isAdmin();
    }

    public function confirm(User $user): bool
    {
        return $user->isAdmin();
    }

    public function refund(User $user): bool
    {
        return $user->isAdmin();
    }
}
