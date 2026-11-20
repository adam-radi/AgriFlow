<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Verification\SubmitVerificationRequest;
use App\Http\Resources\VerificationRequestResource;
use App\Services\VerificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function __construct(
        private readonly VerificationService $verificationService
    ) {
    }

    /**
     * Soumettre une demande en tant qu'agriculteur.
     */
    public function submitFarmer(
        SubmitVerificationRequest $request
    ): JsonResponse {
        return $this->submit($request, 'farmer');
    }

    /**
     * Soumettre une demande en tant qu'acheteur professionnel.
     */
    public function submitBuyer(
        SubmitVerificationRequest $request
    ): JsonResponse {
        return $this->submit($request, 'professional_buyer');
    }

    /**
     * Consulter la demande active.
     */
    public function active(Request $request): JsonResponse
    {
        $verificationRequest = $this->verificationService
            ->getActiveRequest($request->user());

        if (!$verificationRequest) {
            return response()->json([
                'success' => true,
                'message' => 'Aucune demande active.',
                'data' => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => new VerificationRequestResource(
                $verificationRequest
            ),
        ]);
    }

    /**
     * Consulter l'historique des demandes.
     */
    public function history(Request $request)
    {
        $history = $this->verificationService
            ->getHistory($request->user());

        return VerificationRequestResource::collection($history);
    }

    /**
     * Méthode interne commune aux deux types de compte.
     */
    private function submit(
        SubmitVerificationRequest $request,
        string $accountType
    ): JsonResponse {
        $validated = $request->validated();

        $verificationRequest = $this->verificationService->submit(
            $request->user(),
            $accountType,
            $validated,
            $validated['documents'] ?? []
        );

        return response()->json([
            'success' => true,
            'message' => 'Votre demande de vérification a été soumise.',
            'data' => new VerificationRequestResource(
                $verificationRequest
            ),
        ], 201);
    }
}
