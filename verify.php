<?php
use App\Models\User;
use App\Models\Product;
use App\Models\Harvest;
use App\Models\Order;
use App\Models\Payment;
use App\Models\DeliveryGroup;

echo "Users: " . User::count() . "\n";
echo "Products: " . Product::count() . "\n";
echo "Harvests: " . Harvest::count() . "\n";
echo "Orders: " . Order::count() . "\n";
echo "Payments: " . Payment::count() . "\n";
echo "DeliveryGroups: " . DeliveryGroup::count() . "\n\n";
echo "Users list:\n";
foreach (User::all() as $u) {
    echo "  {$u->email} | {$u->role}\n";
}
