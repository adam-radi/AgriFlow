<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'farmer1@agriflow.com'],
            [
                'name'          => 'Ahmed Benali',
                'email'         => 'farmer1@agriflow.com',
                'password'      => Hash::make('password'),
                'role'          => 'Farmer',
                'farmer_status' => 'approved',
                'phone'         => '+212600111111',
                'zone'          => 'Agadir',
            ]
        );

        User::updateOrCreate(
            ['email' => 'farmer2@agriflow.com'],
            [
                'name'          => 'Fatima Zahra',
                'email'         => 'farmer2@agriflow.com',
                'password'      => Hash::make('password'),
                'role'          => 'Farmer',
                'farmer_status' => 'approved',
                'phone'         => '+212600222222',
                'zone'          => 'Marrakech',
            ]
        );

        User::updateOrCreate(
            ['email' => 'farmer3@agriflow.com'],
            [
                'name'          => 'Hassan Ouazzani',
                'email'         => 'farmer3@agriflow.com',
                'password'      => Hash::make('password'),
                'role'          => 'Farmer',
                'farmer_status' => 'pending',
                'phone'         => '+212600333333',
                'zone'          => 'Meknes',
            ]
        );

        User::updateOrCreate(
            ['email' => 'farmer4@agriflow.com'],
            [
                'name'          => 'Amina Bennis',
                'email'         => 'farmer4@agriflow.com',
                'password'      => Hash::make('password'),
                'role'          => 'Farmer',
                'farmer_status' => 'approved',
                'phone'         => '+212600444444',
                'zone'          => 'Fes',
            ]
        );

        User::updateOrCreate(
            ['email' => 'client1@agriflow.com'],
            [
                'name'     => 'Youssef El Idrissi',
                'email'    => 'client1@agriflow.com',
                'password' => Hash::make('password'),
                'role'     => 'Client',
                'phone'    => '+212600555555',
                'zone'     => 'Agadir',
            ]
        );

        User::updateOrCreate(
            ['email' => 'client2@agriflow.com'],
            [
                'name'     => 'Sofia Ouali',
                'email'    => 'client2@agriflow.com',
                'password' => Hash::make('password'),
                'role'     => 'Client',
                'phone'    => '+212600666666',
                'zone'     => 'Casablanca',
            ]
        );

        User::updateOrCreate(
            ['email' => 'client3@agriflow.com'],
            [
                'name'     => 'Mohamed El Fassi',
                'email'    => 'client3@agriflow.com',
                'password' => Hash::make('password'),
                'role'     => 'Client',
                'phone'    => '+212600777777',
                'zone'     => 'Marrakech',
            ]
        );

        User::updateOrCreate(
            ['email' => 'client4@agriflow.com'],
            [
                'name'     => 'Laila Bennani',
                'email'    => 'client4@agriflow.com',
                'password' => Hash::make('password'),
                'role'     => 'Client',
                'phone'    => '+212600888888',
                'zone'     => 'Rabat',
            ]
        );

        User::updateOrCreate(
            ['email' => 'livreur1@agriflow.com'],
            [
                'name'     => 'Karim Tazi',
                'email'    => 'livreur1@agriflow.com',
                'password' => Hash::make('password'),
                'role'     => 'Livreur',
                'phone'    => '+212600999999',
                'zone'     => 'Agadir',
            ]
        );

        User::updateOrCreate(
            ['email' => 'livreur2@agriflow.com'],
            [
                'name'     => 'Driss Alaoui',
                'email'    => 'livreur2@agriflow.com',
                'password' => Hash::make('password'),
                'role'     => 'Livreur',
                'phone'    => '+212600101010',
                'zone'     => 'Marrakech',
            ]
        );

        $this->command->info('10 seed users created/updated');
    }
}
