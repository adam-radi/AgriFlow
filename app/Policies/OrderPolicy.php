<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['Client', 'Admin']);
    }

    public function view(User $user, Order $order): bool
    {
        return $order->customer_id === $user->id || $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isClient();
    }

    public function cancel(User $user, Order $order): bool
    {
        return $order->customer_id === $user->id || $user->isAdmin();
    }

    public function updateStatus(User $user, Order $order): bool
    {
        return $user->isAdmin();
    }
}
