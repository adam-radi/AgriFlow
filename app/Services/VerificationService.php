<?php

namespace App\Services;

use App\Enums\VerificationStatus;
use App\Models\User;
use App\Models\VerificationDocument;
use App\Models\VerificationRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Throwable;

class VerificationService
{
    /**
     * Soumettre une nouvelle demande de vérification.
     *
     * $accountType : farmer ou professional_buyer
     * $data        : données complémentaires du dossier
     * $documents   : fichiers transmis par l'utilisateur
     */
    public function submit( User $user,string $accountType,array $data,array $documents = [] ): VerificationRequest {
      
        $storedFiles = [];

        try {
            return DB::transaction(function () use (
                $user,
                $accountType,
                $data,
                $documents,
                &$storedFiles
            ) {
                // Verrouille la ligne utilisateur pour éviter
                // deux soumissions simultanées.
                User::query()
                    ->whereKey($user->getKey())
                    ->lockForUpdate()
                    ->firstOrFail();

                $activeRequest = VerificationRequest::query()
                    ->where('active_user_id', $user->getKey())
                    ->first();

                if ($activeRequest) {
                    throw ValidationException::withMessages([
                        'verification' => [
                            'Vous avez déjà une demande de vérification active.',
                        ],
                    ]);
                }

                $request = VerificationRequest::create([
                    'user_id' => $user->getKey(),
                    'active_user_id' => $user->getKey(),
                    'status' => VerificationStatus::PENDING,
                    'account_type' => $accountType,
                    'submitted_at' => now(),
                ]);

                foreach ($documents as $document) {
                    if (
                        !isset($document['file']) ||
                        !$document['file'] instanceof UploadedFile
                    ) {
                        continue;
                    }

                    /** @var UploadedFile $file */
                    $file = $document['file'];

                    $path = $file->store(
                        'verifications/' . $request->getKey(),
                        'local'
                    );

                    if (!$path) {
                        throw new \RuntimeException(
                            'Impossible d’enregistrer un document.'
                        );
                    }

                    $storedFiles[] = $path;

                    VerificationDocument::create([
                        'verification_request_id' => $request->getKey(),
                        'uploaded_by' => $user->getKey(),
                        'document_type' => $document['type'],
                        'original_name' => $file->getClientOriginalName(),
                        'disk' => 'local',
                        'file_path' => $path,
                        'mime_type' => $file->getMimeType(),
                        'file_size' => $file->getSize(),
                        'checksum' => hash_file(
                            'sha256',
                            $file->getRealPath()
                        ),
                    ]);
                }

                return $request->load(['documents', 'reviews']);
            });
        } catch (Throwable $exception) {
            // Nettoyage des fichiers si la transaction échoue.
            foreach ($storedFiles as $path) {
                Storage::disk('local')->delete($path);
            }

            throw $exception;
        }
    }

    /**
     * Récupérer la demande active d'un utilisateur.
     */
    public function getActiveRequest(User $user): ?VerificationRequest
    {
        return VerificationRequest::query()
            ->where('active_user_id', $user->getKey())
            ->with(['documents', 'reviews'])
            ->latest()
            ->first();
    }

    /**
     * Récupérer l'historique complet d'un utilisateur.
     */
    public function getHistory(User $user)
    {
        return VerificationRequest::query()
            ->where('user_id', $user->getKey())
            ->with(['documents', 'reviews'])
            ->latest()
            ->paginate(10);
    }

    /**
     * Vérifier si l'utilisateur possède une demande active.
     */
    public function hasActiveRequest(User $user): bool
    {
        return VerificationRequest::query()
            ->where('active_user_id', $user->getKey())
            ->exists();
    }
}
