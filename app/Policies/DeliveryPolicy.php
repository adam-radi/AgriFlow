<?php

namespace App\Policies;

use App\Models\DeliveryGroup;
use App\Models\User;

class DeliveryPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['Admin', 'Livreur']);
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, DeliveryGroup $deliveryGroup): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isLivreur() && $deliveryGroup->delivery_user_id === $user->id;
    }

    public function assign(User $user): bool
    {
        return $user->isAdmin();
    }

    public function updateStatus(User $user, DeliveryGroup $deliveryGroup): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isLivreur() && $deliveryGroup->delivery_user_id === $user->id;
    }
}
