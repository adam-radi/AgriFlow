<?php

namespace App\Providers;

use App\Models\DeliveryGroup;
use App\Models\Harvest;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Policies\DeliveryPolicy;
use App\Policies\HarvestPolicy;
use App\Policies\OrderPolicy;
use App\Policies\PaymentPolicy;
use App\Policies\ProductPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::policy(Product::class, ProductPolicy::class);
        Gate::policy(Harvest::class, HarvestPolicy::class);
        Gate::policy(Order::class, OrderPolicy::class);
        Gate::policy(Payment::class, PaymentPolicy::class);
        Gate::policy(DeliveryGroup::class, DeliveryPolicy::class);
    }
}

