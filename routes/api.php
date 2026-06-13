<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Auth\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Api\HarvestController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\DeliveryController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\FarmerDashboardController;
use App\Http\Controllers\Api\CustomerDashboardController;
use App\Http\Controllers\Api\AdminController;

// Auth
Route::prefix('auth')->post('/register', [AuthController::class, 'register'])->name('register');
Route::prefix('auth')->post('/Login', [AuthController::class, 'Login'])->name('Login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me'])->name('me');
    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
});

// Products
Route::middleware('auth:sanctum')->group(function () {
    Route::resource('products', ProductController::class);
    Route::post('products/{product}/quantities', [ProductController::class, 'manageQuantity'])->name('products.manageQuantities');
});

// Harvests
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/harvest', [HarvestController::class, 'index']);
    Route::post('/harvest', [HarvestController::class, 'store']);
    Route::get('/harvest/{id}', [HarvestController::class, 'show']);
    Route::put('/harvest/{id}', [HarvestController::class, 'update']);
    Route::delete('/harvest/{id}', [HarvestController::class, 'destroy']);
    Route::post('/harvest/{id}/{status}', [HarvestController::class, 'updateHarvestStatus']);
});

// Orders
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);
    Route::post('/orders/{order}/status/{status}', [OrderController::class, 'updateStatus']);
});

// Payments
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/payments', [PaymentController::class, 'myPayments']);
    Route::post('/orders/{order}/pay', [PaymentController::class, 'initiate']);
    Route::post('/payments/{payment}/confirm', [PaymentController::class, 'confirm']);
    Route::post('/payments/{payment}/refund', [PaymentController::class, 'refund']);
});

// Delivery
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/deliveries', [DeliveryController::class, 'index']);
    Route::get('/deliveries/{deliveryGroup}', [DeliveryController::class, 'show']);
    Route::post('/deliveries/{deliveryGroup}/assign/{userId}', [DeliveryController::class, 'assign']);
    Route::post('/deliveries/{deliveryGroup}/status/{status}', [DeliveryController::class, 'updateStatus']);
});

// Customer Dashboard
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/customer/products', [CustomerDashboardController::class, 'browse']);
    Route::get('/customer/orders', [CustomerDashboardController::class, 'orderHistory']);
    Route::get('/customer/orders/{order}/track', [CustomerDashboardController::class, 'trackOrder']);
    Route::get('/customer/payments', [CustomerDashboardController::class, 'paymentHistory']);
});

// Farmer Dashboard
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/farmer/stats', [FarmerDashboardController::class, 'stats']);
    Route::get('/farmer/orders', [FarmerDashboardController::class, 'receivedOrders']);
    Route::get('/farmer/analytics/products', [FarmerDashboardController::class, 'popularProducts']);
});

// Admin Panel
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/stats', [AdminController::class, 'stats']);
    Route::get('/users', [AdminController::class, 'listUsers']);
    Route::post('/users/delivery', [AdminController::class, 'createDeliveryUser']);
    Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);
    Route::post('/farmers/{user}/approve', [AdminController::class, 'approveFarmer']);
    Route::post('/farmers/{user}/reject', [AdminController::class, 'rejectFarmer']);
    Route::get('/orders', [AdminController::class, 'listOrders']);
    Route::get('/products', [AdminController::class, 'listProducts']);
    Route::get('/harvests', [AdminController::class, 'listHarvests']);
    Route::get('/deliveries', [AdminController::class, 'listDeliveries']);
});
