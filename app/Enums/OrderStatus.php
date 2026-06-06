<?php

namespace App\Enums;

enum OrderStatus
{
    const Pending = 'pending';
    const Processing = 'Processing';
    const Completed = 'Completed';
    const Canceled = 'canceled';
}
