<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class InquiryNegotiationResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                     => $this->id,
            'purchase_inquiry_id'    => $this->purchase_inquiry_id,
            'sender_id'              => $this->sender_id,
            'sender_name'            => $this->sender?->name,
            'sender_role'            => $this->sender_role,
            'proposed_price'         => (float) $this->proposed_price,
            'proposed_quantity'      => (float) $this->proposed_quantity,
            'proposed_total'         => (float) ($this->proposed_price * $this->proposed_quantity),
            'proposed_delivery_date' => $this->proposed_delivery_date?->toDateString(),
            'message'                => $this->message,
            'created_at'             => $this->created_at,
        ];
    }
}
