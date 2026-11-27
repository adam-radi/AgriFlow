<?php

namespace App\Notifications;

use App\Models\PurchaseInquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class InquiryConfirmedNotification extends Notification
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
        $buyerName = $this->inquiry->buyer?->name ?? 'L\'acheteur';
        $productName = $this->inquiry->product?->name ?? 'le produit';
        $quantity = $this->inquiry->current_quantity;
        $price = $this->inquiry->current_price;

        return [
            'type'         => 'inquiry_confirmed',
            'inquiry_id'   => $this->inquiry->id,
            'title'        => "Commande confirmée définitivement",
            'message'      => "{$buyerName} a confirmé l'accord d'achat pour {$quantity} kg de {$productName} à {$price} DH/kg.",
            'link'         => "/farmer/inquiries/{$this->inquiry->id}",
            'product_name' => $productName,
            'sender_name'  => $buyerName,
        ];
    }
}
