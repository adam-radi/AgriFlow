<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Auth\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Api\HarvestController;

Route::prefix('auth')->post('/register', [ AuthController::class, 'register'])->name('register');
Route::prefix('auth')->post('/Login',[AuthController::class , 'Login'])->name('Login');

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/me',[AuthController::class,'me'])->name('me');
    Route::get('/logout',[AuthController::class,'logout'])->name('logout');
});
Route::middleware('auth:sanctum')->group(function(){
    Route::resource('products',ProductController::class);
    Route::post('products',[ProductController::class,'manageQuantity'])->name('products.manageQuantities');

});
Route::middleware('auth:sanctum')->group(function( ){
    Route::get('/harvest',[HarvestController::class,'index']);
    Route::post('/harvest',[HarvestController::class,'store']);
    Route::get('/harvest/{id}',[HarvestController::class,'show']);
    Route::put('/harvest/{id}',[HarvestController::class,'update']);
    Route::delete('/harvest/{id}',[HarvestController::class,'destroy']);
    Route::post('/harvest/{id}/{status}',[HarvestController::class,'updateHarvestStatus']);
})
?>