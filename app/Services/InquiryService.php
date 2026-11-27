<?php

namespace App\Services;

use App\Enums\InquiryStatus;
use App\Models\Harvest;
use App\Models\InquiryNegotiation;
use App\Models\Product;
use App\Models\ProductQuantity;
use App\Models\PurchaseInquiry;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InquiryService
{
    public function createInquiry(Request $request, User $buyer): PurchaseInquiry
    {
        $productId = $request->input('product_id');
        $product = Product::findOrFail($productId);

        if ($product->is_available === false) {
            throw ValidationException::withMessages([
                'product_id' => 'Ce produit agricole n\'est actuellement pas disponible.',
            ]);
        }

        $farmerId = $product->user_id;

        if ($farmerId === $buyer->id) {
            throw ValidationException::withMessages([
                'product_id' => 'Vous ne pouvez pas initier une demande sur votre propre produit.',
            ]);
        }

        $harvestId = $request->input('harvest_id');
        if ($harvestId) {
            $harvest = Harvest::find($harvestId);
            if (!$harvest || $harvest->product_id !== $product->id) {
                throw ValidationException::withMessages([
                    'harvest_id' => 'La récolte spécifiée ne correspond pas à ce produit.',
                ]);
            }
        }

        $quantityStandardId = $request->input('quantity_standard_id');
        if ($quantityStandardId) {
            $quantityStandard = ProductQuantity::find($quantityStandardId);
            if (!$quantityStandard || $quantityStandard->product_id !== $product->id) {
                throw ValidationException::withMessages([
                    'quantity_standard_id' => 'Le conditionnement spécifié n\'est pas valide pour ce produit.',
                ]);
            }
        }

        $quantity = (float) $request->input('quantity');
        $price    = (float) $request->input('proposed_price');
        $zone     = $request->input('delivery_zone') ?: $buyer->zone ?: 'Maroc';
        $date     = $request->input('desired_delivery_date');
        $message  = $request->input('message') ?: 'Demande initiale de cotation directe';

        return DB::transaction(function () use (
            $buyer,
            $farmerId,
            $product,
            $harvestId,
            $quantityStandardId,
            $quantity,
            $price,
            $zone,
            $date,
            $message
        ) {
            $inquiry = PurchaseInquiry::create([
                'buyer_id'              => $buyer->id,
                'farmer_id'             => $farmerId,
                'product_id'            => $product->id,
                'harvest_id'            => $harvestId,
                'quantity_standard_id'  => $quantityStandardId,
                'status'                => InquiryStatus::Pending,
                'initial_quantity'      => $quantity,
                'initial_price'         => $price,
                'current_quantity'      => $quantity,
                'current_price'         => $price,
                'delivery_zone'         => $zone,
                'desired_delivery_date' => $date,
                'notes'                 => $message,
            ]);

            InquiryNegotiation::create([
                'purchase_inquiry_id'    => $inquiry->id,
                'sender_id'              => $buyer->id,
                'sender_role'            => 'buyer',
                'proposed_price'         => $price,
                'proposed_quantity'      => $quantity,
                'proposed_delivery_date' => $date,
                'message'                => $message,
            ]);

            $loaded = $inquiry->load(['buyer', 'farmer', 'product', 'harvest', 'quantityStandard', 'negotiations.sender']);
            try {
                $loaded->farmer?->notify(new \App\Notifications\InquiryCreatedNotification($loaded));
            } catch (\Throwable $e) {}

            return $loaded;
        });
    }

    public function listInquiries(User $user, Request $request)
    {
        $roleFilter = $request->query('as');

        $query = PurchaseInquiry::query();

        if ($user->isAdmin() && !$roleFilter) {
            // Admin can see all
        } elseif ($roleFilter === 'farmer' || ($user->isFarmer() && $roleFilter !== 'buyer')) {
            $query->where('farmer_id', $user->id);
        } else {
            $query->where('buyer_id', $user->id);
        }

        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        return $query->with([
            'buyer',
            'farmer',
            'product',
            'harvest',
            'quantityStandard',
            'negotiations.sender',
        ])->latest()->paginate(15);
    }

    public function showInquiry(PurchaseInquiry $inquiry): PurchaseInquiry
    {
        return $inquiry->load([
            'buyer',
            'farmer',
            'product',
            'harvest',
            'quantityStandard',
            'negotiations.sender',
        ]);
    }

    public function submitCounterOffer(PurchaseInquiry $inquiry, Request $request, User $user): PurchaseInquiry
    {
        if (!$inquiry->canNegotiate()) {
            throw ValidationException::withMessages([
                'status' => "Cette demande a le statut '{$inquiry->status}' et ne peut plus faire l'objet de négociations.",
            ]);
        }

        $price    = (float) $request->input('proposed_price');
        $quantity = (float) $request->input('proposed_quantity');
        $date     = $request->input('proposed_delivery_date') ?: $inquiry->desired_delivery_date;
        $message  = $request->input('message');

        $role = $user->id === $inquiry->farmer_id ? 'farmer' : 'buyer';

        return DB::transaction(function () use ($inquiry, $user, $role, $price, $quantity, $date, $message) {
            InquiryNegotiation::create([
                'purchase_inquiry_id'    => $inquiry->id,
                'sender_id'              => $user->id,
                'sender_role'            => $role,
                'proposed_price'         => $price,
                'proposed_quantity'      => $quantity,
                'proposed_delivery_date' => $date,
                'message'                => $message,
            ]);

            $inquiry->update([
                'status'                => InquiryStatus::Negotiating,
                'current_price'         => $price,
                'current_quantity'      => $quantity,
                'desired_delivery_date' => $date,
            ]);

            return $inquiry->fresh(['buyer', 'farmer', 'product', 'harvest', 'quantityStandard', 'negotiations.sender']);
        });
    }

    public function acceptOffer(PurchaseInquiry $inquiry, User $user): PurchaseInquiry
    {
        if (!$inquiry->canNegotiate()) {
            throw ValidationException::withMessages([
                'status' => "Cette demande est déjà '{$inquiry->status}' et ne peut être acceptée à nouveau.",
            ]);
        }

        $role = $user->id === $inquiry->farmer_id ? 'farmer' : 'buyer';

        return DB::transaction(function () use ($inquiry, $user, $role) {
            $inquiry->update([
                'status' => InquiryStatus::Accepted,
            ]);

            InquiryNegotiation::create([
                'purchase_inquiry_id'    => $inquiry->id,
                'sender_id'              => $user->id,
                'sender_role'            => $role,
                'proposed_price'         => $inquiry->current_price,
                'proposed_quantity'      => $inquiry->current_quantity,
                'proposed_delivery_date' => $inquiry->desired_delivery_date,
                'message'                => "Proposition acceptée par {$user->name}. En attente de confirmation définitive.",
            ]);

            $fresh = $inquiry->fresh(['buyer', 'farmer', 'product', 'harvest', 'quantityStandard', 'negotiations.sender']);
            try {
                $fresh->buyer?->notify(new \App\Notifications\InquiryAcceptedNotification($fresh));
            } catch (\Throwable $e) {}

            return $fresh;
        });
    }

    public function confirmAgreement(PurchaseInquiry $inquiry, User $user): PurchaseInquiry
    {
        if (in_array($inquiry->status, [InquiryStatus::Confirmed, InquiryStatus::Rejected, InquiryStatus::Cancelled])) {
            throw ValidationException::withMessages([
                'status' => "Cette transaction a déjà le statut '{$inquiry->status}'.",
            ]);
        }

        $role = $user->id === $inquiry->farmer_id ? 'farmer' : 'buyer';

        return DB::transaction(function () use ($inquiry, $user, $role) {
            $inquiry->update([
                'status' => InquiryStatus::Confirmed,
            ]);

            InquiryNegotiation::create([
                'purchase_inquiry_id'    => $inquiry->id,
                'sender_id'              => $user->id,
                'sender_role'            => $role,
                'proposed_price'         => $inquiry->current_price,
                'proposed_quantity'      => $inquiry->current_quantity,
                'proposed_delivery_date' => $inquiry->desired_delivery_date,
                'message'                => "Accord commercial confirmé définitivement par {$user->name}. Lot prêt pour préparation.",
            ]);

            $fresh = $inquiry->fresh(['buyer', 'farmer', 'product', 'harvest', 'quantityStandard', 'negotiations.sender']);
            try {
                $target = $user->id === $fresh->buyer_id ? $fresh->farmer : $fresh->buyer;
                $target?->notify(new \App\Notifications\InquiryConfirmedNotification($fresh));
            } catch (\Throwable $e) {}

            return $fresh;
        });
    }

    public function rejectInquiry(PurchaseInquiry $inquiry, Request $request, User $user): PurchaseInquiry
    {
        if (in_array($inquiry->status, [InquiryStatus::Confirmed, InquiryStatus::Delivered])) {
            throw ValidationException::withMessages([
                'status' => "Impossible de rejeter une transaction déjà confirmée ou livrée.",
            ]);
        }

        $reason = $request->input('message') ?: 'Demande refusée par ' . $user->name;
        $role   = $user->id === $inquiry->farmer_id ? 'farmer' : 'buyer';

        return DB::transaction(function () use ($inquiry, $user, $role, $reason) {
            $inquiry->update([
                'status' => InquiryStatus::Rejected,
            ]);

            InquiryNegotiation::create([
                'purchase_inquiry_id'    => $inquiry->id,
                'sender_id'              => $user->id,
                'sender_role'            => $role,
                'proposed_price'         => $inquiry->current_price,
                'proposed_quantity'      => $inquiry->current_quantity,
                'proposed_delivery_date' => $inquiry->desired_delivery_date,
                'message'                => "Motif de refus : {$reason}",
            ]);

            $fresh = $inquiry->fresh(['buyer', 'farmer', 'product', 'harvest', 'quantityStandard', 'negotiations.sender']);
            try {
                $fresh->buyer?->notify(new \App\Notifications\InquiryRejectedNotification($fresh, $reason));
            } catch (\Throwable $e) {}

            return $fresh;
        });
    }

    public function cancelInquiry(PurchaseInquiry $inquiry, User $user): PurchaseInquiry
    {
        if ($inquiry->buyer_id !== $user->id && !$user->isAdmin()) {
            throw ValidationException::withMessages([
                'user' => 'Seul l\'acheteur initiateur peut annuler cette demande.',
            ]);
        }

        if (in_array($inquiry->status, [InquiryStatus::Confirmed, InquiryStatus::Delivered])) {
            throw ValidationException::withMessages([
                'status' => "Impossible d'annuler une transaction déjà confirmée.",
            ]);
        }

        return DB::transaction(function () use ($inquiry, $user) {
            $inquiry->update([
                'status' => InquiryStatus::Cancelled,
            ]);

            InquiryNegotiation::create([
                'purchase_inquiry_id'    => $inquiry->id,
                'sender_id'              => $user->id,
                'sender_role'            => 'buyer',
                'proposed_price'         => $inquiry->current_price,
                'proposed_quantity'      => $inquiry->current_quantity,
                'proposed_delivery_date' => $inquiry->desired_delivery_date,
                'message'                => 'Demande annulée par l\'acheteur.',
            ]);

            return $inquiry->fresh(['buyer', 'farmer', 'product', 'harvest', 'quantityStandard', 'negotiations.sender']);
        });
    }

    public function updateDeliveryStatus(PurchaseInquiry $inquiry, string $status, User $user): PurchaseInquiry
    {
        $validStatuses = [InquiryStatus::InDelivery, InquiryStatus::Delivered];

        if (!in_array($status, $validStatuses, true)) {
            throw ValidationException::withMessages([
                'status' => "Statut de livraison invalide: '{$status}'.",
            ]);
        }

        if (!in_array($inquiry->status, [InquiryStatus::Confirmed, InquiryStatus::InDelivery])) {
            throw ValidationException::withMessages([
                'status' => "La transaction doit être confirmée avant de passer en livraison.",
            ]);
        }

        $role = $user->id === $inquiry->farmer_id ? 'farmer' : 'admin';

        return DB::transaction(function () use ($inquiry, $status, $user, $role) {
            $inquiry->update([
                'status' => $status,
            ]);

            $label = $status === InquiryStatus::InDelivery ? "Lot expédié et en cours d'acheminement" : "Lot réceptionné et validé conforme";

            InquiryNegotiation::create([
                'purchase_inquiry_id'    => $inquiry->id,
                'sender_id'              => $user->id,
                'sender_role'            => $role,
                'proposed_price'         => $inquiry->current_price,
                'proposed_quantity'      => $inquiry->current_quantity,
                'proposed_delivery_date' => $inquiry->desired_delivery_date,
                'message'                => "Mise à jour logistique : {$label}",
            ]);

            return $inquiry->fresh(['buyer', 'farmer', 'product', 'harvest', 'quantityStandard', 'negotiations.sender']);
        });
    }
}
