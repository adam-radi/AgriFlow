<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Harvest;
use App\Models\User;
use App\Enums\OrderStatus;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $client1 = User::where('email', 'client1@agriflow.com')->first();
        $client2 = User::where('email', 'client2@agriflow.com')->first();
        $client3 = User::where('email', 'client3@agriflow.com')->first();
        $client4 = User::where('email', 'client4@agriflow.com')->first();

        $arganHarvest   = Harvest::whereHas('product', fn($q) => $q->where('name', 'Argan Oil Premium'))->first();
        $saffronHarvest = Harvest::whereHas('product', fn($q) => $q->where('name', 'Saffron Threads'))->first();
        $honeyHarvest   = Harvest::whereHas('product', fn($q) => $q->where('name', 'Organic Honey'))->first();
        $datesHarvest   = Harvest::whereHas('product', fn($q) => $q->where('name', 'Majhoul Dates Premium'))->first();
        $almondsHarvest = Harvest::whereHas('product', fn($q) => $q->where('name', 'Raw Almonds'))->first();
        $couscousHarvest= Harvest::whereHas('product', fn($q) => $q->where('name', 'Artisan Couscous'))->first();
        $cactusHarvest  = Harvest::whereHas('product', fn($q) => $q->where('name', 'Fresh Cactus Fruit'))->first();
        $mintHarvest    = Harvest::whereHas('product', fn($q) => $q->where('name', 'Fresh Mint'))->first();

        $arganQty    = $arganHarvest->product->productQuantities()->where('label', '500ml')->first();
        $saffronQty  = $saffronHarvest->product->productQuantities()->where('label', '5g')->first();
        $honeyQty    = $honeyHarvest->product->productQuantities()->where('label', '250g')->first();
        $datesQty    = $datesHarvest->product->productQuantities()->where('label', '1kg')->first();
        $almondsQty  = $almondsHarvest->product->productQuantities()->where('label', '500g')->first();
        $couscousQty = $couscousHarvest->product->productQuantities()->where('label', '1kg')->first();
        $cactusQty   = $cactusHarvest->product->productQuantities()->where('label', '1kg')->first();
        $mintQty     = $mintHarvest->product->productQuantities()->where('label', '250g')->first();

        $now = Carbon::now();

        // Order 1 — Client 1, pending, Agadir (Argan Oil + Honey)
        $order1 = Order::create([
            'customer_id'   => $client1->id,
            'status'        => OrderStatus::Pending,
            'total_amount'  => 240.00,
            'zone'          => 'Agadir',
            'delivery_date' => $now->copy()->addDays(3)->toDateString(),
        ]);
        OrderItem::create([
            'order_id'               => $order1->id,
            'product_id'             => $arganHarvest->product_id,
            'harvest_id'             => $arganHarvest->id,
            'quantity_standard_id'   => $arganQty->id,
            'quantity'               => 2,
            'unit_price'             => 110.00,
            'subtotal'               => 220.00,
            'scheduled_harvest_date' => $now->copy()->addDays(2)->toDateString(),
        ]);
        OrderItem::create([
            'order_id'               => $order1->id,
            'product_id'             => $honeyHarvest->product_id,
            'harvest_id'             => $honeyHarvest->id,
            'quantity_standard_id'   => $honeyQty->id,
            'quantity'               => 1,
            'unit_price'             => 20.00,
            'subtotal'               => 20.00,
            'scheduled_harvest_date' => $now->copy()->addDays(2)->toDateString(),
        ]);

        // Order 2 — Client 1, confirmed, Agadir (Saffron)
        $order2 = Order::create([
            'customer_id'   => $client1->id,
            'status'        => OrderStatus::Confirmed,
            'total_amount'  => 170.00,
            'zone'          => 'Agadir',
            'delivery_date' => $now->copy()->addDays(5)->toDateString(),
        ]);
        OrderItem::create([
            'order_id'               => $order2->id,
            'product_id'             => $saffronHarvest->product_id,
            'harvest_id'             => $saffronHarvest->id,
            'quantity_standard_id'   => $saffronQty->id,
            'quantity'               => 2,
            'unit_price'             => 85.00,
            'subtotal'               => 170.00,
            'scheduled_harvest_date' => $now->copy()->addDays(4)->toDateString(),
        ]);

        // Order 3 — Client 2, pending, Casablanca (Dates)
        $order3 = Order::create([
            'customer_id'   => $client2->id,
            'status'        => OrderStatus::Pending,
            'total_amount'  => 180.00,
            'zone'          => 'Casablanca',
            'delivery_date' => $now->copy()->addDays(7)->toDateString(),
        ]);
        OrderItem::create([
            'order_id'               => $order3->id,
            'product_id'             => $datesHarvest->product_id,
            'harvest_id'             => $datesHarvest->id,
            'quantity_standard_id'   => $datesQty->id,
            'quantity'               => 2,
            'unit_price'             => 90.00,
            'subtotal'               => 180.00,
            'scheduled_harvest_date' => $now->copy()->addDays(6)->toDateString(),
        ]);

        // Order 4 — Client 2, cancelled, Casablanca (Almonds)
        $order4 = Order::create([
            'customer_id'   => $client2->id,
            'status'        => OrderStatus::Cancelled,
            'total_amount'  => 110.00,
            'zone'          => 'Casablanca',
            'delivery_date' => $now->copy()->subDays(2)->toDateString(),
        ]);
        OrderItem::create([
            'order_id'               => $order4->id,
            'product_id'             => $almondsHarvest->product_id,
            'harvest_id'             => $almondsHarvest->id,
            'quantity_standard_id'   => $almondsQty->id,
            'quantity'               => 2,
            'unit_price'             => 55.00,
            'subtotal'               => 110.00,
            'scheduled_harvest_date' => $now->copy()->subDays(3)->toDateString(),
        ]);

        // Order 5 — Client 3, delivered, Marrakech (Dates + Mint)
        $order5 = Order::create([
            'customer_id'   => $client3->id,
            'status'        => OrderStatus::Delivered,
            'total_amount'  => 100.00,
            'zone'          => 'Marrakech',
            'delivery_date' => $now->copy()->subDays(4)->toDateString(),
        ]);
        OrderItem::create([
            'order_id'               => $order5->id,
            'product_id'             => $datesHarvest->product_id,
            'harvest_id'             => $datesHarvest->id,
            'quantity_standard_id'   => $datesQty->id,
            'quantity'               => 1,
            'unit_price'             => 90.00,
            'subtotal'               => 90.00,
            'scheduled_harvest_date' => $now->copy()->subDays(5)->toDateString(),
        ]);
        OrderItem::create([
            'order_id'               => $order5->id,
            'product_id'             => $mintHarvest->product_id,
            'harvest_id'             => $mintHarvest->id,
            'quantity_standard_id'   => $mintQty->id,
            'quantity'               => 1,
            'unit_price'             => 10.00,
            'subtotal'               => 10.00,
            'scheduled_harvest_date' => $now->copy()->subDays(5)->toDateString(),
        ]);

        // Order 6 — Client 4, confirmed, Rabat (Couscous + Cactus)
        $order6 = Order::create([
            'customer_id'   => $client4->id,
            'status'        => OrderStatus::Confirmed,
            'total_amount'  => 57.00,
            'zone'          => 'Rabat',
            'delivery_date' => $now->copy()->addDays(6)->toDateString(),
        ]);
        OrderItem::create([
            'order_id'               => $order6->id,
            'product_id'             => $couscousHarvest->product_id,
            'harvest_id'             => $couscousHarvest->id,
            'quantity_standard_id'   => $couscousQty->id,
            'quantity'               => 1,
            'unit_price'             => 32.00,
            'subtotal'               => 32.00,
            'scheduled_harvest_date' => $now->copy()->addDays(5)->toDateString(),
        ]);
        OrderItem::create([
            'order_id'               => $order6->id,
            'product_id'             => $cactusHarvest->product_id,
            'harvest_id'             => $cactusHarvest->id,
            'quantity_standard_id'   => $cactusQty->id,
            'quantity'               => 1,
            'unit_price'             => 25.00,
            'subtotal'               => 25.00,
            'scheduled_harvest_date' => $now->copy()->addDays(5)->toDateString(),
        ]);

        $this->command->info('6 seed orders with items created');
    }
}
