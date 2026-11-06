<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            UserSeeder::class,
            ProductSeeder::class,
            HarvestSeeder::class,
            OrderSeeder::class,
            PaymentSeeder::class,
            DeliveryGroupSeeder::class,
            RoleSeeder::class,    
        ]);
    }
}
