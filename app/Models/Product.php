<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;
    
    protected $fillable = ['user_id','name','description','base_price'];

    public function productQuantities(){
        return $this->hasMany(ProductQuantity::class);
    }
    public function user(){
        return $this->belongsTo(User::class);
    }
}
