<?php

namespace App\Notifications;

use App\Models\PurchaseInquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class InquiryAcceptedNotification extends Notification
{
    use Queueable;

    public function __construct(public PurchaseInquiry $inquiry)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $farmerName = $this->inquiry->farmer?->name ?? 'Le producteur';
        $productName = $this->inquiry->product?->name ?? 'votre produit';

        return [
            'type'         => 'inquiry_accepted',
            'inquiry_id'   => $this->inquiry->id,
            'title'        => "Demande d'achat acceptée",
            'message'      => "{$farmerName} a accepté votre proposition pour {$productName}. Vous pouvez maintenant confirmer la commande.",
            'link'         => "/client/inquiries/{$this->inquiry->id}",
            'product_name' => $productName,
            'sender_name'  => $farmerName,
        ];
    }
}
