<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role', 'farmer_status', 'phone', 'zone'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'customer_id');
    }

    public function deliveryGroups()
    {
        return $this->hasMany(DeliveryGroup::class, 'delivery_user_id');
    }
    public function isAdmin()
    {
        return $this->role === 'Admin';
    }
    public function isClient()
    {
        return $this->role === 'Client';
    }
    public function isFarmer()
    {
        return $this->role === 'Farmer';
    }
    public function isLivreur()
    {
        return $this->role === 'Livreur';
    }

    public function roles(): BelongsToMany
{
    return $this->belongsToMany(
        Role::class,
        'user_roles'
    )->withTimestamps();
}

public function farmerProfile(): HasOne
{
    return $this->hasOne(FarmerProfile::class);
}

public function professionalBuyerProfile(): HasOne
{
    return $this->hasOne(ProfessionalBuyerProfile::class);
}

public function hasRole(string $role): bool
{
    return $this->roles()
        ->where('slug', $role)
        ->exists();
}

public function hasAnyRole(array $roles): bool
{
    return $this->roles()
        ->whereIn('slug', $roles)
        ->exists();
}
}
