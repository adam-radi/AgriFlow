<?php

namespace App\Notifications;

use App\Models\PurchaseInquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class InquiryCreatedNotification extends Notification
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
        $buyerName = $this->inquiry->buyer?->name ?? 'Un acheteur professionnel';
        $productName = $this->inquiry->product?->name ?? 'un produit';
        $quantity = $this->inquiry->current_quantity;
        $price = $this->inquiry->current_price;

        return [
            'type'         => 'inquiry_created',
            'inquiry_id'   => $this->inquiry->id,
            'title'        => "Nouvelle demande d'achat",
            'message'      => "{$buyerName} a soumis une demande pour {$quantity} kg de {$productName} à {$price} DH/kg.",
            'link'         => "/farmer/inquiries/{$this->inquiry->id}",
            'product_name' => $productName,
            'sender_name'  => $buyerName,
        ];
    }
}
