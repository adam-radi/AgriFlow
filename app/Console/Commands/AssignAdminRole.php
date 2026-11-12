<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;

class AssignAdminRole extends Command
{
    protected $signature = 'users:assign-admin {email}';

    protected $description =
        'Attribuer le rôle administrateur à un utilisateur existant.';

    public function handle(): int
    {
        $email = $this->argument('email');

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error(
                "Aucun utilisateur trouvé avec l'adresse : {$email}"
            );

            return self::FAILURE;
        }

        $role = Role::where('slug', Role::ADMIN)->first();

        if (!$role) {
            $this->error(
                'Le rôle admin est introuvable. Exécutez les seeders.'
            );

            return self::FAILURE;
        }

        if ($user->hasRole(Role::ADMIN)) {
            $this->info(
                'Cet utilisateur possède déjà le rôle administrateur.'
            );

            return self::SUCCESS;
        }

        $user->roles()->syncWithoutDetaching([
            $role->id,
        ]);

        $this->info(
            "Le rôle administrateur a été attribué à {$user->email}."
        );

        return self::SUCCESS;
    }
}