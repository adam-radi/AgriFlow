<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;


class User extends Authenticatable
{
  
    protected $fillable=['name','email','password','role'];
    
    public function isAdmin()
    {
        return $this->role='Admin';
    }
    public function isClient()
    {
        return $this->role='Client';
    }
    public function isFarmer(){
        return $this->role='Farmer';
    }
    public function isLivreur(){
        return $this->role='Livreur';
    }

}
