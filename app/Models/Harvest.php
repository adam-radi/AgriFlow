<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Harvest extends Model{

    protected $fillable = ['product_id','start_date','end_date','estimated_total_qte','max_daily_qte','status'];

    public function Product(){
        return $this->belongsTo(Product::class);
    }
}
