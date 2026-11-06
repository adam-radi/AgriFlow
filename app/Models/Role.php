<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
     protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    public const FARMER = 'farmer';

    public const PROFESSIONAL_BUYER = 'professional_buyer';

    public const ADMIN = 'admin';

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'user_roles'
        )->withTimestamps();
    }
}
