<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Auth\AuthController;

Route::prefix('auth')->post('/register', [ AuthController::class, 'register'])->name('register');
Route::prefix('auth')->post('/Login',[AuthController::class , 'Login'])->name('Login');

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/me',[AuthController::class,'me'])->name('me');
    Route::get('/logout',[AuthController::class,'logout'])->name('logout');
});
?>