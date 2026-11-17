<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateFarmerProfileRequest;
use App\Http\Requests\UpdateProfessionalBuyerProfileRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Retourner les profils de l'utilisateur connecté.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $user->load([
            'roles',
            'farmerProfile',
            'professionalBuyerProfile',
        ]);

        return response()->json([
            'message' => 'Profils récupérés avec succès.',

            'data' => [
                'account' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                ],

                'roles' => $user->roles->pluck('slug'),

                'farmer_profile' => $user->farmerProfile,

                'professional_buyer_profile' =>
                    $user->professionalBuyerProfile,
            ],
        ]);
    }

    /**
     * Créer ou mettre à jour le profil agriculteur.
     */
    public function updateFarmer(
        UpdateFarmerProfileRequest $request
    ): JsonResponse {
        $user = $request->user();

        $profile = $user->farmerProfile()->updateOrCreate(
            [
                'user_id' => $user->id,
            ],
            $request->validated()
        );

        return response()->json([
            'message' =>
                'Profil agriculteur enregistré avec succès.',

            'data' => $profile,
        ]);
    }

    /**
     * Créer ou mettre à jour le profil acheteur.
     */
    public function updateBuyer(
        UpdateProfessionalBuyerProfileRequest $request
    ): JsonResponse {
        $user = $request->user();

        $profile = $user->professionalBuyerProfile()->updateOrCreate(
            [
                'user_id' => $user->id,
            ],
            $request->validated()
        );

        return response()->json([
            'message' =>
                'Profil acheteur enregistré avec succès.',

            'data' => $profile,
        ]);
    }
}