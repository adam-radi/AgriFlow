<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\HarvestController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\DeliveryController;
use App\Http\Controllers\Api\FarmerDashboardController;
use App\Http\Controllers\Api\CustomerDashboardController;
use App\Http\Controllers\Api\AdminController;

/*
|--------------------------------------------------------------------------
| Routes publiques — Authentification
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {

    Route::post('/register', [
        AuthController::class,
        'register',
    ])->middleware('throttle:5,1');

    Route::post('/login', [
        AuthController::class,
        'login',
    ])->middleware('throttle:5,1');

});

/*
|--------------------------------------------------------------------------
| Routes publiques — Catalogue produits (sans authentification)
|--------------------------------------------------------------------------
|
| Les futures routes GET du catalogue produits seront déclarées ici.
|
*/

Route::get('/public/products', [PublicController::class, 'products']);
Route::get('/public/products/{id}', [PublicController::class, 'productDetails']);

/*
|--------------------------------------------------------------------------
| Routes nécessitant une authentification (Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
     * Authentification
     */

    Route::post('/auth/logout', [
        AuthController::class,
        'logout',
    ]);

    Route::get('/auth/me', [
        AuthController::class,
        'me',
    ]);

    /*
     * Informations personnelles (compte)
     */

    Route::prefix('account')->group(function () {

        Route::get('/', [
            AccountController::class,
            'show',
        ]);

        Route::put('/', [
            AccountController::class,
            'update',
        ]);

        Route::patch('/password', [
            AccountController::class,
            'updatePassword',
        ]);

    });

    /*
     * Consultation des profils
     */

    Route::get('/profile', [
        ProfileController::class,
        'show',
    ]);

    /*
     * Espace agriculteur
     */

    Route::middleware('role:farmer')->group(function () {

        Route::put('/profile/farmer', [
            ProfileController::class,
            'updateFarmer',
        ]);

        /*
         * Les futures routes de gestion agricole
         * seront ajoutées dans ce groupe.
         */

    });

    /*
     * Espace acheteur professionnel
     */

    Route::middleware('role:professional_buyer')->group(function () {

        Route::put('/profile/buyer', [
            ProfileController::class,
            'updateBuyer',
        ]);

        /*
         * Les futures routes de gestion acheteur
         * seront ajoutées dans ce groupe.
         */

    });

    /*
     * Produits
     */

    Route::resource('products', ProductController::class);
    Route::post('products/{product}/quantities', [ProductController::class, 'manageQuantity']);

    /*
     * Récoltes
     */

    Route::get('/harvest', [HarvestController::class, 'index']);
    Route::post('/harvest', [HarvestController::class, 'store']);
    Route::get('/harvest/{id}', [HarvestController::class, 'show']);
    Route::put('/harvest/{id}', [HarvestController::class, 'update']);
    Route::delete('/harvest/{id}', [HarvestController::class, 'destroy']);
    Route::post('/harvest/{id}/{status}', [HarvestController::class, 'updateHarvestStatus']);
    Route::get('/farmers/harvests', [HarvestController::class, 'farmerHarvests']);

    /*
     * Commandes
     */

    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);
    Route::post('/orders/{order}/status/{status}', [OrderController::class, 'updateStatus']);

    /*
     * Panier
     */

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{item}', [CartController::class, 'update']);
    Route::delete('/cart/{item}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);

    /*
     * Paiements
     */

    Route::get('/payments', [PaymentController::class, 'myPayments']);
    Route::post('/orders/{order}/pay', [PaymentController::class, 'initiate']);
    Route::post('/payments/{payment}/confirm', [PaymentController::class, 'confirm']);
    Route::post('/payments/{payment}/refund', [PaymentController::class, 'refund']);

    /*
     * Livraisons
     */

    Route::get('/deliveries', [DeliveryController::class, 'index']);
    Route::post('/deliveries', [DeliveryController::class, 'store']);
    Route::get('/deliveries/{deliveryGroup}', [DeliveryController::class, 'show']);
    Route::post('/deliveries/{deliveryGroup}/assign/{userId}', [DeliveryController::class, 'assign']);
    Route::post('/deliveries/{deliveryGroup}/status/{status}', [DeliveryController::class, 'updateStatus']);

    /*
     * Tableau de bord client
     */

    Route::get('/customer/products', [CustomerDashboardController::class, 'browse']);
    Route::get('/customer/orders', [CustomerDashboardController::class, 'orderHistory']);
    Route::get('/customer/orders/{order}/track', [CustomerDashboardController::class, 'trackOrder']);
    Route::get('/customer/payments', [CustomerDashboardController::class, 'paymentHistory']);

    /*
     * Tableau de bord agriculteur
     */

    Route::get('/farmer/stats', [FarmerDashboardController::class, 'stats']);
    Route::get('/farmer/orders', [FarmerDashboardController::class, 'receivedOrders']);
    Route::get('/farmer/analytics/products', [FarmerDashboardController::class, 'popularProducts']);

    /*
     * Panneau Admin
     */

    Route::prefix('admin')->group(function () {

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
        Route::post('/products/{product}/disable', [AdminController::class, 'disableProduct']);
        Route::post('/products/{product}/enable', [AdminController::class, 'enableProduct']);
        Route::put('/products/{product}', [AdminController::class, 'updateProduct']);
        Route::delete('/products/{product}', [AdminController::class, 'deleteProduct']);

    });

});
