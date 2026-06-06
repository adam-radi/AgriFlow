<?php

namespace App\Policies;

use App\Models\Harvest;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class HarvestPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Harvest $harvest): bool
    {
        if ($harvest->product->user_id === auth()->id()) {
            return true;
        } else {
            return false;
            }
        
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
       if ($harvest->product->user_id === auth()->id()) {
            return true;
        } else {
            return false;
            }
        }
        
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Harvest $harvest): bool
    {
        if ($harvest->product->user_id === auth()->id()) {
            return true;
        } else {
            return false;
            }
        
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Harvest $harvest): bool
    {
        if ($harvest->product->user_id === auth()->id()) {
            return true;
        } else {
            return false;
            }
        
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Harvest $harvest): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Harvest $harvest): bool
    {
        return false;
    }
}
