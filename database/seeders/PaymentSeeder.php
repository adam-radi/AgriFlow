<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\Order;
use App\Enums\PaymentStatus;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $confirmedOrders = Order::where('status', 'confirmed')->get();
        $deliveredOrders = Order::where('status', 'delivered')->get();

        // Payment for the first confirmed order (Order 2 - Saffron)
        $order2 = $confirmedOrders->first();
        if ($order2) {
            Payment::create([
                'order_id'       => $order2->id,
                'amount'         => $order2->total_amount,
                'status'         => PaymentStatus::Paid,
                'provider'       => 'cash',
                'transaction_id' => 'TXN-' . strtoupper(bin2hex(random_bytes(6))),
            ]);
        }

        // Payment for the delivered order (Order 5 - Dates + Mint)
        $order5 = $deliveredOrders->first();
        if ($order5) {
            Payment::create([
                'order_id'       => $order5->id,
                'amount'         => $order5->total_amount,
                'status'         => PaymentStatus::Paid,
                'provider'       => 'cash',
                'transaction_id' => 'TXN-' . strtoupper(bin2hex(random_bytes(6))),
            ]);
        }

        // Payment for the confirmed Rabat order (Order 6 - Couscous + Cactus)
        if ($confirmedOrders->count() > 1) {
            $order6 = $confirmedOrders->last();
            Payment::create([
                'order_id'       => $order6->id,
                'amount'         => $order6->total_amount,
                'status'         => PaymentStatus::Pending,
                'provider'       => 'card',
                'transaction_id' => 'TXN-' . strtoupper(bin2hex(random_bytes(6))),
            ]);
        }

        $this->command->info('3 seed payments created');
    }
}
