<?php

namespace App\Enums;

class PaymentStatus
{
    const Pending  = 'pending';
    const Paid     = 'paid';
    const Failed   = 'failed';
    const Refunded = 'refunded';
}
