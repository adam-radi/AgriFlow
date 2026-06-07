<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $fillable = ['name', 'email', 'password', 'role', 'farmer_status', 'phone', 'zone'];

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
}
