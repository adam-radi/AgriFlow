<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Http\Kernel::class);

echo 'Users: '.App\Models\User::count()."\n";
echo 'Products: '.App\Models\Product::count()."\n";
echo 'Harvests: '.App\Models\Harvest::count()."\n";
echo 'Orders: '.App\Models\Order::count()."\n";
echo 'Payments: '.App\Models\Payment::count()."\n";
echo 'DeliveryGroups: '.App\Models\DeliveryGroup::count()."\n\n";
echo "Users list:\n";
foreach (App\Models\User::all() as $u) {
    echo '  '.$u->email.' | '.$u->role."\n";
}
