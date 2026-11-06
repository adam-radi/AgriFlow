<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();
        try {
            User::updateOrCreate(
                ['email' => 'admin1@gmail.com'],
                [
                    'name' => 'admin',
                    'email' => 'admin1@gmail.com',
                    'password' => Hash::make('admin1234'),
                    'role' => 'Admin',
                    'email_verified_at' => Carbon::now(),
                ]
            );

            DB::commit();

            $this->command->info('Admin user created/updated: admin1@gmail.com / admin1234');
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
