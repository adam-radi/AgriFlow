<?php

namespace Database\Seeders;

use App\Models\Harvest;
use App\Models\Product;
use App\Enums\HarvestStatus;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class HarvestSeeder extends Seeder
{
    public function run(): void
    {
        $farmer1 = User::where('email', 'farmer1@agriflow.com')->first();
        $farmer2 = User::where('email', 'farmer2@agriflow.com')->first();
        $farmer4 = User::where('email', 'farmer4@agriflow.com')->first();

        $argan     = Product::where('user_id', $farmer1->id)->where('name', 'Argan Oil Premium')->first();
        $saffron   = Product::where('user_id', $farmer1->id)->where('name', 'Saffron Threads')->first();
        $honey     = Product::where('user_id', $farmer1->id)->where('name', 'Organic Honey')->first();
        $olive     = Product::where('user_id', $farmer1->id)->where('name', 'Extra Virgin Olive Oil')->first();
        $cactus    = Product::where('user_id', $farmer1->id)->where('name', 'Fresh Cactus Fruit')->first();
        $spoiled   = Product::where('user_id', $farmer1->id)->where('name', 'Spoiled Argan Oil Batch')->first();

        $dates     = Product::where('user_id', $farmer2->id)->where('name', 'Majhoul Dates Premium')->first();
        $almonds   = Product::where('user_id', $farmer2->id)->where('name', 'Raw Almonds')->first();
        $mint      = Product::where('user_id', $farmer2->id)->where('name', 'Fresh Mint')->first();

        $couscous  = Product::where('user_id', $farmer4->id)->where('name', 'Artisan Couscous')->first();
        $chickpeas = Product::where('user_id', $farmer4->id)->where('name', 'Organic Chickpeas')->first();

        $now = Carbon::now();

        // Farmer 1 harvests
        Harvest::create([
            'product_id'          => $argan->id,
            'start_date'          => $now->copy()->subDays(15),
            'end_date'            => $now->copy()->addMonths(2),
            'estimated_total_qte' => 500,
            'max_daily_qte'       => 50,
            'status'              => HarvestStatus::Open,
            'reserved_quantity'   => 80,
        ]);

        Harvest::create([
            'product_id'          => $saffron->id,
            'start_date'          => $now->copy()->subDays(30),
            'end_date'            => $now->copy()->addMonths(1),
            'estimated_total_qte' => 200,
            'max_daily_qte'       => 20,
            'status'              => HarvestStatus::Open,
            'reserved_quantity'   => 30,
        ]);

        Harvest::create([
            'product_id'          => $honey->id,
            'start_date'          => $now->copy()->subDays(7),
            'end_date'            => $now->copy()->addMonths(3),
            'estimated_total_qte' => 800,
            'max_daily_qte'       => 80,
            'status'              => HarvestStatus::Open,
            'reserved_quantity'   => 0,
        ]);

        Harvest::create([
            'product_id'          => $olive->id,
            'start_date'          => $now->copy()->subDays(60),
            'end_date'            => $now->copy()->subDays(1),
            'estimated_total_qte' => 300,
            'max_daily_qte'       => 40,
            'status'              => HarvestStatus::Close,
            'reserved_quantity'   => 300,
        ]);

        Harvest::create([
            'product_id'          => $cactus->id,
            'start_date'          => $now->copy()->subDays(10),
            'end_date'            => $now->copy()->addMonth(),
            'estimated_total_qte' => 1000,
            'max_daily_qte'       => 100,
            'status'              => HarvestStatus::Open,
            'reserved_quantity'   => 50,
        ]);

        // Farmer 2 harvests
        Harvest::create([
            'product_id'          => $dates->id,
            'start_date'          => $now->copy()->subDays(20),
            'end_date'            => $now->copy()->addMonths(2),
            'estimated_total_qte' => 600,
            'max_daily_qte'       => 60,
            'status'              => HarvestStatus::Open,
            'reserved_quantity'   => 100,
        ]);

        Harvest::create([
            'product_id'          => $almonds->id,
            'start_date'          => $now->copy()->addDays(10),
            'end_date'            => $now->copy()->addMonths(3),
            'estimated_total_qte' => 400,
            'max_daily_qte'       => 40,
            'status'              => HarvestStatus::Open,
            'reserved_quantity'   => 0,
        ]);

        Harvest::create([
            'product_id'          => $mint->id,
            'start_date'          => $now->copy()->subDays(5),
            'end_date'            => $now->copy()->addMonths(1),
            'estimated_total_qte' => 300,
            'max_daily_qte'       => 60,
            'status'              => HarvestStatus::Open,
            'reserved_quantity'   => 20,
        ]);

        // Farmer 4 harvests
        Harvest::create([
            'product_id'          => $couscous->id,
            'start_date'          => $now->copy()->subDays(3),
            'end_date'            => $now->copy()->addMonths(4),
            'estimated_total_qte' => 2000,
            'max_daily_qte'       => 150,
            'status'              => HarvestStatus::Open,
            'reserved_quantity'   => 200,
        ]);

        Harvest::create([
            'product_id'          => $chickpeas->id,
            'start_date'          => $now->copy()->addDays(15),
            'end_date'            => $now->copy()->addMonths(2),
            'estimated_total_qte' => 800,
            'max_daily_qte'       => 80,
            'status'              => HarvestStatus::Open,
            'reserved_quantity'   => 0,
        ]);

        // Harvest for disabled product
        if ($spoiled) {
            Harvest::create([
                'product_id'          => $spoiled->id,
                'start_date'          => $now->copy()->subDays(30),
                'end_date'            => $now->copy()->subDays(1),
                'estimated_total_qte' => 200,
                'max_daily_qte'       => 0,
                'status'              => HarvestStatus::Close,
                'reserved_quantity'   => 0,
            ]);
        }

        $this->command->info('11 seed harvests created');
    }
}
