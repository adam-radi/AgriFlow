<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAccountRequest;
use App\Http\Requests\UpdatePasswordRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
    /**
     * Consulter les informations personnelles.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $user->load('roles');

        return response()->json([
            'message' => 'Informations du compte récupérées.',

            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,

                'roles' => $user->roles->pluck('slug'),
            ],
        ]);
    }

    /**
     * Modifier les informations personnelles.
     */
    public function update(
        UpdateAccountRequest $request
    ): JsonResponse {
        $user = $request->user();

        $user->update(
            $request->validated()
        );

        return response()->json([
            'message' =>
                'Les informations du compte ont été mises à jour.',

            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
        ]);
    }

    /**
     * Modifier le mot de passe.
     */
    public function updatePassword(
        UpdatePasswordRequest $request
    ): JsonResponse {
        $user = $request->user();

        $user->update([
            'password' => Hash::make(
                $request->validated()['password']
            ),
        ]);

        return response()->json([
            'message' =>
                'Le mot de passe a été modifié avec succès.',
        ]);
    }
}