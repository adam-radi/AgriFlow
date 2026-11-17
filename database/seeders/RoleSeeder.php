<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Agriculteur',
                'slug' => Role::FARMER,
                'description' => 'Utilisateur exerçant une activité agricole.',
            ],
            [
                'name' => 'Acheteur professionnel',
                'slug' => Role::PROFESSIONAL_BUYER,
                'description' => 'Professionnel pouvant acheter directement auprès des agriculteurs.',
            ],
            [
                'name' => 'Administrateur',
                'slug' => Role::ADMIN,
                'description' => 'Utilisateur chargé de l’administration de la plateforme.',
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['slug' => $role['slug']],
                [
                    'name' => $role['name'],
                    'description' => $role['description'],
                ]
            );
        }
    }
}
