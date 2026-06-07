<?php

namespace App\Enums;

class DeliveryStatus
{
    const Planned    = 'planned';
    const Assigned   = 'assigned';
    const InTransit  = 'in_transit';
    const Delivered  = 'delivered';
    const Cancelled  = 'cancelled';
}
