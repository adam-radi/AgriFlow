<?php

namespace App\Policies;

use App\Models\User;
use App\Models\VerificationRequest;

class VerificationRequestPolicy
{
    /**
     * Un utilisateur consulte uniquement sa propre demande.
     */
    public function view(
        User $user,
        VerificationRequest $verificationRequest
    ): bool {
        return $verificationRequest->user_id === $user->getKey();
    }

    /**
     * Un administrateur peut consulter toutes les demandes.
     */
    public function viewAny(User $user): bool
    {
        return $user->roles()
            ->where('name', 'admin')
            ->exists();
    }

    /**
     * Seul le propriétaire peut consulter ses documents via
     * les fonctionnalités destinées à son propre compte.
     */
    public function viewDocuments(
        User $user,
        VerificationRequest $verificationRequest
    ): bool {
        return $verificationRequest->user_id === $user->getKey();
    }
}
